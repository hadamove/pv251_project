import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';

interface TreemapProps {
    data: Respondent[];
    onLanguageSelect: (language: string) => void;
    selectedLanguage: string | null;
}

/**
 * Treemap visualization showing the distribution of programming languages
 * Each tile's size represents the number of respondents using that language
 */
export const Treemap: React.FC<TreemapProps> = ({ data, onLanguageSelect, selectedLanguage }) => {
    // Count occurrences of each programming language
    const languageCounts = useMemo(() => computeLanguageCounts(data), [data]);
    // Calculate total respondents for percentage calculations
    const totalCount = useMemo(() =>
        Object.values(languageCounts).reduce((a, b) => a + b, 0),
        [languageCounts]
    );

    // Create the ECharts configuration object for the treemap
    const option = useMemo(() => createTreemapOption(languageCounts, totalCount, selectedLanguage),
        [languageCounts, totalCount, selectedLanguage]);


    // Click handler for language selection
    const onEvents = useMemo(() => ({
        click: (params: { data: { name: string } }) => {
            if (params?.data?.name) {
                onLanguageSelect(params.data.name);
            }
        },
    }), [onLanguageSelect]);

    return (
        <div className="flex flex-col">
            <div className="ml-16">
                <h1 className="text-lg font-medium">Programming language distribution</h1>
                <p className="text-xs text-gray-500">
                    {selectedLanguage ? (
                        'Currently selected: ' + selectedLanguage
                    ) : (
                        'Pick a programming language to see the salaries of respondents worldwide'
                    )}
                </p>
            </div>
            <ReactECharts
                option={option}
                style={{ height: '24rem', width: '40rem' }}
                onEvents={onEvents}
                showLoading={data.length === 0}
                loadingOption={{
                    text: 'Loading csv data (this only happens once)...',
                    fontFamily: 'PPSupplyMono',
                    textColor: '#1f2937'
                }}
            />
        </div>
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
                // Style for when a language is selected
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

/**
 * Creates the ECharts configuration object for the treemap visualization
 * Includes tooltip formatting, label configuration, and styling options
 */
const createTreemapOption = (
    languageCounts: Record<string, number>,
    totalCount: number,
    selectedLanguage: string | null,
) => ({
    // Configure tooltip that appears on hover
    tooltip: {
        trigger: 'item', // Show tooltip when hovering over data points
        formatter: (info: any) => {
            const percentage = ((info.value / totalCount) * 100).toFixed(1);
            return `${info.name}: ${percentage}%`;
        },
        textStyle: {
            fontFamily: 'PPSupplyMono',
            color: '#1f2937'
        },
        backgroundColor: '#ffffff',
        borderColor: '#e5e7eb'
    },
    series: [
        {
            type: 'treemap',
            data: transformToTreemapData(languageCounts, selectedLanguage),
            label: {
                show: true,
                // Custom label formatter to display language name and percentage
                formatter: (params: any) => {
                    const percentage = ((params.value / totalCount) * 100).toFixed(1);
                    return `${params.name}\n${percentage}%`;
                },
                fontFamily: 'PPSupplyMono',
                color: '#1f2937',
                fontSize: 10,
                ellipsis: ''
            },
            // Disable panning and zooming
            roam: false,
            // Disable node click action
            nodeClick: false,
            // Hide breadcrumb navigation
            breadcrumb: {
                show: false
            },
            animationDurationUpdate: 200
        },
    ],
});