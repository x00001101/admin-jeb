// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.jeb.getPathName();

$("#print").click(async () => {
  console.log("prin klik");
  var tbl = $("#table-order").DataTable();
  var dt = tbl.rows({ selected: true }).data();
  for (var i = 0; i < dt.length; i++) {
    window.jeb.printAawb(dt[i]["id"]);
  }
});
