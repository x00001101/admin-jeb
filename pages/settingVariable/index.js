(($) => {
  $.ajax({
    url: `${url}/settings`,
    type: "GET",
    success: (res) => {
      $("#converter").val(res[0].converter);
      $("#courierPercentage").val(res[0].courierPercentage);
      $("#ootPercentage").val(res[0].ootPercentage);
      $("#courierPercentageBonus").val(res[0].courierPercentageBonus);
    },
  });

  $("#saveVariable").click(() => {
    var converter = $("#converter").val();
    var courierPercentage = $("#courierPercentage").val();
    var ootPercentage = $("#ootPercentage").val();
    var courierPercentageBonus = $("#courierPercentageBonus").val();
    $.ajax({
      url: `${url}/settings`,
      type: "PUT",
      dataType: "JSON",
      data: {
        converter: converter,
        courierPercentage: courierPercentage,
        ootPercentage: ootPercentage,
        courierPercentageBonus: courierPercentageBonus,
      },
      success: (res) => {
        alertify.success("Data disimpan");
      },
    });
  });
})(jQuery);
