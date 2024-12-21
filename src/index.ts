import * as echarts from 'echarts';
import { renderChart } from './components/chart';

document.addEventListener('DOMContentLoaded', () => {
  const chartDom = document.getElementById('main') as HTMLDivElement; // Cast to HTMLDivElement
  const chartInstance = echarts.init(chartDom);

  renderChart(chartInstance);
});
