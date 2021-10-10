$("#modalClose").click(() => {
  $.toggle("modal");
});
$(".countries-toggle").click(() => {
  $.toggle("countries");
});
$(".settings-toggle").click(() => {
  $.toggle("settings");
});
$(".controls-toggle").click(() => {
  $.toggle("controls");
});
$("#countries").mouseleave(() => {
  $.toggle("countries");
});
$("#settings").mouseleave(() => {
  $.toggle("settings");
});
$("#controls").mouseleave(() => {
  $.toggle("controls");
});

jQuery.extend({
  easybuttons: (lt, ln, map) => {
    var toggleDesign = (tiles) => {
      var mapDesign = L.tileLayer(tiles, { maxZoom: 18, minZoom: 3 });

      map.addLayer(mapDesign);
    };

    var findSelf = L.easyButton("far fa-grin-alt findSelf", function () {
      getModal(lt, ln);
    }).addTo(map);

    var areaDetails = L.easyButton(
      "fas fa-search-location findArea",
      function () {
        getModal(map.getCenter().lat, map.getCenter().lng);
      }
    ).addTo(map);

    var toggleDetails = L.easyButton("fas fa-mouse posSettings", function () {
      if ($("#details").css("display") !== "none") {
        $("#details").css("display", "none");
      } else {
        $("#details").css("display", "block");
      }
    }).addTo(map);
  },
  easyButtonControl: () => {
    $(".findSelf").mouseenter(() => {
      $("#findSelfPopup").css("display", "block");
    });
    $(".findSelf").mouseleave(() => {
      $("#findSelfPopup").css("display", "none");
    });
    $(".findSelf").click(() => {
      $("#findSelfPopup").css("display", "none");
    });

    $(".findArea").mouseenter(() => {
      $("#findAreaPopup").css("display", "block");
    });
    $(".findArea").mouseleave(() => {
      $("#findAreaPopup").css("display", "none");
    });
    $(".findArea").click(() => {
      $("#findAreaPopup").css("display", "none");
    });

    $(".posSettings").mouseenter(() => {
      $("#positionPopup").css("display", "block");
    });
    $(".posSettings").mouseleave(() => {
      $("#positionPopup").css("display", "none");
    });
  },
  getEarthquakes: () => {
    $.ajax({
      url: "libs/php/getEarthquakes.php",
      type: "POST",
      dataType: "json",
      success: function (result) {
        earthquakes = result.data.features;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + jqXHR);
        console.log("status: " + textStatus);
        console.log("Error: " + errorThrown);
      },
    });
  },
  getUserLocation: () => {
    navigator.geolocation.getCurrentPosition((p) => {
      getMap(
        p.coords.latitude,
        p.coords.longitude,
        "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=X0PlkmSsHKUx7RRuRWkf"
      );
    });
  },
  latLngToString: (ll) => {
    return "[" + ll.lat.toFixed(5) + "," + ll.lng.toFixed(5) + "]";
  },
  makeMark: (c, map) => {
    var greenPinIcon = L.icon({
      iconUrl: "libs/media/pin-green.ico",
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -36],
    });

    let greenPinMarker = L.marker([c.lat, c.lng], { icon: greenPinIcon })
      .addTo(map)
      .bindPopup(
        `<p style='max-width: 120px;'>click for details about [${c.lat}, ${c.lng}]</p>`
      );

    $(greenPinMarker).click(() => {
      getModal(c.lat, c.lng);
    });
    $(greenPinMarker).contextmenu(() => {
      greenPinMarker.remove();
    });
  },
  showMouseSettings: (map) => {
    $("#zoomLevel").html(map.getZoom());
    $("#mapCentre").html($.latLngToString(map.getCenter()));

    map.on("zoomend", () => {
      $("#zoomLevel").html(map.getZoom());
    });

    map.on("moveend", () => {
      $("#mapCentre").html($.latLngToString(map.getCenter()));
    });

    map.on("mousemove", (e) => {
      $("#mouseLocation").html($.latLngToString(e.latlng));
    });
  },
  showUserLocation: (lt, ln, map) => {
    var userIcon = L.icon({
      iconUrl: "libs/media/user.png",
      iconSize: [42, 42],
      iconAnchor: [21, 42],
      popupAnchor: [0, -36],
    });

    let userMarker = L.marker([lt, ln], { icon: userIcon })
      .addTo(map)
      .bindPopup("<p>your location</p>");

    $(userMarker).click(() => {
      getModal(lt, ln);
    });
  },
  toggle: (m) => {
    if ($(`#${m}`).css("display") !== "none") {
      $(`#${m}`).css("display", "none");
    } else {
      $(`#${m}`).css("display", "block");
    }
  },
});

