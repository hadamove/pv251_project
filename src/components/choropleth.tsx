import * as echarts from 'echarts';
import { Respondent } from '../data';

import ReactECharts from 'echarts-for-react';
import React, { useEffect, useMemo, useState } from 'react';
import { darkenColor, getColorForLanguage, isoCodeToGeoJsonName, lightenColor } from './utils';


interface ChoroplethProps {
    data: Respondent[];
    year: number;
    language: string;
    onCountrySelect: (country: string) => void;
}

export const Choropleth: React.FC<ChoroplethProps> = ({ data, year, language, onCountrySelect }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        loadWorldMap().then(() => setMapLoaded(true));
    }, []);

    const countrySalaryData = useMemo(() => computeCountryAverageSalaries(data), [data]);
    const chartData = useMemo(() => transformToChartData(countrySalaryData), [countrySalaryData]);
    const countryColor = useMemo(() => getColorForLanguage(language), [language]);
    const onEvents = useMemo(() => ({
        click: (params: { data: { name: string } }) => {
            if (params?.data?.name) {
                onCountrySelect(params.data.name);
            }
        },
    }), [onCountrySelect]);

    const option = useMemo(() => ({
        title: {
            text: `Average Salary in ${year} (${language})`,
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: { value: number; name: string }) => {
                const value = params.value ? `$${params.value.toFixed(2)}` : 'N/A';
                return `${params.name}: ${value}`;
            },
        },
        visualMap: {
            min: 0,
            max: 100000,
            text: ['$100,000+', '$0'],
            realtime: false,
            calculable: true,
            inRange: {
                color: [lightenColor(countryColor, 100), darkenColor(countryColor, 100)],
            },
        },
        series: [
            {
                name: 'Average Salary',
                type: 'map',
                map: 'world',
                roam: true, // Enable zooming and panning
                scaleLimit: {
                    min: 1,
                    max: 10
                },
                emphasis: {
                    itemStyle: {
                        areaColor: lightenColor(countryColor, 50),
                        borderWidth: 2,
                        borderColor: darkenColor(countryColor, 50),
                    }
                },
                select: {
                    itemStyle: {
                        areaColor: lightenColor(countryColor, 30),
                        borderWidth: 2,
                        borderColor: darkenColor(countryColor, 70),
                    }
                },
                data: chartData,
            },
        ],
    }), [year, language, countryColor, chartData]);


    if (!mapLoaded) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading map...</span>
            </div>
        );
    }
    return (
        <ReactECharts
            option={option}
            style={{ height: '24rem', width: '48rem' }}
            opts={{ renderer: 'canvas' }}
            onEvents={onEvents}
        />
    );
};

// Extract data manipulation into a pure function
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


const loadWorldMap = async () => {
    if (!echarts.getMap('world')) {
        console.log('loading world map');
        const worldGeoJson = await fetch('https://cdn.jsdelivr.net/npm/echarts/map/json/world.json').then((res) =>
            res.json()
        );
        console.log('world map loaded');
        echarts.registerMap('world', worldGeoJson);
    }
};