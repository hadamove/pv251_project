// Import required React hooks and rendering utilities
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css'

// Import visualization components
import { Choropleth } from './components/choropleth';
import { Treemap } from './components/treemap';
import { SalaryBoxplotChart } from './components/boxplotChart';
import { loadCSVData, Respondent } from './data';
import { geoJsonNameToIsoCode } from './components/utils';

/**
 * Main App component that manages state and renders visualizations
 * Displays a treemap of programming languages, choropleth map of countries,
 * and salary boxplot based on user selections
 */
const App = () => {
    // State for storing and filtering data
    const [csvData, setCsvData] = useState<Respondent[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(2016);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    // Memoized callback to toggle country selection
    const onCountrySelect = useMemo(() => (country: string) => {
        setSelectedCountry(prev => country === prev ? null : country);
    }, []);

    // Memoized callback to toggle language selection
    const onLanguageSelect = useMemo(() => (language: string) => {
        setSelectedLanguage(prev => language === prev ? null : language);
    }, []);

    // Available years in the dataset
    const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

    // Load CSV data when component mounts
    useEffect(() => {
        const loadData = async () => {
            const data = await loadCSVData('data/cleaned/merged.csv');
            setCsvData(data);
        };
        loadData();
    }, []);

    // Handler for year selection slider
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const year = Number(event.target.value);
        setSelectedYear(year);
    };

    // Memoized data filtering for better performance
    // Filter data by selected year
    const yearFilteredData = useMemo(() =>
        csvData.filter(row => row.year === selectedYear),
        [csvData, selectedYear]
    );

    // Further filter by selected programming language
    const languageFilteredData = useMemo(() =>
        selectedLanguage ? yearFilteredData.filter(row => row.language === selectedLanguage) : [],
        [yearFilteredData, selectedLanguage]
    );

    // Finally filter by selected country
    const countryFilteredData = useMemo(() =>
        selectedCountry ? languageFilteredData.filter(row =>
            row.country_code === geoJsonNameToIsoCode(selectedCountry)
        ) : [],
        [languageFilteredData, selectedCountry]
    );

    return (
        <div className="mx-auto px-4 w-[48rem]">
            hello world
            {/* Year selection slider */}
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

            {/* Treemap showing programming language distribution */}
            <div className="mb-8 h-full w-full">
                <Treemap
                    data={yearFilteredData}
                    onLanguageSelect={onLanguageSelect}
                    selectedLanguage={selectedLanguage}
                />
            </div>

            {/* Choropleth map showing geographical distribution (visible when language selected) */}
            {selectedLanguage && (
                <div className="mb-8">
                    <Choropleth
                        data={languageFilteredData}
                        language={selectedLanguage}
                        onCountrySelect={onCountrySelect}
                    />
                </div>
            )}

            {/* Salary boxplot (visible when both language and country selected) */}
            {selectedLanguage && selectedCountry && (
                <div className="mb-8">
                    <SalaryBoxplotChart
                        data={countryFilteredData}
                        language={selectedLanguage}
                    />
                </div>
            )}
        </div>
    );
};

// Initialize React root and render the app
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
