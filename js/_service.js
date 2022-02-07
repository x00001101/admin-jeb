(($) => {
  "use strict";

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
