import type { SVGProps } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  Banknote,
  Bell,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  Home,
  Key,
  LogOut,
  Mail,
  Megaphone,
  MessageCircle,
  Paperclip,
  Phone,
  MapPin,
  Star,
  User,
  X,
  type LucideIcon,
} from "lucide-react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Map the legacy icon names to lucide-react components. Keeps the existing
// `<Icon name="..." />` API working across the 25 call sites while giving us
// industry-standard, instantly recognisable glyphs.
const ICONS = {
  alertTriangle: AlertTriangle,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  award: Award,
  bell: Bell,
  bookOpen: BookOpen,
  calendar: Calendar,
  check: Check,
  chevronRight: ChevronRight,
  clipboardList: ClipboardList,
  clock: Clock,
  creditCard: CreditCard,
  fileText: FileText,
  home: Home,
  key: Key,
  logOut: LogOut,
  mail: Mail,
  megaphone: Megaphone,
  messageCircle: MessageCircle,
  // money / naira represent currency — banknote reads as "cash" anywhere.
  money: Banknote,
  naira: Banknote,
  paperclip: Paperclip,
  phone: Phone,
  // "pin" used to mean a draft/location marker — lucide MapPin works for both.
  pin: MapPin,
  star: Star,
  user: User,
  x: X,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20, ...props }: IconProps & { name: IconName }) {
  const Component = ICONS[name];
  return (
    <Component
      aria-hidden="true"
      width={size}
      height={size}
      strokeWidth={2}
      {...props}
    />
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
