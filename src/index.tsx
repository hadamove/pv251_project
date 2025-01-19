import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

import { Choropleth } from './components/choropleth';
import { Treemap } from './components/treemap';
import { SalaryBoxplotChart } from './components/boxplotChart';
import { loadCSVData, Respondent } from './data';
import { geoJsonNameToIsoCode } from './components/utils';

// Main App component
const App = () => {
    const [csvData, setCsvData] = useState<Respondent[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2016); // Default year
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null); // Default language
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null); // Default country

    // If the country is already selected, unselect it
    const onCountrySelect = useMemo(() => (country: string) => {
        setSelectedCountry(prev => country === prev ? null : country);
    }, []);

    // If the language is already selected, unselect it
    const onLanguageSelect = useMemo(() => (language: string) => {
        setSelectedLanguage(prev => language === prev ? null : language);
    }, []);

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
        <div className="mx-auto px-4 w-[48rem]">
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

            <div className="mb-8 h-full w-full">
                <Treemap
                    data={csvData.filter((row) => row.year === selectedYear)}
                    onLanguageSelect={onLanguageSelect}
                    selectedLanguage={selectedLanguage}
                />
            </div>

            {selectedLanguage && (
                <div className="mb-8">
                    <Choropleth
                        data={csvData.filter((row) => row.year === selectedYear && row.language === selectedLanguage)}
                        year={selectedYear}
                        language={selectedLanguage}
                        onCountrySelect={onCountrySelect}
                    />
                </div>
            )}

            {selectedLanguage && selectedCountry && (
                <div className="mb-8">
                    <SalaryBoxplotChart
                        data={csvData.filter((row) => row.year === selectedYear && row.language === selectedLanguage && row.country_code === geoJsonNameToIsoCode(selectedCountry))}
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
