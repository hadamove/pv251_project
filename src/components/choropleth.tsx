import * as echarts from 'echarts';
import { Respondent } from '../data';

import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import { isoCodeToGeoJsonName } from './utils';


interface ChoroplethProps {
    data: Respondent[];
    year: number;
    language: string;
}

export const Choropleth: React.FC<ChoroplethProps> = ({ data, year, language }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        loadWorldMap().then(() => setMapLoaded(true));
    }, []);

    if (!mapLoaded) {
        return <div>Loading map...</div>;
    }

    const countrySalaryData = computeCountryAverageSalaries(data);
    const aggregatedData = transformToChartData(countrySalaryData);

    const option = {
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
            max: Math.max(...aggregatedData.map((d) => d.value)) || 100000,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['#e0f7fa', '#006064'], // Gradient from light to dark
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
                    label: {
                        show: true,
                    },
                },
                data: aggregatedData,
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
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
    return Object.entries(countrySalaryData).map(([countryCode, { total, count }]) => ({
        name: isoCodeToGeoJsonName[countryCode],
        value: total / count,
    }));
};


const loadWorldMap = async () => {
    if (!echarts.getMap('world')) {
        const worldGeoJson = await fetch('https://cdn.jsdelivr.net/npm/echarts/map/json/world.json').then((res) =>
            res.json()
        );
        echarts.registerMap('world', worldGeoJson);
    }
};