// Import required dependencies
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';

interface SalaryBoxplotChartProps {
    data: Respondent[];
    language: string;
    isDarkMode?: boolean;
}

/**
 * Component that renders a boxplot chart showing salary distribution by years of experience
 * Data is binned into experience ranges and displays salary statistics (min, Q1, median, Q3, max)
 */
export const SalaryBoxplotChart: React.FC<SalaryBoxplotChartProps> = ({ data, language, isDarkMode = false }) => {
    // Process data into bins based on years of experience
    const binData = useMemo(() => {
        const maxExperience = Math.max(...data.map(d => d.years_of_experience));
        const bins = createBins(maxExperience);
        return fillBinsWithData(data, bins);
    }, [data]);

    const color = getColorForLanguage(language);
    const option = useMemo(() => createChartOption(binData, color, isDarkMode),
        [binData, color, isDarkMode]);

    return (
        <ReactECharts
            option={option}
            style={{ height: '24rem', width: '48rem' }}
            notMerge={true}
        />
    );
};

// Types for boxplot statistical calculations
interface BoxPlotData {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
}

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
 * Creates 10 evenly-sized bins based on the maximum years of experience
 */
const createBins = (maxExperience: number): { min: number; max: number; salaries: number[] }[] => {
    const binSize = Math.ceil(maxExperience / 10);
    return Array.from({ length: 10 }, (_, i) => ({
        min: i * binSize,
        max: (i + 1) * binSize,
        salaries: []
    }));
};

/**
 * Distributes salary data into experience bins and calculates statistics for each bin
 * Filters out empty bins to avoid displaying ranges with no data
 */
const fillBinsWithData = (data: Respondent[], bins: { min: number; max: number; salaries: number[] }[]): BinData[] => {
    const binSize = bins[0].max - bins[0].min;

    data.forEach(d => {
        const binIndex = Math.min(Math.floor(d.years_of_experience / binSize), 9);
        bins[binIndex].salaries.push(d.salary);
    });

    return bins
        .map(bin => ({
            range: `${bin.min}-${bin.max}`,
            stats: calculateBoxPlotData(bin.salaries),
            count: bin.salaries.length
        }))
        .filter(bin => bin.count > 0);
};

/**
 * Creates the ECharts configuration object for the boxplot visualization
 * Includes tooltip formatting, axis configuration, and styling options
 */
const createChartOption = (binData: BinData[], color: string, isDarkMode: boolean) => ({
    tooltip: {
        trigger: 'item',
        textStyle: {
            fontFamily: 'PPSupplyMono',
            color: isDarkMode ? '#e5e7eb' : '#1f2937'
        },
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        formatter: (params: any) => {
            if (params.seriesType === 'boxplot') {
                return `Years of Experience: ${params.name}<br/>` +
                    `Max: $${params.data[5].toLocaleString()}<br/>` +
                    `Q₀.₇₅: $${params.data[4].toLocaleString()}<br/>` +
                    `Med: $${params.data[3].toLocaleString()}<br/>` +
                    `Q₀.₂₅: $${params.data[2].toLocaleString()}<br/>` +
                    `Min: $${params.data[1].toLocaleString()}<br/>` +
                    `n: ${binData[params.dataIndex].count}`;
            }
            return '';
        }
    },
    xAxis: {
        type: 'category',
        data: binData.map(b => b.range),
        name: 'Y.o.E.',
        axisLabel: {
            rotate: 45,
            fontFamily: 'PPSupplyMono',
            color: isDarkMode ? '#e5e7eb' : '#1f2937'
        },
        nameTextStyle: {
            fontFamily: 'PPSupplyMono',
            color: isDarkMode ? '#e5e7eb' : '#1f2937'
        }
    },
    yAxis: {
        type: 'value',
        name: 'Salary ($)',
        axisLabel: {
            formatter: (value: number) => `$${value.toLocaleString()}`,
            fontFamily: 'PPSupplyMono',
            color: isDarkMode ? '#e5e7eb' : '#1f2937'
        },
        nameTextStyle: {
            fontFamily: 'PPSupplyMono',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
            align: 'left'
        }
    },
    series: [{
        name: 'Salary Distribution',
        type: 'boxplot',
        data: binData.map(b => [
            b.stats.min,
            b.stats.q1,
            b.stats.median,
            b.stats.q3,
            b.stats.max
        ]),
        itemStyle: {
            color: darkenColor(color, 50),
            borderColor: darkenColor(color, 100)
        },
        emphasis: {
            itemStyle: {
                borderWidth: 2,
            }
        },
        animationDurationUpdate: 200
    }],
});