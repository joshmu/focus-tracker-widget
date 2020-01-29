command: "/usr/local/bin/node -pe 'JSON.stringify(require(\"/Users/joshmu/Google Drive/CODE/focus-tracker/db.json\"))'",

refreshFrequency: 1 * 60 * 1000,

style: "                  \n\
  top: 0px             \n\
  left: 0px             \n\
  opacity: 0.6             \n\
",

render: function(output) {
  return '<div id="chart">'
},

update: function(output, domEl) {

  // if chart exists update series
  if(!!$('.apexcharts-canvas').length) {
    console.log('removing old chart')
    $('div.apexcharts-canvas').remove()
  }

  var ApexCharts = require('apexcharts');
  output = JSON.parse(output, 'utf8')
  console.log('output', output)
  var data = Object.keys(output).map(k => [k, Math.floor(output[k])]).sort((p, c) => c[1] - p[1]).slice(0, 5)
  console.log('data', data)

  var maxVal = data.reduce((p, c) => { return p[1] > c[1] ? p : c}, ['', 0])[1]
  console.log({maxVal})

  function perc(val, max = maxVal) {
      return Math.floor(val / max * 100)
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
  }
  data = shuffle(data)

  var dom = $(domEl);
  var options = {
    chart: {
        height: 350,
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            offsetY: -10,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
                image: undefined,
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value: {
                    show: false,
                }
            }
        }
    },
    colors: ['#0077B5', '#1ab7ea', '#0084ff', '#3aB8ff', '#61A1D4'],
    series: data.map(d => perc(d[1])),
    labels: data.map(d => d[0]),
    legend: {
        show: true,
        floating: true,
        fontSize: '10px',
        position: 'left',
        offsetX: -10,
        offsetY: 0,
        labels: {
            useSeriesColors: true,
        },
        formatter: function(seriesName, opts) {
            return seriesName + ":  " + (opts.w.globals.series[opts.seriesIndex] * maxVal / 100 / 60 / 60).toFixed(1) + 'h'
            // return seriesName
        },
        itemMargin: {
            horizontal: 1,
        },
        markers: {
          size: 1,
          strokeWidth: 0,
          strokeColor: '#fff',
          offsetX: '0px',
          offsetY: '2px',
          shape: 'circle',
          radius: 1
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                show: false
            }
        }
    }]
}

console.log('domel', domEl)
window.chart = chart = new ApexCharts(domEl, options);
chart.render();;

  return;
}
