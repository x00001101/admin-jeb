(($) => {
  "use strict";

  const accessToken = localStorage.getItem("header") || Cookies.get("header");

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
            className: 'select-checkbox',
            targets: 0,
            defaultContent: '',
          },
          {
            targets: 4,
            visible: false,
            searchable: false
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
