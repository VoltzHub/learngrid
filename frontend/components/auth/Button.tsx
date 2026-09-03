type ButtonProps = {
    text: string;
    disabled: boolean;
}

export default function Button({ text, disabled }: ButtonProps) {

  return (
    <button type='submit' className="cursor-pointer rounded-[12px] py-4 bg-[#0037B1] text-white
    w-full font-inter mt-7.5 disabled:bg-black hover:bg-[#0037B1]/90 transition-colors duration-300
    "
    disabled={disabled}
    >{text}</button>
  );
}
