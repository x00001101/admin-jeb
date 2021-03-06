// myAlert dialog
alertify.postDialog ||
  alertify.dialog(
    "postDialog",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok" }],
            options: {
              title: "Form Pembuatan Pos Baru",
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

                if (src === "d") {
                  button = "";
                }

                return button;
              },
              // defaultContent:
              //   "<button type='button' class='btn btn-primary btn-sm'><i class='fa fa-step-forward'></i></button>",
            },
          ],
          select: {
            style: "single",
            selector: "td:nth-child(1)",
          },
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

  const regionPage = (res) => {
    alertify.regionDialog(res).set("onok", function (closeEvent) {
      let data = $("#table-region").DataTable().rows(".selected").data();
      $("#txtDistrictId").val(data[0].id);
      $("#labelDistrict").text(data[0].name);
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

  const addPost = (res) => {
    alertify
      .postDialog(res)
      .resizeTo(600, 650)
      .set("onok", function (closeEvent) {
        // send to server

        // check if data is empty
        const id = $("#txtPostId").val().toUpperCase(),
          name = $("#txtPostName").val(),
          region_id = $("#txtDistrictId").val(),
          type = $("#txtPostType").val();

        if (id === "" || name === "" || region_id === "" || type === "") {
          alertify.error("Data masih kosong!");
          closeEvent.cancel = true;
        }

        $.ajax({
          url: `${url}/posts`,
          type: "POST",
          dataType: "JSON",
          data: {
            id: id,
            name: name,
            region_id: region_id,
            type: type,
          },
          success: (res) => {
            alertify.notify("Data berhasil disimpan", "success", 2, () => {
              $("#post").trigger("click");
            });
          },
          statusCode: {
            500: (err) => {
              alertify.error("Gagal menyimpan data!");
            },
          },
        });
      });
    $("#btn_regionPage").click(function () {
      $.ajax({
        url: "pages/common/__regionPage.html",
        success: regionPage,
      });
    });
  };

  $("#btn_addPost").click(function () {
    //launch it.
    $.ajax({
      url: "pages/post/__addPost.html",
      success: addPost,
    });
  });
  // load data tables
  $.ajax({
    url: `${url}/posts`,
    type: "GET",
    success: (res) => {
      $("#table-courier").DataTable({
        data: res,
        columns: [
          { data: null },
          { data: "id" },
          { data: "name" },
          { data: "type" },
          {
            data: null,
            render: (data, type, row) => {
              return (
                data.region.Regency.Province.name +
                ", " +
                data.region.Regency.name +
                ", " +
                data.region.name
              );
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
          {
            orderable: false,
            className: "dt-center",
            targets: 5,
            data: null,
            render: (data, type, row) => {
              return "<button type='button' class='btn btn-danger btn-sm del'><i class='fa fa-trash'></i></button>";
            },
          },
          {
            className: "dt-center",
            targets: 3,
          },
        ],
        select: {
          style: "os",
          selector: "td:first-child",
        },
        order: [[1, "asc"]],
      });

      $("#table-courier tbody").on("click", "button.del", function () {
        var data = $("#table-courier")
          .DataTable()
          .row($(this).parents("tr"))
          .data();
        alertify.confirm(
          "Hapus Data",
          `ID: ${data.id}</br>
          Nama: ${data.name}`,
          () => {
            $.ajax({
              url: `${url}/posts/${data.id}`,
              type: "DELETE",
              success: (res) => {
                alertify.notify("Data deleted", "success", 2, () => {
                  $("#post").trigger("click");
                });
              },
            });
          },
          () => {}
        );
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
