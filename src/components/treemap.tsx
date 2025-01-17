import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';

const getColorForLanguage = (language: string): string => {
    const staticColorMapping: Record<string, string> = {
        'Swift': '#ffd195',
        'Objective-C': '#aeebc0',
        'TypeScript': '#94b1ff',
        'Assembly': '#aeaeae',
        'PowerShell': '#a2c6b9',
        'C#': '#abffaf',
        'JavaScript': '#fff2ac',
        'Ruby': '#ff7474',
        'Scala': '#d58e8e',
        'PHP': '#c7bbda',
        'VBA': '#eaaeeb',
        'Java': '#ffabab',
        'R': '#d7ebae',
        'Python': '#93b7e7',
        'Kotlin': '#bcaeeb',
        'Go': '#7bbdf0',
        'Rust': '#ffa495',
        'Dart': '#a4b5e1',
        'C++': '#eaccb1',
        'C': '#d8d8d8',
    };

    return staticColorMapping[language] || '#CCCCCC'; // Fallback to gray for unknown languages
}

const darkenColor = (hex: string, amount: number): string => {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
    return `#${r.toString(16).padStart(1, '0')}${g.toString(16).padStart(1, '0')}${b.toString(16).padStart(1, '0')}`;
}

interface TreemapProps {
    data: Respondent[];
    year: number;
    onLanguageSelect: (language: string) => void;
}

export const Treemap: React.FC<TreemapProps> = ({ data, year, onLanguageSelect }) => {
    const getOption = () => {
        const languageCounts: Record<string, number> = {};
        data.forEach((item) => {
            const lang = item.language || 'Unknown';
            if (!languageCounts[lang]) languageCounts[lang] = 0;
            languageCounts[lang]++;
        });

        const treemapData = Object.entries(languageCounts).map(([name, value]) => {
            const color = getColorForLanguage(name);
            const borderColor = darkenColor(color, 20);
            return {
                name,
                value,
                itemStyle: {
                    color,
                    borderColor,
                    borderWidth: 1,
                },
                label: {
                    color: darkenColor(color, 100),
                },
            };
        });

        return {
            tooltip: {
                formatter: (info: any) => `${info.name}: ${info.value}`,
            },
            series: [
                {
                    type: 'treemap',
                    data: treemapData,
                    label: {
                        show: true,
                        formatter: '{b}',
                    },
                },
            ],
        };
    };

    const onEvents = {
        click: (params: { data: { name: string } }) => {
            if (params?.data?.name) {
                onLanguageSelect(params.data.name);
            }
        },
    };

    return (
        <ReactECharts
            option={getOption()}
            style={{ height: '400px', width: '100%' }}
            onEvents={onEvents}
        />
    );
}; 