import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({ icon: Icon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative flex items-center w-full">
            {Icon && (
                <div className="absolute left-3 text-gray-400 flex items-center justify-center pointer-events-none">
                    <Icon size={18} />
                </div>
            )}
            <input
                ref={ref}
                type={inputType}
                className={twMerge(
                    'input-field',
                    Icon ? 'pl-10' : '',
                    isPassword ? 'pr-10' : '',
                    className
                )}
                {...props}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
