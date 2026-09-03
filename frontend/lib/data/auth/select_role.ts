import { type selectRoleType } from "@/types/auth/select_role/select_role";

import { GraduationCap, BookOpen } from "lucide-react";

export const selectRoleData: selectRoleType[] = [
    {
        id: 1,
        image: '/select_role/expert_track.png',
        track: 'Expert track',
        trackIcon: GraduationCap,
        role: 'Teacher',
        roleDescription: 'Host live classes, share your expertise, and build your personal brand with our professional educator toolset.',
    },
    {
        id: 2,
        image: '/select_role/learners_track.png',
        track: 'Learners track',
        trackIcon: BookOpen,
        role: 'Student',
        roleDescription: 'Host live classes, share your expertise, and build your personal brand with our professional educator toolset.' 
    }
];

