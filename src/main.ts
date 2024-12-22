import * as echarts from 'echarts';
import { fetchRespondents, Respondent } from './db/respondents';

document.addEventListener('DOMContentLoaded', async () => {
    const chartDom = document.getElementById('main') as HTMLDivElement;
    const chartInstance = echarts.init(chartDom);

    // Hardcoded years
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    let selectedYear = years[0]; // Default to the earliest year

    // Render the slider
    renderSlider(years, async (year) => {
        selectedYear = year;

        chartInstance.showLoading();
        // Fetch filtered data for the selected year
        const t0 = performance.now();
        const yearData = await fetchRespondents({ year: selectedYear });
        const t1 = performance.now();
        console.log("found data for year", yearData, "of length", yearData.length, "took", t1 - t0, "ms");

        // Update the chart with the new data
        const t2 = performance.now();
        updateChart(chartInstance, yearData, selectedYear);
        const t3 = performance.now();
        console.log("updated chart for year", yearData, "of length", yearData.length, "took", t3 - t2, "ms");

        chartInstance.hideLoading();
    });

    // Fetch and render data for the initial year
    const initialData = await fetchRespondents({ year: selectedYear });
    updateChart(chartInstance, initialData, selectedYear);
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

function updateChart(chartInstance: echarts.ECharts, yearData: Respondent[], year: number) {
    // Aggregate language data
    const languageCounts: Record<string, number> = {};
    yearData.forEach((item) => {
        const lang = item.language || 'Unknown';
        if (!languageCounts[lang]) languageCounts[lang] = 0;
        languageCounts[lang]++;
    });

    // Create a consistent color mapping for languages
    const languages = Object.keys(languageCounts).sort(); // Alphabetical order
    const colorPalette = ['#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'];
    const colorMapping: Record<string, string> = {};

    languages.forEach((lang, index) => {
        colorMapping[lang] = colorPalette[index % colorPalette.length]; // Cycle through the palette
    });

    // Map data into treemap format with colors
    const treemapData = Object.entries(languageCounts).map(([name, value]) => ({
        name,
        value,
        itemStyle: {
            color: colorMapping[name],
        },
    }));

    const option = {
        title: {
            text: `Top Favorite Languages - ${year}`,
            left: 'center',
        },
        tooltip: {
            formatter: (info: any) => `${info.name}: ${info.value}`,
        },
        series: [
            {
                type: 'treemap',
                data: treemapData,
                label: {
                    show: true,
                    formatter: '{b}',
                },
            },
        ],
    };

    // Update the chart with the new options
    chartInstance.setOption(option, true);
}
