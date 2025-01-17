import Papa from 'papaparse';

export type Respondent = {
    year: number;
    age: number;
    salary: number;
    country: string;
    country_code: string;
    years_of_experience: number;
    language: string;
};

export const loadCSVData = async (filePath: string): Promise<Respondent[]> => {
    try {
        const response = await fetch(filePath);
        const csvText = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true,
                complete: (results) => resolve(results.data as Respondent[]),
                error: (error: any) => reject(error),
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
