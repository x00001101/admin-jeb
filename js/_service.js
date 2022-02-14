
alertify.serviceDialog ||
  alertify.dialog("serviceDialog", function factory() {
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
  }, false, 'alert');

(($) => {
  "use strict";

  const addService = (res) => {
    alertify.serviceDialog(res).resizeTo(500,500).set("onok", function(closeEvent) {
      const id = $("#txtServiceId").val().toUpperCase(),
        name = $("#txtServiceName").val(),
        description = $("#txtServiceDescription").val(),
        set_price = $("#txtSetPrice").val();

      if (id===""||name===""||description===""||set_price==="") {
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
          description: description
        },
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        },
        success: (res) => {
          alertify.notify('Data berhasil disimpan!', 'success', 5, function() {});
        },
        statusCode: {
          500: (err) => {
            alertify.error("Gagal menyimpan data!");
          }
        }
      })
    });
  }

  $("#btn_addService").click(function () {
    $.ajax({
      url: "pages/__addService.html",
      success: addService
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
      $("#table-courier").DataTable({
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
            className: 'select-checkbox',
            targets: 0,
            defaultContent: '',
          },
          {
            className: 'dt-right',
            targets: 3
          },
        ],
        select: {
          style: 'os',
          selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]]
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
