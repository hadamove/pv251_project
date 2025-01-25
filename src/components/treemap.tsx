import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';

interface TreemapProps {
    data: Respondent[];
    onLanguageSelect: (language: string) => void;
    selectedLanguage: string | null;
    isDarkMode?: boolean;
}

/**
 * Treemap visualization showing the distribution of programming languages
 * Each tile's size represents the number of respondents using that language
 */
export const Treemap: React.FC<TreemapProps> = ({ data, onLanguageSelect, selectedLanguage, isDarkMode = false }) => {
    // Count occurrences of each programming language
    const languageCounts = useMemo(() => computeLanguageCounts(data), [data]);
    // Calculate total respondents for percentage calculations
    const totalCount = useMemo(() =>
        Object.values(languageCounts).reduce((a, b) => a + b, 0),
        [languageCounts]
    );

    // TODO: extract to createOption like boxplot
    // This is memoized to prevent completely re-rendering the treemap when the data changes
    // The component would work without it, but it would be less efficient and animations would not work
    // The same popular React pattern with useMemo is used in other components too
    const option = useMemo(() => ({
        tooltip: {
            formatter: (info: any) => {
                const percentage = ((info.value / totalCount) * 100).toFixed(1);
                return `${info.name}: ${info.value} (${percentage}%)`;
            },
            textStyle: {
                fontFamily: 'PPSupplyMono',
                color: isDarkMode ? '#e5e7eb' : '#1f2937'
            },
            backgroundColor: isDarkMode ? '#374151' : '#ffffff',
            borderColor: isDarkMode ? '#4b5563' : '#e5e7eb'
        },
        series: [
            {
                type: 'treemap',
                data: transformToTreemapData(languageCounts, selectedLanguage),
                label: {
                    show: true,
                    formatter: (params: any) => {
                        const percentage = ((params.value / totalCount) * 100).toFixed(1);
                        return `${params.name}\n${percentage}%`;
                    },
                    color: isDarkMode ? '#e5e7eb' : '#1f2937'
                },
                roam: false,
                nodeClick: false,
                breadcrumb: {
                    show: false
                },
                animationDurationUpdate: 200
            },
        ],
    }), [languageCounts, totalCount, selectedLanguage, isDarkMode]);

    // Click handler for language selection
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
            style={{ height: '24rem', width: '48rem' }}
            onEvents={onEvents}
            showLoading={data.length === 0}
            loadingOption={{
                text: 'Loading csv data (this only happens once)...',
                fontFamily: 'PPSupplyMono',
                textColor: isDarkMode ? '#e5e7eb' : '#1f2937'
            }}
        />
    );
};

/**
 * Counts the number of respondents for each programming language
 * Returns an object mapping language names to counts
 */
const computeLanguageCounts = (data: Respondent[]): Record<string, number> => {
    const languageCounts: Record<string, number> = {};
    data.forEach((item) => {
        const lang = item.language || 'Unknown';
        if (!languageCounts[lang]) languageCounts[lang] = 0;
        languageCounts[lang]++;
    });
    return languageCounts;
};

/**
 * Transforms language count data into ECharts treemap format
 * Applies styling based on language selection state
 */
const transformToTreemapData = (languageCounts: Record<string, number>, selectedLanguage: string | null) => {
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
                fontFamily: 'PPSupplyMono'
            },
        };
    });
};