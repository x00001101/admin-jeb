alertify.coureirPostDialog ||
  alertify.dialog(
    "coureirPostDialog",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok" }],
            options: {
              title: "Form Pos Kurir",
              frameless: false,
            },
          };
        },
      };
    },
    false,
    "alert"
  );
alertify.regionDialog ||
  alertify.dialog(
    "regionDialog",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok", key: 13 /*Enter*/ }],
            focus: { element: 0 },
            options: {
              title: "Daftar Wilayah",
              startMaximized: true,
            },
          };
        },
      };
    },
    false,
    "alert"
  );

(($) => {
  "use strict";

  const accessToken = localStorage.getItem("header") || Cookies.get("header");
  const regionPage = (res) => {
    alertify.regionDialog(res).set("onok", function (closeEvent) {
      if ($("#idSrc").val() !== "v") {
        alertify.error("Data yang dipilih tidak sesuai!");
        closeEvent.cancel = true;
        return false;
      }

      let data = $("#table-region").DataTable().rows(".selected").data();
      let ids = "";
      for (var i = 0; i < data.length; i++) {
        ids += data[i]["id"] + ";";
      }
      ids = ids.slice(0, -1);

      const courierId = $("#dtId").val();
      $.ajax({
        url: `${url}/courier/setPost/${courierId}`,
        type: "POST",
        dataType: "JSON",
        data: {
          posts: ids,
        },
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        },
        success: (res) => {
          alertify.notify(
            "Data berhasil ditambahkan!",
            "success",
            5,
            function () {}
          );
        },
        statusCode: {
          500: (err) => {
            alertify.error("Terjadi kesalahan!");
          },
          400: (err) => {
            console.log(err);
          },
        },
      });
    });
    // call once
    get_region(0, "p", "");
    // set check box
    $("#checkCovered").click(function () {
      let curSrc = $("#idSrc").val();
      let curPid = $("#idPid").val();
      if ($(this).is(":checked")) {
        get_region(1, curSrc, curPid, 1);
      } else {
        get_region(0, curSrc, curPid, 1);
      }
    });
  };
  const get_region = (covered, src, pid, check) => {
    var breadCrumbs = {
      p: "Province",
      r: "Regency",
      d: "District",
      v: "Village",
    };

    let params = "";
    if (typeof src !== "undefined") {
      params += "src=" + src;
    }
    if (typeof pid !== "undefined" && pid != "") {
      params += "&pid=" + pid;
    }
    if (typeof covered !== "undefined" && covered) {
      params += "&covered=" + covered;
    }
    if (typeof check === "undefined") {
      check = false;
    }
    params += "&val=";
    $.ajax({
      url: `${url}/regions?${params}`,
      success: (res) => {
        if (!check) {
          $("#checkCovered").prop("checked", false);
          if ($("#idPrefSrc").val() != src) {
            var bc = $("#regionBreadCrumbs").text();
            bc += " > " + breadCrumbs[src];
            $("#regionBreadCrumbs").text(bc);
          }
        }
        $("#idSrc").val(src);
        $("#idPid").val(pid);

        $("#table-region").DataTable().destroy();
        $("#table-region tbody").unbind();
        $("#table-region").DataTable({
          data: res,
          columns: [{ data: "id" }, { data: "name" }],
          columnDefs: [
            {
              targets: 2,
              data: null,
              className: "dt-center",
              render: (data, type, row) => {
                let button =
                  "<button type='button' class='btn btn-primary btn-sm'><i class='fa fa-step-forward'></i></button>";

                if (src === "v") {
                  button = "";
                }

                return button;
              },
              // defaultContent:
              //   "<button type='button' class='btn btn-primary btn-sm'><i class='fa fa-step-forward'></i></button>",
            },
          ],
          select: {
            style: "multi+shift",
            selector: "td:nth-child(1)",
          },
          dom: "Blfrtip",
          buttons: ["selectAll", "selectNone"],
        });
        $("#table-region tbody").on("click", "button", function () {
          var data = $("#table-region")
            .DataTable()
            .row($(this).parents("tr"))
            .data();
          //get next data
          let curSrc = $("#idSrc").val();
          let nextSrc = "";
          switch (curSrc) {
            case "p":
              nextSrc = "r";
              break;
            case "r":
              nextSrc = "d";
              break;
            case "d":
              nextSrc = "v";
              break;
          }
          $("#idPrefSrc").val(curSrc);
          $("#idPrefPid").val(pid);
          get_region(0, nextSrc, data["id"]);
        });
      },
    });
  };

  // load data tables

  $.ajax({
    url: `${url}/couriers`,
    type: "GET",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    },
    success: (res) => {
      $("#table-courier").DataTable({
        data: res,
        columns: [
          { data: null },
          { data: "fullName" },
          { data: "phoneNumber" },
          { data: "email" },
          { data: "id" },
        ],
        columnDefs: [
          {
            orderable: false,
            className: "select-checkbox",
            targets: 0,
            defaultContent: "",
          },
          {
            targets: 4,
            visible: false,
            searchable: false,
          },
          {
            targets: 5,
            data: null,
            className: "dt-center",
            render: (data, type, row) => {
              let button =
                "<button type='button' class='btn btn-primary btn-sm'><i class='fa fa-wrench'></i></button>";

              return button;
            },
          },
        ],
        select: {
          style: "os",
          selector: "td:first-child",
        },
        order: [[1, "asc"]],
      });

      $("#table-courier tbody").on("click", "button", function () {
        var data = $("#table-courier")
          .DataTable()
          .row($(this).parents("tr"))
          .data();
        $.ajax({
          url: "pages/setCourierPost/__courierPost.html",
          success: (res) => {
            alertify.coureirPostDialog(res).resizeTo(700, 800);
            $("#spName").text(data["fullName"]);
            $("#spPhone").text(data["phoneNumber"]);
            $("#spEmail").text(data["email"]);
            $("#dtId").val(data["id"]);

            $("#addPost").click(function () {
              $.ajax({
                url: "pages/common/__regionPage.html",
                success: regionPage,
              });
            });

            $.ajax({
              url: `${url}/couriers/getPost/${data.id}`,
              type: "GET",
              dataType: "JSON",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
              },
              success: (res) => {
                $("#table-courier-post").DataTable({
                  data: res,
                  columns: [
                    { data: null },
                    { data: "VillageId" },
                    {
                      data: null,
                      render: (data, type, row) => {
                        return data.Village.name;
                      },
                    },
                  ],
                  columnDefs: [
                    {
                      orderable: false,
                      className: "select-checkbox",
                      targets: 0,
                      defaultContent: "",
                    },
                  ],
                });
              },
            });
          },
        });
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
