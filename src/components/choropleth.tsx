import * as echarts from 'echarts';
import { Respondent } from '../data';

const IsoCodeToGeoJsonName: Record<string, string> = {
    'SO': 'Somalia',
    'LI': 'Liechtenstein',
    'MA': 'Morocco',
    'EH': 'W. Sahara',
    'RS': 'Serbia',
    'AF': 'Afghanistan',
    'AO': 'Angola',
    'AL': 'Albania',
    'AX': 'Aland',
    'AD': 'Andorra',
    'AE': 'United Arab Emirates',
    'AR': 'Argentina',
    'AM': 'Armenia',
    'AS': 'American Samoa',
    'AG': 'Antigua and Barb.',
    'AU': 'Australia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BI': 'Burundi',
    'BE': 'Belgium',
    'BJ': 'Benin',
    'BF': 'Burkina Faso',
    'BD': 'Bangladesh',
    'BG': 'Bulgaria',
    'BH': 'Bahrain',
    'BS': 'Bahamas',
    'BA': 'Bosnia and Herz.',
    'BY': 'Belarus',
    'BZ': 'Belize',
    'BM': 'Bermuda',
    'BO': 'Bolivia',
    'BR': 'Brazil',
    'BB': 'Barbados',
    'BN': 'Brunei',
    'BT': 'Bhutan',
    'BW': 'Botswana',
    'CF': 'Central African Rep.',
    'CA': 'Canada',
    'CH': 'Switzerland',
    'CL': 'Chile',
    'CN': 'China',
    'CI': "Côte d'Ivoire",
    'CM': 'Cameroon',
    'CD': 'Dem. Rep. Congo',
    'CG': 'Congo',
    'CO': 'Colombia',
    'KM': 'Comoros',
    'CV': 'Cape Verde',
    'CR': 'Costa Rica',
    'CU': 'Cuba',
    'CW': 'Curaçao',
    'KY': 'Cayman Is.',
    'CY': 'Cyprus',
    'CZ': 'Czech Rep.',
    'DE': 'Germany',
    'DJ': 'Djibouti',
    'DM': 'Dominica',
    'DK': 'Denmark',
    'DO': 'Dominican Rep.',
    'DZ': 'Algeria',
    'EC': 'Ecuador',
    'EG': 'Egypt',
    'ER': 'Eritrea',
    'ES': 'Spain',
    'EE': 'Estonia',
    'ET': 'Ethiopia',
    'FI': 'Finland',
    'FJ': 'Fiji',
    'FK': 'Falkland Is.',
    'FR': 'France',
    'FO': 'Faeroe Is.',
    'FM': 'Micronesia',
    'GA': 'Gabon',
    'GB': 'United Kingdom',
    'GE': 'Georgia',
    'GH': 'Ghana',
    'GN': 'Guinea',
    'GM': 'Gambia',
    'GW': 'Guinea-Bissau',
    'GQ': 'Eq. Guinea',
    'GR': 'Greece',
    'GD': 'Grenada',
    'GL': 'Greenland',
    'GT': 'Guatemala',
    'GU': 'Guam',
    'GY': 'Guyana',
    'HM': 'Heard I. and McDonald Is.',
    'HN': 'Honduras',
    'HR': 'Croatia',
    'HT': 'Haiti',
    'HU': 'Hungary',
    'ID': 'Indonesia',
    'IM': 'Isle of Man',
    'IN': 'India',
    'IO': 'Br. Indian Ocean Ter.',
    'IE': 'Ireland',
    'IR': 'Iran',
    'IQ': 'Iraq',
    'IS': 'Iceland',
    'IL': 'Israel',
    'IT': 'Italy',
    'JM': 'Jamaica',
    'JE': 'Jersey',
    'JO': 'Jordan',
    'JP': 'Japan',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KG': 'Kyrgyzstan',
    'KH': 'Cambodia',
    'KI': 'Kiribati',
    'KR': 'Korea',
    'KW': 'Kuwait',
    'LA': 'Lao PDR',
    'LB': 'Lebanon',
    'LR': 'Liberia',
    'LY': 'Libya',
    'LC': 'Saint Lucia',
    'LK': 'Sri Lanka',
    'LS': 'Lesotho',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'LV': 'Latvia',
    'MD': 'Moldova',
    'MG': 'Madagascar',
    'MX': 'Mexico',
    'MK': 'Macedonia',
    'ML': 'Mali',
    'MT': 'Malta',
    'MM': 'Myanmar',
    'ME': 'Montenegro',
    'MN': 'Mongolia',
    'MP': 'N. Mariana Is.',
    'MZ': 'Mozambique',
    'MR': 'Mauritania',
    'MS': 'Montserrat',
    'MU': 'Mauritius',
    'MW': 'Malawi',
    'MY': 'Malaysia',
    'NA': 'Namibia',
    'NC': 'New Caledonia',
    'NE': 'Niger',
    'NG': 'Nigeria',
    'NI': 'Nicaragua',
    'NU': 'Niue',
    'NL': 'Netherlands',
    'NO': 'Norway',
    'NP': 'Nepal',
    'NZ': 'New Zealand',
    'OM': 'Oman',
    'PK': 'Pakistan',
    'PA': 'Panama',
    'PE': 'Peru',
    'PH': 'Philippines',
    'PW': 'Palau',
    'PG': 'Papua New Guinea',
    'PL': 'Poland',
    'PR': 'Puerto Rico',
    'KP': 'Dem. Rep. Korea',
    'PT': 'Portugal',
    'PY': 'Paraguay',
    'PS': 'Palestine',
    'QA': 'Qatar',
    'RO': 'Romania',
    'RU': 'Russia',
    'RW': 'Rwanda',
    'SA': 'Saudi Arabia',
    'SD': 'Sudan',
    'SN': 'Senegal',
    'SG': 'Singapore',
    'SH': 'Saint Helena',
    'SB': 'Solomon Is.',
    'SL': 'Sierra Leone',
    'SV': 'El Salvador',
    'PM': 'St. Pierre and Miquelon',
    'ST': 'São Tomé and Principe',
    'SR': 'Suriname',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'SE': 'Sweden',
    'SZ': 'Swaziland',
    'SC': 'Seychelles',
    'SY': 'Syria',
    'TC': 'Turks and Caicos Is.',
    'TD': 'Chad',
    'TG': 'Togo',
    'TH': 'Thailand',
    'TJ': 'Tajikistan',
    'TM': 'Turkmenistan',
    'TL': 'Timor-Leste',
    'TO': 'Tonga',
    'TT': 'Trinidad and Tobago',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'TZ': 'Tanzania',
    'UG': 'Uganda',
    'UA': 'Ukraine',
    'UY': 'Uruguay',
    'US': 'United States',
    'UZ': 'Uzbekistan',
    'VE': 'Venezuela',
    'VI': 'U.S. Virgin Is.',
    'VN': 'Vietnam',
    'VU': 'Vanuatu',
    'WS': 'Samoa',
    'YE': 'Yemen',
    'ZA': 'South Africa',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe'
};

import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

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
        name: IsoCodeToGeoJsonName[countryCode],
        value: total / count,
    }));
};

interface ChoroplethProps {
    data: Respondent[];
    year: number;
    language: string;
}


export const Choropleth: React.FC<ChoroplethProps> = ({ data, year, language }) => {
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const loadMap = async () => {
            if (!echarts.getMap('world')) {
                const worldGeoJson = await fetch('https://cdn.jsdelivr.net/npm/echarts/map/json/world.json').then((res) =>
                    res.json()
                );
                echarts.registerMap('world', worldGeoJson);
            }
            setMapLoaded(true);
        };
        loadMap();
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
