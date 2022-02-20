alertify.serviceDialog ||
  alertify.dialog(
    "serviceDialog",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok" }],
            options: {
              title: "Form Pembuatan Service Baru",
              frameless: false,
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

  const addService = (res) => {
    alertify
      .serviceDialog(res)
      .resizeTo(500, 500)
      .set("onok", function (closeEvent) {
        const id = $("#txtServiceId").val().toUpperCase(),
          name = $("#txtServiceName").val(),
          description = $("#txtServiceDescription").val(),
          set_price = $("#txtSetPrice").val();

        if (
          id === "" ||
          name === "" ||
          description === "" ||
          set_price === ""
        ) {
          alertify.error("Data masih ada yang kosong!");
          closeEvent.cancel = true;
        }

        $.ajax({
          url: `${url}/services`,
          type: "POST",
          dataType: "JSON",
          data: {
            id: id,
            name: name,
            set_price: set_price,
            description: description,
          },
          beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
          },
          success: (res) => {
            alertify.notify("Data berhasil disimpan", "success", 2, () => {
              $("#service").trigger("click");
            });
          },
          statusCode: {
            500: (err) => {
              alertify.error("Gagal menyimpan data!");
            },
          },
        });
      });
  };

  $("#btn_addService").click(function () {
    $.ajax({
      url: "pages/service/__addService.html",
      success: addService,
    });
  });

  const accessToken = localStorage.getItem("header") || Cookies.get("header");

  // load data tables
  $.ajax({
    url: `${url}/services`,
    type: "GET",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    },
    success: (res) => {
      $("#table-service").DataTable({
        data: res,
        columns: [
          { data: null },
          { data: "id" },
          { data: "name" },
          { data: "setPrice" },
          { data: "description" },
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
            className: "dt-right",
            targets: 3,
          },
        ],
        select: {
          style: "os",
          selector: "td:first-child",
        },
        order: [[1, "asc"]],
      });

      $("#table-service tbody").on("click", "button.del", function () {
        var data = $("#table-service")
          .DataTable()
          .row($(this).parents("tr"))
          .data();
        alertify.confirm(
          "Hapus Data",
          `ID: ${data.id}</br>
          Nama: ${data.name}`,
          () => {
            $.ajax({
              url: `${url}/services/${data.id}`,
              type: "DELETE",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
              },
              success: (res) => {
                alertify.notify("Data berhasil dihapus", "success", 2, () => {
                  $("#service").trigger("click");
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
