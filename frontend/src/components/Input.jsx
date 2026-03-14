import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({ icon: Icon, className, ...props }, ref) => {
    return (
        <div className="relative flex items-center w-full">
            {Icon && (
                <div className="absolute left-3 text-gray-400 flex items-center justify-center pointer-events-none">
                    <Icon size={18} />
                </div>
            )}
            <input
                ref={ref}
                className={twMerge(
                    'input-field',
                    Icon ? 'pl-10' : '',
                    className
                )}
                {...props}
            />
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
