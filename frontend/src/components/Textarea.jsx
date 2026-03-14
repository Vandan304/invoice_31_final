import React from 'react';
import { twMerge } from 'tailwind-merge';

const Textarea = React.forwardRef(({ icon: Icon, className, ...props }, ref) => {
    return (
        <div className="relative w-full">
            {Icon && (
                <div className="absolute top-2 left-3 text-gray-400 flex items-center justify-center pointer-events-none">
                    <Icon size={18} />
                </div>
            )}
            <textarea
                ref={ref}
                className={twMerge(
                    'input-field min-h-[100px]',
                    Icon ? 'pl-10 pt-2.5' : '',
                    className
                )}
                {...props}
            />
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
