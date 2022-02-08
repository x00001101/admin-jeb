(($) => {
  "use strict";

  const accessToken = localStorage.getItem("header") || Cookies.get("header");

  // load data tables
  $.ajax({
    url: `${url}/orders`,
    type: "GET",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    },
    success: (res) => {
      $("#table-order").DataTable({
        data: res,
        columns: [{ data: null }, { data: "id" }],
        columnDefs: [
          {
            orderable: false,
            className: "select-checkbox",
            targets: 0,
            defaultContent: "",
          },
        ],
        // select: {
        //   style: "os",
        //   selector: "td:first-child",
        // },
        order: [[1, "asc"]],
      });
      $("#table-order tbody").on("click", "tr", function () {
        $(this).toggleClass("selected");
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
