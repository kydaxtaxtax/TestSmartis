
getAjaxData();

$(function () {
  // инициализация datetimepicker7 и datetimepicker8
  $("#datetimepicker7").datetimepicker({
    format: 'DD.MM.YYYY',
    locale: 'ru'
  });
  $("#datetimepicker8").datetimepicker({
    format: 'DD.MM.YYYY',
    locale: 'ru',
    useCurrent: false
  });
  // отображение диаграмы по событию изменения любой даты, также запись даты в локалсторадж
  $("#datetimepicker7").on("dp.change", function (e) {
    $('#datetimepicker8').data("DateTimePicker").minDate(e.date);
    localStorage.setItem("start", e.date);
    getAjaxData(e.date, localStorage.getItem("end"));
  });
  $("#datetimepicker8").on("dp.change", function (e) {
    $('#datetimepicker7').data("DateTimePicker").maxDate(e.date);
    localStorage.setItem("end", e.date);
    getAjaxData(localStorage.getItem("start"), e.date);
  });
});

  // форматируем даты и передаем в php скрипт, в ответе вызываем функцию отображения диаграммы и передаем в нее собраный json
function getAjaxData(start_date = "01.01.2001", end_date = Date()){

  start_date = dateFormat(start_date, "dd/mm/yyyy");
  end_date = dateFormat(end_date, "dd/mm/yyyy");

  $.ajax({
    method: "POST",
    dataType: 'json',
    url: "php/functions.php",
    data: {start:start_date, end:end_date},
    success: function (data) {
      visitorData(data);
    },
    error: function (e, t) {
        console.error(e, t);
    }
});
};

function visitorData(data)  {
Highcharts.chart('container', {
  chart: {
    zoomType: 'x'
  },
  title: {
    text: 'USD to RUB exchange rate over time'
  },
  subtitle: {
    text: document.ontouchstart === undefined ?
      'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
  },
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      year: "%Y",
  day: "%e. %b",
  month: "%b '%y"

},
  },
  yAxis: {
    title: {
      text: 'RUB'
    }
  },
  legend: {
    enabled: false
  },
  plotOptions: {
    area: {
      fillColor: {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        },
        stops: [
          [0, Highcharts.getOptions().colors[0]],
          [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
        ]
      },
      marker: {
        radius: 2
      },
      // lineWidth: 1,
      states: {
        hover: {
          lineWidth: 1
        }
      },
      threshold: null
    }
  },

  series: [{
    type: 'area',
    name: 'USD to RUB',
    data: data
  }]
});
};
