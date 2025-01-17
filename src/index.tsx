import React, { useState, useEffect, useRef } from 'react';
import { Choropleth } from './components/choropleth';
import { Treemap } from './components/treemap';
import { loadCSVData } from './data';
import { createRoot } from 'react-dom/client';

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
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center gap-4 mb-8">
                <input
                    type="range"
                    min={Math.min(...years)}
                    max={Math.max(...years)}
                    value={selectedYear}
                    onChange={handleSliderChange}
                    className="w-64"
                />
                <span id="selected-year" className="text-lg font-medium">{selectedYear}</span>
            </div>

            <div className="mb-8">
                <Treemap
                    data={csvData.filter((row) => row.year === selectedYear)}
                    year={selectedYear}
                    onLanguageSelect={setSelectedLanguage}
                />
            </div>

            {selectedLanguage && (
                <div className="mb-8">
                    <Choropleth
                        data={csvData.filter((row) => row.year === selectedYear && row.language === selectedLanguage)}
                        year={selectedYear}
                        language={selectedLanguage}
                    />
                </div>
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
