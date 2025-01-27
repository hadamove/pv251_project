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
import { Header } from './components/header';

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
            {/* Header and year slider */}
            <Header
                handleSliderChange={handleSliderChange}
                selectedYear={selectedYear}
                years={years}
            />

            {/* Graphs */}
            <div className="pt-20 px-4">
                <div className="flex">
                    {/* Left column: Treemap and Boxplot */}
                    <div className="flex flex-col items-center w-[48rem]">
                        {/* Treemap */}
                        <div className="mb-8">
                            <Treemap
                                data={yearFilteredData}
                                onLanguageSelect={onLanguageSelect}
                                selectedLanguage={selectedLanguage}
                            />
                        </div>

                        {/* Salary boxplot (visible when both language and country selected) */}
                        {selectedLanguage && selectedCountry && (
                            <SalaryBoxplotChart
                                data={countryFilteredData}
                                language={selectedLanguage}
                                country={selectedCountry}
                            />
                        )}
                    </div>

                    {/* Right column: Choropleth */}
                    {selectedLanguage && (
                        <div className="flex flex-col w-[48rem]">
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
