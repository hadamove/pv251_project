import React from 'react';

interface HeaderProps {
    handleSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedYear: number;
    years: number[];
}

/**
 * Header component that displays the title, info tooltip, and year slider
 */
export const Header = ({ handleSliderChange, selectedYear, years }: HeaderProps) => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 py-4 bg-white shadow-md">
            <div className="flex items-center mr-8">
                <h1 className="text-lg font-medium px-4">Programmer salaries over years</h1>
                {/* Info tooltip */}
                <div className="relative ml-2 group">
                    <span className="cursor-help text-gray-500 text-sm">[i]</span>
                    <div className="absolute left-0 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                        Based on data from &nbsp;
                        <a href="https://survey.stackoverflow.co/" target="_blank" rel="noopener noreferrer" className="text-blue-500">StackOverflow developer survey</a>
                        &nbsp; which is taken annually and has tens of thousands responders each year
                    </div>
                </div>
            </div>

            {/* Year slider */}
            <label htmlFor="year-slider" className="text-gray-500">Year:</label>
            <input
                id="year-slider"
                type="range"
                min={Math.min(...years)}
                max={Math.max(...years)}
                value={selectedYear}
                onChange={handleSliderChange}
                className="w-64"
            />
            <span id="selected-year" className="text-lg font-medium">{selectedYear}</span>
        </div>
    );
};