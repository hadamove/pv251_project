import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';

interface BarChartProps {
    data: Respondent[];
    year: number;
    language: string;
    country: string;
}

export const SalaryBoxplotChart: React.FC<BarChartProps> = ({ data, year, language, country }) => {
    const binData = useMemo(() => {
        const maxExperience = Math.max(...data.map(d => d.years_of_experience));
        const bins = createBins(maxExperience);
        return fillBinsWithData(data, bins);
    }, [data]);

    const color = getColorForLanguage(language);
    const option = useMemo(() => createChartOption(binData, color, language, year, country),
        [binData, color, language, year, country]);

    return (
        <ReactECharts
            option={option}
            style={{ height: '24rem', width: '48rem' }}
            notMerge={true}
        />
    );
};

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

const createBins = (maxExperience: number): { min: number; max: number; salaries: number[] }[] => {
    const binSize = Math.ceil(maxExperience / 10);
    return Array.from({ length: 10 }, (_, i) => ({
        min: i * binSize,
        max: (i + 1) * binSize,
        salaries: []
    }));
};

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

const createChartOption = (binData: BinData[], color: string, language: string, year: number, country: string) => ({
    title: {
        text: `Salary Distribution by Years of Experience (${language}, ${year}, ${country})`,
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
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
        name: 'Years of Experience',
        axisLabel: {
            rotate: 45
        }
    },
    yAxis: {
        type: 'value',
        name: 'Salary ($)',
        axisLabel: {
            formatter: (value: number) => `$${value.toLocaleString()}`
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
                shadowBlur: 5,
                shadowColor: 'rgba(0,0,0,0.2)'
            }
        },
        animationDurationUpdate: 200
    }],
    grid: {
        containLabel: true,
        left: '5%',
        right: '5%',
        bottom: '15%'
    }
});