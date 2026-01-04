
import React, { useState, useEffect, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

// --- ATOMS ---

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <span className={`text-[10px] font-bold uppercase text-slate-400 mb-1.5 block group-focus-within:text-blue-500 transition-colors ${className}`}>
        {children}
    </span>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'icon' }> = ({ variant = 'primary', className = '', ...props }) => {
    const baseClass = "transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow active:scale-95 rounded-lg px-4 py-2 text-xs",
        secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-3 py-2 text-xs",
        ghost: "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-2 py-1",
        icon: "p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500"
    };
    return <button className={`${baseClass} ${variants[variant]} ${className}`} {...props} />;
};

export const DebouncedInput: React.FC<{
    value: string | number;
    onChange: (val: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    type?: string;
    className?: string;
    dir?: string;
}> = ({ value, onChange, onFocus, placeholder, type = "text", className = "", dir }) => {
    const [localValue, setLocalValue] = useState(value);

    // Sync local state if external prop changes (e.g. undo/redo)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Propagate changes immediately with a tiny debounce so the preview updates while typing
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localValue !== value) {
                onChange(String(localValue));
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [localValue, value, onChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <input
            type={type}
            dir={dir}
            value={localValue}
            onChange={handleChange}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none transition-all placeholder-slate-300 ${className}`}
        />
    );
};

export const DebouncedTextarea = forwardRef<HTMLTextAreaElement, {
    value: string;
    onChange: (val: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    rows?: number;
    className?: string;
    dir?: string;
}>(({ value, onChange, onFocus, placeholder, rows = 4, className = "", dir }, ref) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => { setLocalValue(value); }, [value]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, 120);

        return () => clearTimeout(timeout);
    }, [localValue, value, onChange]);

    return (
        <textarea
            ref={ref}
            dir={dir}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onFocus={onFocus}
            rows={rows}
            placeholder={placeholder}
            className={`w-full outline-none resize-none transition-all ${className}`}
        />
    );
});

DebouncedTextarea.displayName = 'DebouncedTextarea';

export const Slider: React.FC<{
    value: number;
    onChange: (val: number) => void;
    onPointerDown?: () => void;
    min: number;
    max: number;
    step: number;
    label?: string;
    displayValue?: string;
}> = ({ value, onChange, onPointerDown, min, max, step, label, displayValue }) => (
    <div>
        {(label || displayValue) && (
            <div className="flex justify-between text-[10px] mb-2 text-slate-400">
                {label && <span>{label}</span>}
                {displayValue && <span>{displayValue}</span>}
            </div>
        )}
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value} 
            onPointerDown={onPointerDown} 
            onChange={(e) => onChange(parseFloat(e.target.value))} 
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" 
        />
    </div>
);

export const ColorPicker: React.FC<{
    value: string;
    onChange: (val: string) => void;
    onFocus?: () => void;
    label?: string;
}> = ({ value, onChange, onFocus, label }) => (
    <div className="flex items-center gap-2">
        {label && <div className="text-[9px] text-slate-400">{label}</div>}
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:scale-110">
            <input 
                type="color" 
                value={value} 
                onFocus={onFocus} 
                onChange={(e) => onChange(e.target.value)} 
                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0" 
            />
        </div>
    </div>
);

export const Select: React.FC<{
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    label?: string;
}> = ({ value, onChange, options, label }) => (
    <label className="block">
        {label && <span className="text-[10px] font-bold uppercase text-slate-400 mb-2 block">{label}</span>}
        <div className="relative">
            <select 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 transition-shadow appearance-none cursor-pointer"
            >
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
    </label>
);
