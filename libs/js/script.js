$("#submitCityEventBtn").click(function () {
  $.ajax({
    url: "libs/php/wikipediaEvent.php",
    type: "POST",
    dataType: "json",
    data: {
      city: $("#selCityEvent").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        $("#eventTitle").html(result["data"][0]["title"]);
        $("#eventInfo").html(result["data"][0]["summary"]);
        $("#eventUrl").html(result["data"][0]["wikipediaUrl"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("jqXHR: " + jqXHR["status"]);
      console.log("errorStatus: " + textStatus);
      console.log("error: " + errorThrown);
    },
  });
});

$("#submitCity").click(function () {
  $.ajax({
    url: "libs/php/wikipediaCity.php",
    type: "POST",
    dataType: "json",
    data: {
      lang: $("#selLang").val(),
      city: $("#selCity").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        $("#cityInfo").html(result["data"][0]["summary"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("jqXHR: " + jqXHR);
      console.log("errorStatus: " + textStatus);
      console.log("error: " + errorThrown);
    },
  });
});

$("#postcode").click(function () {
  $.ajax({
    url: "libs/php/postcode.php",
    type: "POST",
    dataType: "json",
    data: {
      code: $("#selCode").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {
        $("#txtCountry").html(result["data"][0]["adminName1"]);
        $("#txtArea").html(result["data"][0]["adminName2"]);
        $("#txtDistrict").html(result["data"][0]["adminName3"]);
        $("#txtPlace").html(result["data"][0]["placeName"]);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("jqXHR: " + jqXHR);
      console.log("errorStatus: " + textStatus);
      console.log("error: " + errorThrown);
    },
  });
});
