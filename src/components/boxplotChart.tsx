// Import required dependencies
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';

interface SalaryBoxplotChartProps {
    data: Respondent[];
    language: string;
    country: string;
}

/**
 * Component that renders a boxplot chart showing salary distribution by years of experience
 * Data is binned into experience ranges and displays salary statistics (min, Q1, median, Q3, max)
 */
export const SalaryBoxplotChart: React.FC<SalaryBoxplotChartProps> = ({ data, language, country }) => {
    // Process data into bins based on years of experience
    const binData = useMemo(() => {
        const bins = createBins();
        return fillBinsWithData(data, bins);
    }, [data]);

    // Get the color for the language
    const color = getColorForLanguage(language);
    // Create the ECharts option for the boxplot chart
    const option = useMemo(() => createBoxplotOption(binData, color),
        [binData, color]);

    return (
        <div className="flex flex-col items-center ml-16">
            <h1 className="text-lg font-medium mb-8">
                Salary by Years of Experience for {language} in {country}
            </h1>
            <ReactECharts
                option={option}
                style={{ height: '20rem', width: '36rem' }}
                notMerge={true}
            />
        </div>
    );
};

/**
 * Represents the data for a single bin in the boxplot chart
 */
interface BoxPlotData {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
}

/**
 * Represents the data for a single bin in the boxplot chart
 */
interface BinData {
    range: string;
    stats: BoxPlotData;
    count: number;
}

/**
 * Calculates box plot statistics (min, Q1, median, Q3, max) from an array of values
 */
const calculateBoxPlotData = (values: number[]): BoxPlotData => {
    if (values.length === 0) {
        return { min: 0, q1: 0, median: 0, q3: 0, max: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const medianIndex = Math.floor(sorted.length * 0.5);
    const q3Index = Math.floor(sorted.length * 0.75);

    return {
        min: sorted[0],
        q1: sorted[q1Index],
        median: sorted[medianIndex],
        q3: sorted[q3Index],
        max: sorted[sorted.length - 1]
    };
};

/**
 * Creates predefined bins for years of experience ranges
 */
const createBins = (): { min: number; max: number; salaries: number[] }[] => {
    return [
        { min: 0, max: 2, salaries: [] },
        { min: 2, max: 4, salaries: [] },
        { min: 4, max: 6, salaries: [] },
        { min: 6, max: 8, salaries: [] },
        { min: 8, max: 12, salaries: [] },
        { min: 12, max: 16, salaries: [] },
        { min: 16, max: Infinity, salaries: [] }
    ];
};

/**
 * Distributes salary data into experience bins and calculates statistics for each bin
 */
const fillBinsWithData = (data: Respondent[], bins: { min: number; max: number; salaries: number[] }[]): BinData[] => {
    data.forEach(d => {
        const bin = bins.find(b => d.years_of_experience >= b.min && d.years_of_experience < b.max);
        if (bin) {
            bin.salaries.push(d.salary);
        }
    });

    return bins.map(bin => ({
        range: bin.max === Infinity ? '16+' : `${bin.min}-${bin.max}`,
        stats: calculateBoxPlotData(bin.salaries),
        count: bin.salaries.length
    }));
};

/**
 * Creates the ECharts configuration object for the boxplot visualization
 * Includes tooltip formatting, axis configuration, and styling options
 */
const createBoxplotOption = (binData: BinData[], color: string) => ({
    // Configure tooltip that appears on hover
    tooltip: {
        trigger: 'item', // Show tooltip when hovering over data points
        textStyle: {
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        },
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb',
        // Custom tooltip formatter to display boxplot statistics
        formatter: (params: any) => {
            if (params.seriesType === 'boxplot') {
                return `Years of Experience: ${params.name}<br/>` +
                    `Max: $${Math.round(params.data[5]).toLocaleString()}<br/>` +
                    `Q₀.₇₅: $${Math.round(params.data[4]).toLocaleString()}<br/>` +
                    `Med: $${Math.round(params.data[3]).toLocaleString()}<br/>` +
                    `Q₀.₂₅: $${Math.round(params.data[2]).toLocaleString()}<br/>` +
                    `Min: $${Math.round(params.data[1]).toLocaleString()}<br/>` +
                    `Sample Size: ${binData[params.dataIndex].count}`;
            }
            return '';
        }
    },
    // Configure x-axis showing years of experience ranges
    xAxis: {
        type: 'category', // Discrete categories for experience ranges
        data: binData.map(b => b.range),
        name: 'Y.o.E.',
        axisLabel: {
            rotate: 45, // Rotate labels for better readability
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        },
        nameTextStyle: {
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        }
    },
    // Configure y-axis showing salary values
    yAxis: {
        type: 'value', // Continuous numerical values for salary
        name: 'Salary ($)',
        axisLabel: {
            formatter: (value: number) => `$${value.toLocaleString()}`, // Format salary with $ and commas
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        },
        nameTextStyle: {
            fontFamily: 'PPSupplyMono',
            color: '#1f2937',
            align: 'left'
        }
    },
    // Configure the boxplot series
    series: [{
        name: 'Salary Distribution',
        type: 'boxplot',
        // Map bin data to boxplot format: [min, Q1, median, Q3, max]
        data: binData.map(b => [
            b.stats.min,
            b.stats.q1,
            b.stats.median,
            b.stats.q3,
            b.stats.max
        ]),
        itemStyle: {
            color: darkenColor(color, 50), // Fill color for boxes
            borderColor: darkenColor(color, 100) // Border color for boxes
        },
        emphasis: {
            itemStyle: {
                borderWidth: 2, // Thicker border on hover
            }
        },
        animationDurationUpdate: 200 // Smooth transitions when data updates
    }],
});