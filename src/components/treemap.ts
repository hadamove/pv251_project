import * as echarts from 'echarts';
import { Respondent } from '../data';

function getColorForLanguage(language: string): string {
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

function darkenColor(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(1, '0')}${g.toString(16).padStart(1, '0')}${b.toString(16).padStart(1, '0')}`;
}

export function renderTreemap(chartInstance: echarts.ECharts, yearData: Respondent[], year: number) {
  // Aggregate language data
  const languageCounts: Record<string, number> = {};
  yearData.forEach((item) => {
    const lang = item.language || 'Unknown';
    if (!languageCounts[lang]) languageCounts[lang] = 0;
    languageCounts[lang]++;
  });

  // Map data into treemap format with consistent colors
  const treemapData = Object.entries(languageCounts).map(([name, value]) => {
    const color = getColorForLanguage(name);
    const borderColor = darkenColor(color, 20); // Slightly darker border
    return {
      name,
      value,
      itemStyle: {
        color,
        borderColor,
        borderWidth: 2, // Thickness of the outline
      },
      label: {
        color: darkenColor(color, 100),
      },
    };
  });

  const option = {
    title: {
      text: `Top Favorite Languages - ${year}`,
      left: 'center',
    },
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

  // Update the chart with the new options
  chartInstance.setOption(option, true);
}
