"use client";

import { type ReactNode, useState } from "react";
import { selectRoleData } from "@/lib/data/auth/select_role";
import Card from "./Card";
import clsx from "clsx";

export default function Roles(): ReactNode {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <section className="mt-8 flex md:flex-row gap-6 flex-col px-4 md:px-0">
            {selectRoleData.map((selectRoleItem) => (
                <Card
                    key={selectRoleItem.id}
                    {...selectRoleItem}
                    styles={clsx(
                        "h-min max-w-120.5 rounded-[16px] transition-all duration-500 outline-1",
                        selectRoleItem.id === selectedId
                            ? "outline-2 outline-green-500"
                            : "outline-gray-400 group hover:outline-2 hover:outline-[#86F9BD]",
                    )}
                    handleClick={() => setSelectedId(selectRoleItem.id)}
                />
            ))}
        </section>
    );
}
