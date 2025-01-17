import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Respondent } from '../data';
import { darkenColor, getColorForLanguage } from './utils';


interface TreemapProps {
    data: Respondent[];
    year: number;
    onLanguageSelect: (language: string) => void;
}

export const Treemap: React.FC<TreemapProps> = ({ data, year, onLanguageSelect }) => {
    const getOption = () => {
        const languageCounts = computeLanguageCounts(data);
        const treemapData = transformToTreemapData(languageCounts);

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

const computeLanguageCounts = (data: Respondent[]): Record<string, number> => {
    const languageCounts: Record<string, number> = {};
    data.forEach((item) => {
        const lang = item.language || 'Unknown';
        if (!languageCounts[lang]) languageCounts[lang] = 0;
        languageCounts[lang]++;
    });
    return languageCounts;
};

const transformToTreemapData = (languageCounts: Record<string, number>) => {
    return Object.entries(languageCounts).map(([name, value]) => {
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
};