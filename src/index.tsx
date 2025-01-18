import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { Choropleth } from './components/choropleth';
import { Treemap } from './components/treemap';
import { SalaryBoxplotChart } from './components/boxplotChart';
import { loadCSVData } from './data';

// Main App component
const App = () => {
    const [csvData, setCsvData] = useState<any[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2016); // Default year
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null); // Default language
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null); // Default country

    // If the country is already selected, unselect it
    const onCountrySelect = (country: string) => {
        setSelectedCountry(country === selectedCountry ? null : country);
    };

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
                <>
                    <div className="mb-8">
                        <Choropleth
                            data={csvData.filter((row) => row.year === selectedYear && row.language === selectedLanguage)}
                            year={selectedYear}
                            language={selectedLanguage}
                            onCountrySelect={onCountrySelect}
                        />
                    </div>
                </>
            )}

            {selectedLanguage && selectedCountry && (
                <div className="mb-8">
                    <SalaryBoxplotChart
                        data={csvData.filter((row) => row.year === selectedYear && row.language === selectedLanguage && row.country === selectedCountry)}
                        year={selectedYear}
                        language={selectedLanguage}
                        country={selectedCountry}
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
