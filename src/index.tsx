import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { renderTreemap } from './components/treemap';
import { Choropleth } from './components/choropleth';
import { loadCSVData } from './data';
import { createRoot } from 'react-dom/client';

// Dummy components for Treemap and Choropleth
const Treemap = ({ data, selectedYear, onLanguageChange }: any) => {
    const chartRef = useRef<echarts.ECharts | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('treemap rendered');
        // Initialize echarts only on first render
        if (!chartRef.current && containerRef.current) {
            chartRef.current = echarts.init(containerRef.current);
        }

        if (chartRef.current) {
            chartRef.current.showLoading();
            renderTreemap(chartRef.current, data, selectedYear, onLanguageChange);
            chartRef.current.hideLoading();
        }
    }, [data, selectedYear, onLanguageChange]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.dispose();
            }
        };
    }, []);

    return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

// Main App component
const App = () => {
    console.log('app rendered');
    const [csvData, setCsvData] = useState<any[]>([]);
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

    // Handle year slider change
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const year = Number(event.target.value);
        setSelectedYear(year);
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
                    data={csvData.filter((row) => row.year === selectedYear && row.language === selectedLanguage)}
                    year={selectedYear}
                    language={selectedLanguage}
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
