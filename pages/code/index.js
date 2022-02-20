alertify.addNewCodeDialog ||
  alertify.dialog(
    "addNewCodeDialog",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok" }],
            options: {
              title: "Form Pembuatan Code Tracking Baru",
              frameless: false,
            },
          };
        },
      };
    },
    false,
    "alert"
  );
alertify.setCodeAttributes ||
  alertify.dialog(
    "setCodeAttributes",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok" }],
            options: {
              title: "Set Code Attributes",
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
  // load data tables
  $.ajax({
    url: `${url}/codes`,
    type: "GET",
    success: (res) => {
      $("#table-code").DataTable({
        data: res,
        columns: [
          { data: null },
          { data: "id" },
          { data: "name" },
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
            data: null,
            targets: 4,
            render: (data, type, row) => {
              if (typeof data.CodeAttributes[0] !== "undefined") {
                return data.CodeAttributes[0].value;
              }
              return "-";
            },
          },
          {
            data: null,
            targets: 5,
            className: "dt-center",
            render: (data, type, row) => {
              let button =
                "<button type='button' class='btn btn-primary btn-sm opt'><i class='fa fa-wrench'></i></button>\
                <button type='button' class='btn btn-danger btn-sm del'><i class='fa fa-trash'></i></button>";
              return button;
            },
          },
        ],
      });

      $("#table-code tbody").on("click", "button.opt", function () {
        var data = $("#table-code")
          .DataTable()
          .row($(this).parents("tr"))
          .data();
        $.ajax({
          url: `pages/code/__setAttributes.html`,
          success: (res) => {
            alertify.setCodeAttributes(res).resizeTo(700, 600);
            $("#inCodeId").val(data.id);
            $.ajax({
              url: `${url}/codeAttributes/${data.id}`,
              type: "GET",
              success: (res) => {
                $("#table-code-attributes").DataTable({
                  data: res,
                  columns: [
                    { data: null },
                    { data: "id" },
                    { data: "value" },
                    { data: null },
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
                      targets: 3,
                      defaultContent: "",
                    },
                  ],
                });
                $("#btnAddAttribute").click(() => {
                  var inCodeId = $("#inCodeId").val();
                  var value = $("#attributesValue").val();
                  if (value == "") {
                    alertify.error("Data masih kosong");
                    return false;
                  }
                  $.ajax({
                    url: `${url}/codes/${inCodeId}`,
                    type: "PATCH",
                    dataType: "JSON",
                    data: {
                      value: value,
                    },
                    success: (res) => {
                      alertify.notify("Data berhasil ditambahkan", "success");
                    },
                    statusCode: {
                      403: (err) => {
                        alertify.error(err.responseJSON.error);
                      },
                    },
                  });
                });
              },
            });
          },
        });
      });
      $("#table-code tbody").on("click", "button.del", function () {
        var data = $("#table-code")
          .DataTable()
          .row($(this).parents("tr"))
          .data();
        alertify.confirm(
          "Hapus Data",
          `ID: ${data.id}</br>
          Nama: ${data.name}`,
          () => {
            $.ajax({
              url: `${url}/codes/${data.id}`,
              type: "DELETE",
              success: (res) => {
                alertify.notify("Data berhasil dihapus", "success", 2, () => {
                  $("#code").trigger("click");
                });
              },
            });
          },
          () => {}
        );
      });
    },
  });

  $("#btn_addCode").click(() => {
    $.ajax({
      url: "pages/code/__addCode.html",
      success: (res) => {
        alertify
          .addNewCodeDialog(res)
          .resizeTo(500, 500)
          .set("onok", function (closeEvent) {
            var codeId = $("#txtCodeId").val();
            var codeName = $("#txtCodeName").val();
            var codeDescription = $("#txtCodeDescription").val();

            if (codeId == "" || codeName == "" || codeDescription == "") {
              alertify.error("Data yang dipilih tidak sesuai!");
              closeEvent.cancel = true;
              return false;
            }

            saveNewCode(codeId, codeName, codeDescription);
          });
      },
    });
  });

  const saveNewCode = (id, nama, keterangan) => {
    $.ajax({
      url: `${url}/codes`,
      type: "POST",
      dataType: "JSON",
      data: {
        id: id.toUpperCase(),
        name: nama,
        description: keterangan,
      },
      success: (res) => {
        alertify.notify("Saved", "success", 2, () => {
          $("#code").trigger("click");
        });
      },
    });
  };
})(jQuery);
