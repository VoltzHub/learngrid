import { type ReactNode } from 'react';
import Image from 'next/image';

export default function GoogleButton() {
  return (
      <button className="cursor-pointer rounded-[12px] bg-white border border-[#C4C5D7] gap-x-3 items-center mt-8.5 inline-flex w-full h-12.5 justify-center">
          <Image
              src="/auth/google_icon.svg"
              alt="Google's icon"
              width={20}
              height={20}
          />
          <small className="text-[14px] font-inter text-[#121C2A]">
              Continue with Google
          </small>
      </button>
  );
}
