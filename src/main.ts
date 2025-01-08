import * as echarts from 'echarts';
import { loadCSVData } from './data';
import { renderTreemap } from './components/treemap';

document.addEventListener('DOMContentLoaded', async () => {
    const chartDom = document.getElementById('main') as HTMLDivElement;
    const treeMap = echarts.init(chartDom);

    // Hardcoded years
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    let selectedYear = years[0]; // Default to the earliest year

    // Load CSV data once
    const csvData = await loadCSVData('data/cleaned/merged.csv');
    console.log("loaded data of length", csvData.length);

    // Render the slider
    renderSlider(years, async (year) => {
        selectedYear = year;

        treeMap.showLoading();

        // Filter data for the selected year & update the chart with the new data
        const yearData = csvData.filter((row) => row.year === year);
        renderTreemap(treeMap, yearData, selectedYear);

        treeMap.hideLoading();
    });

    // Fetch and render data for the initial year
    const initialData = csvData.filter((row) => row.year === selectedYear);
    renderTreemap(treeMap, initialData, selectedYear);
});

// Render the slider
function renderSlider(years: number[], onChange: (year: number) => void) {
    const sliderContainer = document.getElementById('slider-container') as HTMLDivElement;
    sliderContainer.innerHTML = `
        <input type="range" id="year-slider" min="${Math.min(...years)}" max="${Math.max(...years)}" value="${Math.min(...years)}" step="1">
        <span id="selected-year">${Math.min(...years)}</span>
    `;

    const slider = document.getElementById('year-slider') as HTMLInputElement;
    const yearLabel = document.getElementById('selected-year') as HTMLSpanElement;

    slider.addEventListener('input', async (event) => {
        const year = Number((event.target as HTMLInputElement).value);
        yearLabel.textContent = year.toString();

        // Call the callback function when the slider value changes
        onChange(year);
    });
}
