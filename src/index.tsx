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
    const [selectedYear, setSelectedYear] = useState<number>(2017);
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
    const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

    // Load CSV data when component mounts
    useEffect(() => {
        const loadData = async () => {
            const data = await loadCSVData('src/assets/data.csv');
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
            {/* Floating on top of the page */}
            <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 py-4 bg-white shadow-md">
                <div className="flex items-center mr-8">
                    {/* Header */}
                    <h1 className="text-lg font-medium">Programmer salaries over years</h1>
                    {/* Info tooltip */}
                    <div className="relative ml-2 group">
                        <span className="cursor-help text-gray-500 text-sm">[i]</span>
                        <div className="absolute left-0 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                            Based on data from &nbsp;
                            <a href="https://survey.stackoverflow.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500">StackOverflow developer survey</a>
                            &nbsp; which is taken annually and has tens of thousands responders each year
                        </div>
                    </div>
                </div>

                {/* Year slider */}
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
            <div className="pt-20 px-4">
                <div className="flex">
                    {/* Left column: Treemap and Boxplot */}
                    <div className="flex flex-col items-center w-[48rem]">
                        {/* Treemap */}
                        <div className="flex flex-col items-center mb-8">
                            <div>
                                <h1 className="text-lg font-medium">Programming language distribution</h1>
                                <p className="text-xs text-gray-500">
                                    Pick a programming language to see the salaries of respondents worldwide
                                </p>
                            </div>
                            <Treemap
                                data={yearFilteredData}
                                onLanguageSelect={onLanguageSelect}
                                selectedLanguage={selectedLanguage}
                            />
                        </div>

                        {/* Salary boxplot (visible when both language and country selected) */}
                        {selectedLanguage && selectedCountry && (
                            <div className="flex flex-col items-center ml-16">
                                <h1 className="text-lg font-medium mb-8">Salary by Years of Experience for {selectedLanguage} in {selectedCountry}</h1>
                                <SalaryBoxplotChart
                                    data={countryFilteredData}
                                    language={selectedLanguage}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right column: Choropleth */}
                    {selectedLanguage && (
                        <div className="flex flex-col w-[48rem]">
                            <div>
                                <h1 className="text-lg font-medium">Salary by country for {selectedLanguage}</h1>
                                <p className="text-xs text-gray-500">
                                    Pick a country to see the salaries of respondents in that country
                                </p>
                            </div>
                            <Choropleth
                                data={languageFilteredData}
                                language={selectedLanguage}
                                onCountrySelect={onCountrySelect}
                            />
                        </div>
                    )}
                </div>
            </div>
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
