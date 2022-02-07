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
          { 
            data: null, 
            render: (data, type, row) => {
              return data.region.Regency.Province.name + ", " + data.region.Regency.name + ", " + data.region.name;
            }
          },
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
            targets: 3,
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
