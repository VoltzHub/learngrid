import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const PATHS = {
  alertTriangle: <path d="M12 3 2.8 19a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L12 3Zm0 6v5m0 4h.01" />,
  arrowLeft: <path d="m12 19-7-7 7-7M19 12H5" />,
  arrowRight: <path d="M5 12h14m-6-7 7 7-7 7" />,
  award: <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm-4 1.5V22l4-2 4 2v-5.5" />,
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Zm-8 13h4" />,
  bookOpen: <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Zm16 0A3.5 3.5 0 0 0 16.5 2H4v17h12.5A3.5 3.5 0 0 1 20 22V5.5Z" />,
  calendar: <path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />,
  check: <path d="m20 6-11 11-5-5" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  clipboardList: <path d="M9 5h6M9 12h6M9 16h4M8 3h8l1 3H7l1-3ZM6 6h12v15H6V6Z" />,
  clock: <path d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />,
  creditCard: <path d="M3 7h18v10H3V7Zm0 4h18M7 15h3" />,
  fileText: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 0v6h6M8 13h8M8 17h6" />,
  home: <path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z" />,
  key: <path d="M21 2 11 12m4-4 3 3M7 14a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />,
  logOut: <path d="M10 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2m7 0 5 5-5 5m5-5H9" />,
  mail: <path d="M4 6h16v12H4V6Zm0 0 8 7 8-7" />,
  megaphone: <path d="M3 11v2a2 2 0 0 0 2 2h3l7 4V5L8 9H5a2 2 0 0 0-2 2Zm15-1 3-2v8l-3-2" />,
  messageCircle: <path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.4L3 20l1.1-5.1A8.5 8.5 0 1 1 21 11.5Z" />,
  money: <path d="M3 6h18v12H3V6Zm3 3h.01M18 15h.01M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  naira: <path d="M7 5v14m10-14v14M5 9h14M5 15h14M7 19V5l10 14V5" />,
  paperclip: <path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7L10 17.4a2 2 0 0 1-2.8-2.8l8.5-8.5" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />,
  pin: <path d="m12 17-5 5m3-15 7 7m-5-9 7 7 2-2-7-7-2 2Zm-3 3-2 7 7-2" />,
  star: <path d="m12 2 3 6 6.5.9-4.8 4.7 1.1 6.4L12 17l-5.8 3 1.1-6.4-4.8-4.7L9 8l3-6Z" />,
  user: <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, ...props }: IconProps & { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}

export function GoogleIcon({ size = 20, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 24 24" width={size} {...props}>
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.3Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-0.9 6.6-2.5L15.4 17c-.9.6-2 .9-3.4.9a6 6 0 0 1-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6A6 6 0 0 1 12 6.1Z" />
    </svg>
  );
}
