import React from 'react';

const Spinner = ({ className = 'min-h-[400px]' }) => {
    return (
        <div className={`flex justify-center items-center w-full ${className}`}>
            <div className="w-10 h-10 rounded-full animate-spin border-4 border-solid border-indigo-600 border-t-transparent shadow-sm"></div>
        </div>
    );
};

export default Spinner;
