import { type ReactNode } from 'react';

type LabelProps = {
    text: string;
    htmlFor: string
}

export default function Label({text, htmlFor}: LabelProps): ReactNode {
  return (
    <label
        htmlFor={htmlFor}
        className="font-inter font-medium text-[14px] leading-[19.6px] text-[#434655]"
    >
        {text}
    </label>
  )
}
