import { type ReactNode } from 'react'
import clsx from 'clsx';
import { type UseFormRegisterReturn } from 'react-hook-form'; 

type InputProps = {
    id: string;
    type: string;
    placeholder: string;
    styles: string;
    hook: UseFormRegisterReturn
}

export default function Input({ id, type, placeholder, styles, hook }: InputProps): ReactNode {
  return (
      <input
          id={id}
          {...hook}
          type={type}
          placeholder={placeholder}
          className={clsx(`font-inter w-full outline-0 border-0`, styles)}
      />
  );
}
