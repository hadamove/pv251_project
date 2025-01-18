import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';


interface TreemapProps {
    data: Respondent[];
    year: number;
    onLanguageSelect: (language: string) => void;
    selectedLanguage: string | null;
}

export const Treemap: React.FC<TreemapProps> = ({ data, year, onLanguageSelect, selectedLanguage }) => {
    const languageCounts = useMemo(() => computeLanguageCounts(data), [data]);
    const totalCount = useMemo(() =>
        Object.values(languageCounts).reduce((a, b) => a + b, 0),
        [languageCounts]
    );

    // This is memoized to prevent completely re-rendering the treemap when the data changes
    // The component would work without it, but it would be less efficient and animations would not work
    const option = useMemo(() => ({
        tooltip: {
            formatter: (info: any) => {
                const percentage = ((info.value / totalCount) * 100).toFixed(1);
                return `${info.name}: ${info.value} (${percentage}%)`;
            },
        },
        series: [
            {
                type: 'treemap',
                data: transformToTreemapData(languageCounts, totalCount, selectedLanguage),
                label: {
                    show: true,
                    formatter: (params: any) => {
                        const percentage = ((params.value / totalCount) * 100).toFixed(1);
                        return `${params.name}\n${percentage}%`;
                    },
                },
                roam: false,
                nodeClick: false,
                breadcrumb: {
                    show: false
                },
                animationDurationUpdate: 200
            },
        ],
    }), [languageCounts, totalCount, selectedLanguage]);

    const onEvents = useMemo(() => ({
        click: (params: { data: { name: string } }) => {
            if (params?.data?.name) {
                onLanguageSelect(params.data.name);
            }
        },
    }), [onLanguageSelect]);

    return (
        <ReactECharts
            option={option}
            style={{ height: '400px', width: '100%' }}
            onEvents={onEvents}
            showLoading={data.length === 0}
            loadingOption={{
                text: 'Loading csv data (this only happens once)...',
            }}
        />
    );
};

const computeLanguageCounts = (data: Respondent[]): Record<string, number> => {
    const languageCounts: Record<string, number> = {};
    data.forEach((item) => {
        const lang = item.language || 'Unknown';
        if (!languageCounts[lang]) languageCounts[lang] = 0;
        languageCounts[lang]++;
    });
    return languageCounts;
};

const transformToTreemapData = (languageCounts: Record<string, number>, totalCount: number, selectedLanguage: string | null) => {
    return Object.entries(languageCounts).map(([name, value]) => {
        const color = getColorForLanguage(name);
        const borderColor = darkenColor(color, 20);
        return {
            name,
            value,
            itemStyle: {
                color,
                borderColor: selectedLanguage === name ? darkenColor(color, 100) : borderColor,
                borderWidth: selectedLanguage === name ? 3 : 1,
            },
            label: {
                color: darkenColor(color, 100),
            },
        };
    });
};