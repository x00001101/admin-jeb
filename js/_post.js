(($) => {
  "use strict";

  const accessToken = localStorage.getItem("header") || Cookies.get("header");

  // load data tables
  $.ajax({
    url: `${url}/posts`,
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
          { data: "type" },
          { data: "regionId" },
        ],
        columnDefs: [ 
          {
            orderable: false,
            className: 'select-checkbox',
            targets:   0,
            defaultContent: '',
          },
          {
            className: 'dt-center',
            targets: [3, 4],
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
