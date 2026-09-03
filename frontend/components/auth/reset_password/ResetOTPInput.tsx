"use client";

import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from "react";

interface OtpInputProps {
    length?: number;
    onChange: (code: string) => void;
}

export default function ResetOtpInput({ length = 4, onChange }: OtpInputProps) {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newValues = [...values];
        newValues[index] = value.slice(-1);

        setValues(newValues);

        // Send the current OTP to React Hook Form
        onChange(newValues.join(""));

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const newValues = pasted.split("").concat(Array(length).fill("")).slice(0, length);
        setValues(newValues);
        if (pasted.length === length) {
            onChange(pasted);
        } else {
            inputRefs.current[pasted.length]?.focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {values.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center font-inter text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ))}
            
        </div>
    );
}