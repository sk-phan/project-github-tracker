//DOM-selector for the canvas 👇
const ctx = document.getElementById('chart').getContext('2d')

//"Draw" the chart here 👇

const updateChart = (projects) => {

    const labels = [
      ''
    ];
  
    const data = {
      labels: labels,
      datasets: [{
        label: `Done: ${projects}`,
        backgroundColor: ['#7365e5'],
        data: [projects],
      },
      {
        label: `Total: ${19}`,
        backgroundColor: [ '#D6CDE9'],
        data: [19-projects],
      }
    ]
    };
  
    const config = {
      type: 'bar',
      data: data,
      options: {
        barThickness: 30,
        maxBarThickness: 30,
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    };
    const myChart = new Chart(
      document.getElementById('chart'),
      config
    );
}
