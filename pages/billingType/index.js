// myAlert dialog
alertify.addNewBillingType ||
  alertify.dialog(
    "addNewBillingType",
    function factory() {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            buttons: [{ text: "Ok" }],
            options: {
              title: "Form Pembuatan Metode Pembayaran Baru",
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
  $.ajax({
    url: `${url}/billingTypes`,
    type: "GET",
    success: (res) => {
      $("#table-billing-type").DataTable({
        data: res,
        columns: [
          { data: null },
          { data: "id" },
          { data: "description" },
          { data: "autoPaid" },
          { data: "payToCust" },
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
            targets: 5,
            className: "dt-center",
            render: (data, type, row) => {
              return "<button type='button' class='btn btn-danger btn-sm del'><i class='fa fa-trash'></i></button>";
            },
          },
        ],
      });

      $("#table-billing-type tbody").on("click", "button.del", function () {
        var data = $("#table-billing-type")
          .DataTable()
          .row($(this).parents("tr"))
          .data();
        $.ajax({
          url: `${url}/billingtypes/${data.id}`,
          type: "DELETE",
          success: (res) => {
            alertify.notify("Data berhasil dihapus", "success", 2, () => {
              $("#billingType").trigger("click");
            });
          },
        });
      });
    },
  });

  $("#btn_addBillingType").click(() => {
    $.ajax({
      url: "pages/billingType/__addNewBillingType.html",
      success: (res) => {
        alertify
          .addNewBillingType(res)
          .resizeTo(600, 600)
          .set("onok", function (closeEvent) {
            var id = $("#idBillingType").val().toUpperCase();
            var des = $("#descriptionBillingType").val();
            var ap = $("#autoPaid").val();
            var pc = $("#payToCust").val();

            if (id === "" || des === "") {
              alertify.error("Data masih kosong!");
              closeEvent.cancel = true;
              return false;
            }

            $.ajax({
              url: `${url}/billingtypes`,
              type: "POST",
              dataType: "JSON",
              data: {
                id: id,
                description: des,
                autoPaid: ap,
                payToCust: pc,
              },
              success: (res) => {
                alertify.notify(
                  "Data berhasil ditambahkan",
                  "success",
                  2,
                  () => {
                    $("#billingType").trigger("click");
                  }
                );
              },
            });
          });
      },
    });
  });
})(jQuery);
