import Papa from 'papaparse';

/**
 * Represents a single survey respondent's data
 * Contains demographic and professional information used across visualizations
 */
export type Respondent = {
    year: number;                 // Survey year
    age: number;                  // Respondent's age
    salary: number;               // Annual salary in USD
    country: string;              // Full country name
    country_code: string;         // ISO country code
    years_of_experience: number;  // Years of programming experience
    language: string;             // Primary programming language
};

/**
 * Loads and parses survey data from a CSV file
 * Uses PapaParse for CSV parsing with automatic type conversion
 * 
 * @param filePath - Path to the CSV file containing survey data
 * @returns Promise resolving to array of parsed respondent data
 */
export const loadCSVData = async (filePath: string): Promise<Respondent[]> => {
    try {
        const response = await fetch(filePath);
        const csvText = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,          // Use first row as headers
                skipEmptyLines: true,  // Skip empty rows
                dynamicTyping: true,   // Auto-convert strings to numbers where appropriate
                complete: (results) => resolve(results.data as Respondent[]),
                error: (error: any) => reject(error),
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
