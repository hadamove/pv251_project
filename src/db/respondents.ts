import initSqlJs from "sql.js";

export interface Respondent {
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

export async function fetchRespondents(
    filters?: { year?: number; country_code?: string; language?: string }
): Promise<Respondent[]> {
    try {
        const response = await fetch(dbPath);
        const buffer = await response.arrayBuffer();
        const SQL = await initSqlJs({
            locateFile: (file) => `https://sql.js.org/dist/${file}`
        });
        const db = new SQL.Database(new Uint8Array(buffer));

        // Build the query with filters
        let query = "SELECT * FROM Respondent WHERE 1=1";
        const params: any[] = [];

        if (filters?.year !== undefined) {
            query += " AND year = ?";
            params.push(filters.year);
        }
        if (filters?.country_code) {
            query += " AND country_code = ?";
            params.push(filters.country_code);
        }
        if (filters?.language) {
            query += " AND language = ?";
            params.push(filters.language);
        }

        // Execute the query
        const statement = db.prepare(query);
        statement.bind(params);

        const respondents: Respondent[] = [];
        while (statement.step()) {
            const row = statement.getAsObject() as Record<string, any>;
            const respondent: Respondent = {
                id: row.id as number,
                salary: row.salary as number | null,
                country: row.country as string | null,
                years_of_experience: row.years_of_experience as number | null,
                age: row.age as number | null,
                language: row.language as string | null,
                country_code: row.country_code as string | null,
                year: row.year as number,
            };
            respondents.push(respondent);
        }

        statement.free();
        db.close();

        return respondents;
    } catch (error) {
        console.error("Error loading or querying the database:", error);
        return [];
    }
}
