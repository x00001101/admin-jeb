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
          { data: "fullName" },
          { data: "phoneNumber" },
          { data: "email" },
        ],
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
