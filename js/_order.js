(($) => {
  "use strict";

  const accessToken = localStorage.getItem("header") || Cookies.get("header");

  const formatDate = (date) => {
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    const dateObj = new Date(date);
    const month = monthNames[dateObj.getMonth()];
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const output = day + "/" + month + "/" + year;
    return output;
  };

  $("#print").click(() => {
    var tbl = $("#table-order").DataTable();
    var dt = tbl.rows({ selected: true }).data();
    for (var i = 0; i < dt.length; i++) {
      window.jeb.printAawb(dt[i]["id"]);
    }
  });

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
              var output = formatDate(data.createdAt);
              return output;
            },
          },
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
          {
            data: null,
            render: (data, type, row) => {
              var val = data.itemValue;
              return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(val);
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              var val = data.Billing.insuranceAmount;
              return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(val);
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              var val = data.Billing.voucherAmount;
              return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(val);
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              var val = data.Billing.serviceAmount;
              return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(val);
            },
          },
          {
            data: null,
            render: (data, type, row) => {
              var val =
                Number(data.itemValue) + Number(data.Billing.totalAmount);
              return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(val);
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
          {
            className: "selector",
            targets: 1,
          },
        ],
        select: {
          style: "multi+shift",
          selector: "td:nth-child(2)",
        },
        // order: [[1, "asc"]],
      });
    },
    statusCode: {
      401: (err) => {
        alert("Unauthorized");
      },
    },
  });
})(jQuery);
