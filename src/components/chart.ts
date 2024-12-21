import * as echarts from 'echarts';

export function renderChart(chart: echarts.ECharts): void {
  const option: echarts.EChartOption = {
    title: {
      text: 'ECharts Example',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['A', 'B', 'C', 'D', 'E'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: [5, 20, 36, 10, 10],
      },
    ],
  };

  chart.setOption(option);

  window.addEventListener('resize', () => {
    chart.resize();
  });
}
