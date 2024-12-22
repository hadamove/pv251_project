import initSqlJs from "sql.js";

interface Respondent {
    id: number;
    salary: number | null;
    country: string | null;
    years_of_experience: number | null;
    age: number | null;
    language: string | null;
    country_code: string | null;
    year: number;
}

const dbPath = "./data/respondents.db";

export async function fetchRespondents(): Promise<Respondent[]> {
    try {
        const response = await fetch(dbPath);
        const buffer = await response.arrayBuffer();
        const SQL = await initSqlJs({
            locateFile: file => `https://sql.js.org/dist/${file}`
        });
        const db = new SQL.Database(new Uint8Array(buffer));

        const query = "SELECT * FROM Respondent";
        const result = db.exec(query);

        const respondents: Respondent[] = [];
        if (result.length > 0) {
            const columns = result[0].columns; // Column names
            const values = result[0].values; // Data rows

            values.forEach((row) => {
                const respondent: Respondent = {
                    id: row[columns.indexOf("id")] as number,
                    salary: row[columns.indexOf("salary")] as number | null,
                    country: row[columns.indexOf("country")] as string | null,
                    years_of_experience: row[columns.indexOf("years_of_experience")] as number | null,
                    age: row[columns.indexOf("age")] as number | null,
                    language: row[columns.indexOf("language")] as string | null,
                    country_code: row[columns.indexOf("country_code")] as string | null,
                    year: row[columns.indexOf("year")] as number,
                };
                respondents.push(respondent);
            });
        }

        db.close();
        return respondents;
    } catch (error) {
        console.error("Error loading or querying the database:", error);
        return [];
    }
}
