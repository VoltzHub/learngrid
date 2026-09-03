import { type LucideIcon } from "lucide-react";

export interface selectRoleType {
    id: number;
    image: string;
    trackIcon: LucideIcon;
    track: string;
    role: string;
    roleDescription: string;
}

export interface selectRoleTypeClick {
    handleClick: React.Dispatch<React.SetStateAction<number>>;
}

export interface cardStyle {
    styles: string;
}