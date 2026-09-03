import { type ReactNode, forwardRef } from "react";
import clsx from "clsx";

type InputContainerProps = {
    styles: string;
    children: ReactNode;
};

const InputContainer = forwardRef<HTMLDivElement, InputContainerProps>(
    ({ children, styles }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    `mx-auto flex w-125.5 items-center rounded-[12px] border border-[#C4C5D7] bg-[#EFF4FF] p-4.5`,
                    styles,
                )}
            >
                {children}
            </div>
        );
    },
);

InputContainer.displayName = "InputContainer";

export default InputContainer;
