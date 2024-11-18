import os
from enum import Enum

import pandas as pd


class Column(Enum):
    SALARY = "salary"
    COUNTRY = "country"
    YEARS_OF_EXPERIENCE = "years_of_experience"
    AGE = "age"
    PROGRAMMING_LANGUAGE = "language"


def main(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)

    paths_to_csv_by_year = {
        "2015": "data/2015 Stack Overflow Developer Survey Responses.csv",
        "2016": "data/2016 Stack Overflow Survey Results/2016 Stack Overflow Survey Responses.csv",
        "2017": "data/stack-overflow-developer-survey-2017/survey_results_public.csv",
        "2018": "data/stack-overflow-developer-survey-2018/survey_results_public.csv",
        "2019": "data/stack-overflow-developer-survey-2019/survey_results_public.csv",
        "2020": "data/stack-overflow-developer-survey-2020/survey_results_public.csv",
        "2021": "data/stack-overflow-developer-survey-2021/survey_results_public.csv",
        "2022": "data/stack-overflow-developer-survey-2022/survey_results_public.csv",
        "2023": "data/stack-overflow-developer-survey-2023/survey_results_public.csv",
        "2024": "data/stack-overflow-developer-survey-2024/survey_results_public.csv",
    }
    pandas_dataframes_by_year = {year: pd.read_csv(path) for year, path in paths_to_csv_by_year.items()}

    colum_map_by_year = {
        "2011": {
            Column.SALARY: "Salary",
            Column.COUNTRY: "Country",
            Column.YEARS_OF_EXPERIENCE: "Years IT / Programming Experience",
            Column.AGE: "Age",
            Column.PROGRAMMING_LANGUAGE: "Which languages are you proficient in?",
        },
    }

    for year, df in pandas_dataframes_by_year.items():
        if year not in colum_map_by_year:
            raise ValueError(f"Column mapping for year {year} not found")

        column_map = colum_map_by_year[year]
        df.rename(columns=column_map, inplace=True)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=str, default="data_clean")
    args = parser.parse_args()

    main(args.output_dir)
