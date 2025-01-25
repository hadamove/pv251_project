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
        <>
            {/* Fixed year selection slider */}
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 py-4 bg-white shadow-md">
                <div className="flex items-center mr-8">
                    <h1 className="text-lg font-medium">Programmer salaries over years</h1>
                    <div className="relative ml-2 group">
                        <span className="cursor-help text-gray-500 text-sm">[i]</span>
                        <div className="absolute left-0 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                            Based on data from &nbsp;
                            <a href="https://survey.stackoverflow.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500">StackOverflow developer survey</a>
                            &nbsp; which is taken annually and has tens of thousands responders each year
                        </div>
                    </div>
                </div>
                <label htmlFor="year-slider" className="text-gray-500">Year:</label>
                <input
                    id="year-slider"
                    type="range"
                    min={Math.min(...years)}
                    max={Math.max(...years)}
                    value={selectedYear}
                    onChange={handleSliderChange}
                    className="w-64"
                />
                <span id="selected-year" className="text-lg font-medium">{selectedYear}</span>
            </div>

            {/* Main content with padding to account for fixed slider */}
            <div className={`mx-auto px-4 pt-16 w-[48rem] rounded-lg bg-white text-gray-800`}>
                <div>
                    <div className="flex items-center justify-center">
                        <h1 className="text-lg font-medium">Programming language distribution</h1>
                    </div>
                    <Treemap
                        data={yearFilteredData}
                        onLanguageSelect={onLanguageSelect}
                        selectedLanguage={selectedLanguage}
                    />
                </div>

                {/* Choropleth map showing geographical distribution (visible when language selected) */}
                {selectedLanguage && (
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <h1 className="text-lg font-medium">Salary by country for {selectedLanguage}</h1>
                        </div>
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
                        <div className="flex items-center justify-center">
                            <h1 className="text-lg font-medium">Salary by years of experience for {selectedLanguage} in {selectedCountry}</h1>
                        </div>
                        <SalaryBoxplotChart
                            data={countryFilteredData}
                            language={selectedLanguage}
                        />
                    </div>
                )}
            </div >
        </>
    );
};

// Initialize React root and render the app
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;