let getModal = (lt, ln) => {
  $("#details").css("display", "none");
  $("#modal").css("display", "block");

  let loader =
    "<img style='height: 21px; width: 21px;' src='libs/media/loader.svg' alt='loader'/>";

  $("#country").html(loader);
  $("#capital").html(loader);
  $("#population").html(loader);
  $("#currency").html(loader);
  $("#weatherMain").html(loader);
  $("#weatherDescription").html(loader);
  $("#tempMin").html(loader);
  $("#temp").html(loader);
  $("#tempMax").html(loader);
  $("#windSpeed").html(loader);
  $("#windDirection").html(loader);
  $("#wikipediaLinks").html("<img src='libs/media/loader.svg' alt='loader'/>");

  $.ajax({
    url: "libs/php/getCode.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lt,
      lon: ln,
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        getCountry(result.data.countryCode);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("textStatus: " + jqXHR);
      console.log("status: " + textStatus);
      console.log("Error: " + errorThrown);
    },
  });

  function getCountry(code) {
    $.ajax({
      url: "libs/php/getCountry.php",
      type: "POST",
      dataType: "json",
      data: {
        lang: $("#selLang").val(),
        country: code,
      },
      success: function (result) {
        console.log(JSON.stringify(result));
        if (result.status.name == "ok") {
          $("#country").html(result.data[0].countryName);
          $("#capital").html(result.data[0].capital);
          $("#population").html(result.data[0].population);
          $("#currency").html(result.data[0].currencyCode);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + jqXHR);
        console.log("status: " + textStatus);
        console.log("Error: " + errorThrown);
        $("#country").html("error");
        $("#capital").html("error");
        $("#population").html("error");
        $("#currency").html("error");
      },
    });
  }

  $.ajax({
    url: "libs/php/getWeather.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lt,
      lon: ln,
      lang: $("#selLang").val(),
      unit: $("#selUnit").val(),
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        $("#weatherMain").html(result.data.weather[0].main);
        $("#weatherDescription").html(result.data.weather[0].description);
        $("#tempMin").html(result.data.main.temp_min);
        $("#temp").html(result.data.main.temp);
        $("#tempMax").html(result.data.main.temp_max);
        $("#windSpeed").html(result.data.wind.speed);
        $("#windDirection").html(result.data.wind.deg);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("textStatus: " + jqXHR);
      console.log("status: " + textStatus);
      console.log("Error: " + errorThrown);
      $("#weatherMain").html("error");
      $("#weatherDescription").html("error");
      $("#tempMin").html("error");
      $("#temp").html("error");
      $("#tempMax").html("error");
      $("#windSpeed").html("error");
      $("#windDirection").html("error");
    },
  });

  $.ajax({
    url: "libs/php/getWikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: lt,
      lon: ln,
    },
    success: function (result) {
      console.log(JSON.stringify(result));
      if (result.status.name == "ok") {
        $("#wikipediaLinks").empty();
        for (var i = 0; i < result.data.length; i++) {
          $("#wikipediaLinks").append(
            `<div class="m-1 px-2 py-1">
               <tr colspan="2">
                 <td>
                   <a href="http://${result.data[i].wikipediaUrl}" target='blank'>${result.data[i].title}</a>
                 </td>
               </tr>
             </div>`
          );
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("textStatus: " + jqXHR);
      console.log("status: " + textStatus);
      console.log("Error: " + errorThrown);
      $("#wikipediaLinks").html("No Wikipedia links found");
    },
  });
};

let getMap = (lt, ln, tiles) => {
  var map = L.map("map", { center: [lt, ln], zoom: 12, zoomControl: false });
  var mapDesign = L.tileLayer(tiles, { maxZoom: 18, minZoom: 3 });

  var regular = L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=X0PlkmSsHKUx7RRuRWkf",
    { maxZoom: 18, minZoom: 3 }
  );
  var dark = L.tileLayer(
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    { maxZoom: 18, minZoom: 3 }
  );
  var watercolour = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png",
    { maxZoom: 18, minZoom: 3 }
  );
  var satellite = L.tileLayer(
    "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=X0PlkmSsHKUx7RRuRWkf",
    { maxZoom: 18, minZoom: 3 }
  );

  var baseLayers = {
    regular,
    dark,
    watercolour,
    satellite,
  };

  var layers = L.control.layers(baseLayers).addTo(map);

  map.addLayer(mapDesign);

  map.on("click", (e) => {
    $.makeMark(e.latlng, map);
  });

  $.easybuttons(lt, ln, map);
  $.showUserLocation(lt, ln, map);
  $.showMouseSettings(map);
  $.easyButtonControl();
};

$.getUserLocation();
