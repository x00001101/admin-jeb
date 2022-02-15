( async ($) => {
  'use strict';

  let settingPrinter = await window.jeb.getSettingPrinter();

  $("#printerName").val(settingPrinter.printer);
  $("#orientation").val(settingPrinter.orientation);
  $("#scale").val(settingPrinter.scale);
  $("#monochrome").val(settingPrinter.monochrome);

  $("#btnPrinterSetting").click( async () => {
    let saveData = {
      printer: $("#printerName").val(),
      orientation: $("#orientation").val(),
      scale: $("#scale").val(),
      monochrome: $("#monochrome").val()
    }
    const result = await window.jeb.setSettingPrinter(saveData);
    alertify.notify(result, "success", 5, function(){});
  })

})(jQuery);