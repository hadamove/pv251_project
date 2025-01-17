import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import { renderTreemap } from './components/treemap';
import { renderChoropleth } from './components/choropleth';
import { loadCSVData } from './data';
import { createRoot } from 'react-dom/client';

// Dummy components for Treemap and Choropleth
const Treemap = ({ data, selectedYear, onLanguageChange }: any) => {
    useEffect(() => {
        console.log('treemap rendered');
        // Initialize and render the Treemap
        const chartDom = document.getElementById('main') as HTMLDivElement;
        const treeMap = echarts.init(chartDom);

        treeMap.showLoading();
        renderTreemap(treeMap, data, selectedYear, onLanguageChange);
        treeMap.hideLoading();
    }, [data, selectedYear, onLanguageChange]);

    return <div id="main" style={{ width: '100%', height: '400px' }} />;
};

const Choropleth = ({ data, selectedYear, selectedLanguage }: any) => {
    console.log('choropleth rendered');
    useEffect(() => {
        // Initialize and render the Choropleth
        const chartDom = document.getElementById('choropleth') as HTMLDivElement;
        const choropleth = echarts.init(chartDom);

        renderChoropleth(choropleth, data, selectedYear, selectedLanguage);
    }, [data, selectedYear, selectedLanguage]);

    return <div id="choropleth" style={{ width: '100%', height: '400px' }} />;
};

// Main App component
const App = () => {
    console.log('app rendered');
    const [csvData, setCsvData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2016); // Default year
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null); // Default language

    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]; // Hardcoded years

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            const data = await loadCSVData('data/cleaned/merged.csv');
            setCsvData(data);
        };
        loadData();
    }, []);

    // Filter data whenever selectedYear or selectedLanguage changes
    useEffect(() => {
        const yearData = csvData.filter((row) => row.year === selectedYear);
        const languageData = selectedLanguage
            ? yearData.filter((row) => row.language === selectedLanguage)
            : yearData;

        setFilteredData(languageData);
    }, [selectedYear, selectedLanguage, csvData]);

    // Handle year slider change
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const year = Number(event.target.value);
        setSelectedYear(year);

        // Default to the first language if no language is selected
        if (!selectedLanguage) {
            const allLanguages = [
                ...new Set(csvData.filter((row) => row.year === year).map((row) => row.language)),
            ];
            setSelectedLanguage(allLanguages[0] || null);
        }
    };

    return (
        <div className="w-full max-w-7xl">
            <div>
                <input
                    type="range"
                    min={Math.min(...years)}
                    max={Math.max(...years)}
                    value={selectedYear}
                    onChange={handleSliderChange}
                />
                <span id="selected-year">{selectedYear}</span>
            </div>

            <Treemap
                data={csvData.filter((row) => row.year === selectedYear)}
                selectedYear={selectedYear}
                onLanguageChange={setSelectedLanguage}
            />

            {selectedLanguage && (
                <Choropleth
                    data={filteredData}
                    selectedYear={selectedYear}
                    selectedLanguage={selectedLanguage}
                />
            )}
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
