import * as echarts from 'echarts';
import { loadCSVData } from './data';
import { renderTreemap } from './components/treemap';
import { renderChoropleth } from './components/choropleth';

let selectedLanguage: string | null = null; // Default to null, meaning no language is selected initially

document.addEventListener('DOMContentLoaded', async () => {
    const chartDom = document.getElementById('main') as HTMLDivElement;
    const treeMap = echarts.init(chartDom);

    const choroplethDom = document.getElementById('choropleth') as HTMLDivElement;
    const choropleth = echarts.init(choroplethDom);

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
        renderTreemap(treeMap, initialData, selectedYear, (language) => {
            selectedLanguage = language; // Update selected language
            const filteredData = csvData.filter(
                (row) => row.year === selectedYear && row.language === selectedLanguage
            );
            renderChoropleth(choropleth, filteredData, selectedYear, selectedLanguage);
        });


        treeMap.hideLoading();
    }, csvData, choropleth);


    // Fetch and render data for the initial year
    const initialData = csvData.filter((row) => row.year === selectedYear);
    renderTreemap(treeMap, initialData, selectedYear, (language) => {
        selectedLanguage = language; // Update selected language
        const filteredData = csvData.filter(
            (row) => row.year === selectedYear && row.language === selectedLanguage
        );
        renderChoropleth(choropleth, filteredData, selectedYear, selectedLanguage);
    });

});


function renderSlider(
    years: number[],
    onChange: (year: number) => void,
    csvData: any[],
    choropleth: echarts.ECharts
) {
    const slider = document.getElementById('year-slider') as HTMLInputElement;
    const yearLabel = document.getElementById('selected-year') as HTMLSpanElement;

    slider.min = Math.min(...years).toString();
    slider.max = Math.max(...years).toString();
    slider.value = Math.min(...years).toString();
    yearLabel.textContent = Math.min(...years).toString();

    slider.addEventListener('input', async (event) => {
        const year = Number((event.target as HTMLInputElement).value);
        yearLabel.textContent = year.toString();

        // Call the callback function when the slider value changes
        onChange(year);

        // Update choropleth map for the selected year
        const yearData = csvData.filter((row) => row.year === year);
        if (!selectedLanguage) {
            // Default to the first language if no language is selected
            const allLanguages = [...new Set(yearData.map((row) => row.language))];
            selectedLanguage = allLanguages.length > 0 ? allLanguages[0] : null;
        }

        // Render choropleth for the selected language
        if (selectedLanguage) {
            const filteredData = yearData.filter(
                (row) => row.language === selectedLanguage
            );
            renderChoropleth(choropleth, filteredData, year, selectedLanguage);
        }
    });
}
