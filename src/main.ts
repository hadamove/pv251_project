import * as echarts from 'echarts';
import { renderChart } from './components/chart';
import { fetchRespondents } from './db/respondents';

document.addEventListener('DOMContentLoaded', async () => {
    const chartDom = document.getElementById('main') as HTMLDivElement;
    const chartInstance = echarts.init(chartDom);
    renderChart(chartInstance);

    const data = await fetchRespondents();

    console.log(data);
});
