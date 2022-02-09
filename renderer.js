// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const accessToken = localStorage.getItem("header") || Cookies.get("header");

const setPdf = (id) => {
  $.ajax({
    url: `${url}/createPdfAwb?id=${id}&bin=1`,
    type: "GET",
    async: false,
    dataType: "text",
    contentType: "application/pdf",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    },
    success: (res) => {
      // console.log(res);
      // window.electron.savePdf(res);
      var blob = new Blob([res]);
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "filename.pdf";
      link.click();
    },
  });
};

$("#print").click(async () => {
  // window.electron.doPrint();
  // await window.electron.doGetDefaultPrinter();
  var tbl = $("#table-order").DataTable();
  var dt = tbl.rows({ selected: true }).data();
  // console.log(dt[0]);
  for (var i = 0; i < dt.length; i++) {
    setPdf(dt[i]["id"]);
    // console.log(dt[i]["id"]);
  }
});
