import { navLinksType } from "@/types/nav/nav_links"

import { Button } from "@/components/ui/button"

import { Search } from "lucide-react";

import { Field } from "@/components/ui/field";

import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

export const navLinksData: navLinksType[] = [
    {
        id: 1,
        textOrElement: <InputGroup className='relative py-1.5 px-1 bg-white gap-x-2'>
            <InputGroupAddon>
                <Search className="size-4 stroke-gray-500" />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search classes..."/>
        </InputGroup>
    },
    {
        id: 2,
        textOrElement: 'How it works'
    },
    {
        id: 3,
        textOrElement: 'Pricing'
    },
    {
        id: 4,
        textOrElement: 'Why they love us'
    },
    {
        id: 5,
        textOrElement: 'Sign In'
    },
    {
        id: 6,
        textOrElement: <Button className='bg-[#1F4FD8] text-white! py-6 px-6.5'>Get Started</Button>
    }
]