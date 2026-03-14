import React from 'react';
import { twMerge } from 'tailwind-merge';

const Select = React.forwardRef(({ icon: Icon, className, children, ...props }, ref) => {
    return (
        <div className="relative flex items-center w-full">
            {Icon && (
                <div className="absolute left-3 text-gray-400 flex items-center justify-center pointer-events-none z-10">
                    <Icon size={18} />
                </div>
            )}
            <select
                ref={ref}
                className={twMerge(
                    'input-field appearance-none',
                    Icon ? 'pl-10' : '',
                    className
                )}
                {...props}
            >
                {children}
            </select>
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
