import { getMap, registerMap } from 'echarts';

/**
 * Loads the GeoJSON data for the world map for choropleth visualization
 */
export const loadWorldMap = async () => {
    if (!getMap('world')) {
        const worldGeoJson = await fetch('https://cdn.jsdelivr.net/npm/echarts/map/json/world.json').then((res) =>
            res.json()
        );
        registerMap('world', worldGeoJson);
    }
};


/**
 * Maps programming languages to brand-appropriate hex colors
 * Colors are chosen to be visually similar to each language's logo/branding
 * while maintaining readability when used in visualizations
 */
export const getColorForLanguage = (language: string): string => {
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

/**
 * Darkens a hex color by subtracting the specified amount from RGB values
 */
export const darkenColor = (hex: string, amount: number): string => {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
    return `#${r.toString(16).padStart(1, '0')}${g.toString(16).padStart(1, '0')}${b.toString(16).padStart(1, '0')}`;
}

/**
 * Lightens a hex color by adding the specified amount to RGB values
 */
export const lightenColor = (hex: string, amount: number): string => {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
    return `#${r.toString(16).padStart(1, '0')}${g.toString(16).padStart(1, '0')}${b.toString(16).padStart(1, '0')}`;
}

/**
 * Maps ISO country codes to country names used in GeoJSON data
 * This mapping is necessary because the CSV data uses ISO codes while
 * the visualization library's GeoJSON uses slightly different country names
 */
export const isoCodeToGeoJsonName: Record<string, string> = {
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

/**
 * Reverse lookup function to get ISO code from GeoJSON country name
 * Used when handling click events on the map to filter data by country
 */
export const geoJsonNameToIsoCode = (name: string): string | undefined =>
    Object.keys(isoCodeToGeoJsonName).find(key => isoCodeToGeoJsonName[key] === name);
