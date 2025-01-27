import * as echarts from 'echarts';
import { Respondent } from '../data';

import ReactECharts from 'echarts-for-react';
import React, { useEffect, useMemo, useState } from 'react';
import { darkenColor, getColorForLanguage, isoCodeToGeoJsonName, lightenColor, loadWorldMap } from './utils';


interface ChoroplethProps {
    data: Respondent[];
    language: string;
    onCountrySelect: (country: string) => void;
}


/**
 * Placeholder component to display while the map is loading
 */
const Placeholder = () => {
    return (
        <div className={`flex items-center justify-center h-[400px] font-supply text-gray-600`}>
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3">Loading map...</span>
        </div>
    );
};

/**
 * Choropleth visualization showing average salary by country
 * Each country is colored based on its average salary
 * Clicking on a country highlights it and displays its average salary
 */
export const Choropleth: React.FC<ChoroplethProps> = ({ data, language, onCountrySelect }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    // Load the world map when the component mounts
    useEffect(() => {
        loadWorldMap().then(() => setMapLoaded(true));
    }, []);

    // Compute the average salary for each country
    const countrySalaryData = useMemo(() => computeCountryAverageSalaries(data), [data]);
    // Transform the data into a format suitable for the chart
    const chartData = useMemo(() => transformToChartData(countrySalaryData), [countrySalaryData]);
    // Get the color for the language
    const countryColor = useMemo(() => getColorForLanguage(language), [language]);
    // Define the event handler for when a country is clicked
    const onEvents = useMemo(() => ({
        click: (params: { data: { name: string } }) => {
            if (params?.data?.name) {
                onCountrySelect(params.data.name);
            }
        },
    }), [onCountrySelect]);

    const option = useMemo(() => createChoroplethOption(countryColor, chartData), [countryColor, chartData]);

    if (!mapLoaded) {
        return <Placeholder />;
    }
    return (
        <ReactECharts
            option={option}
            style={{ height: '30rem', width: '40rem' }}
            opts={{ renderer: 'canvas' }}
            onEvents={onEvents}
        />
    );
};

/**
 * Computes the average salary for each country
 * Returns a dictionary with country codes as keys and total salary and count as values
 */
const computeCountryAverageSalaries = (data: Array<{ country_code: string; salary: number }>) => {
    return data.reduce((acc, row) => {
        const { country_code, salary } = row;
        if (!acc[country_code]) {
            acc[country_code] = { total: 0, count: 0 };
        }
        acc[country_code].total += salary;
        acc[country_code].count += 1;
        return acc;
    }, {} as Record<string, { total: number; count: number }>);
};

/**
 * Transforms the country salary data into a format suitable for the chart
 * Returns an array of objects with country name and average salary
 */
const transformToChartData = (
    countrySalaryData: Record<string, { total: number; count: number }>
) => {
    return Object.entries(countrySalaryData)
        .map(([countryCode, { total, count }]) => ({
            name: isoCodeToGeoJsonName[countryCode],
            value: total / count,
        }))
        .filter(item => item.name !== undefined);
};


/**
 * Creates the ECharts option for the choropleth chart
 * Includes tooltip, visualMap, and series configuration
 */
const createChoroplethOption = (countryColor: string, chartData: any[]) => ({
    // Configure tooltip that appears when hovering over countries
    tooltip: {
        trigger: 'item', // Show tooltip when hovering over map regions
        textStyle: {
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        },
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        formatter: (params: { value: number; name: string }) => {
            const value = params.value ? `$${params.value.toFixed(2)}` : 'N/A';
            return `${params.name}: ${value}`;
        },
    },
    // Configure the color scale legend
    visualMap: {
        min: 0,
        max: 100000,
        formatter: (value: number) => {
            if (value >= 100000) return '$100,000+';
            return `$${value.toLocaleString()}`;
        },
        realtime: false, // Update colors after dragging ends
        calculable: true, // Allow dragging handles to filter range
        textStyle: {
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        },
        backgroundColor: '#ffffff',
        inRange: {
            // Generate color gradient from light to dark version of language color
            color: [lightenColor(countryColor, 100), darkenColor(countryColor, 100)],
        },
    },
    series: [
        {
            name: 'Average Salary',
            type: 'map',
            map: 'world', // Use world map GeoJSON data
            roam: true, // Enable panning and zooming
            scaleLimit: {
                min: 1,
                max: 10
            },
            // Style for when hovering over a country
            emphasis: {
                label: {
                    show: true,
                    fontFamily: 'PPSupplyMono',
                    color: '#1f2937'
                },
                itemStyle: {
                    areaColor: lightenColor(countryColor, 50),
                    borderWidth: 2,
                    borderColor: darkenColor(countryColor, 50),
                }
            },
            // Style for when a country is selected
            select: {
                label: {
                    show: true,
                    fontFamily: 'PPSupplyMono'
                },
                itemStyle: {
                    areaColor: lightenColor(countryColor, 30),
                    borderWidth: 2,
                    borderColor: darkenColor(countryColor, 70),
                }
            },
            // Default label style (hidden by default)
            label: {
                show: false,
                fontFamily: 'PPSupplyMono'
            },
            data: chartData, // Array of country data with names and values
        },
    ],
});
