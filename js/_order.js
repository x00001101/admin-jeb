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
        columns: [
          { data: null },
          { data: "id" },
          {
            data: null,
            render: (data, type, row) => {
              return data.origin.District.Regency.name;
            },
            // render: (data, type, row) => {
            //   return `${data.destination.District.Regency.Province.name}, ${data.destination.District.Regency.name}, ${data.destination.District.name}, ${data.destination.name}`;
            // },
          },
          {
            data: null,
            render: (data, type, row) => {
              return data.destination.District.Regency.name;
            },
            // render: (data, type, row) => {
            //   return `${data.origin.District.Regency.Province.name}, ${data.origin.District.Regency.name}, ${data.origin.District.name}, ${data.origin.name}`;
            // },
          },
          { data: "ServiceId" },
          {
            data: null,
            render: (data, type, row) => {
              return data.Billing.BillingTypeId;
            },
          },
          { data: "itemValue" },
          {
            data: null,
            render: (data, type, row) => {
              return data.Billing.insuranceAmount;
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              return data.Billing.voucherAmount;
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              return data.Billing.serviceAmount;
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              return Number(data.itemValue) + Number(data.Billing.totalAmount);
            },
          },
        ],
        columnDefs: [
          {
            orderable: false,
            className: "select-checkbox",
            targets: 0,
            defaultContent: "",
          },
        ],
        select: {
          style: "multi+shift",
          selector: "td:not(:first-child)",
        },
        order: [[1, "asc"]],
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
