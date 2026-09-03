"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';

type Slide = {
    id: number;
    title: string;
    description: string;
    image: string;
};

const slides: Slide[] = [
    {
        id: 1,
        title: "Turn Knowledge Into Income.",
        description:
            "Build your reputation, grow your audience, and earn through live teaching.",
        image: "/auth/auth_image_one.png",
    },
    {
        id: 2,
        title: "Bring Your Lectures Online.",
        description:
            "Create impactful learning experiences for tertiary students through live teaching.",
        image: "/auth/auth_image_two.png",
    },
    {
        id: 3,
        title: "Learn From Verified Educators.",
        description:
            "Join trusted live classes taught by experienced teachers and lecturers.",
        image: "/auth/auth_image_three.png",
    },
    {
        id: 4,
        title: "Interactive Learning Experience.",
        description:
            "Teach and learn using whiteboards, teaching materials, and real-time engagement tools.",
        image: "/auth/auth_image_four.png",
    },
    {
        id: 5,
        title: "Teach Live. Reach More Students.",
        description:
            "Host interactive classes beyond your physical classroom and connect with learners anywhere.",
        image: "/auth/auth_image_five.png",
    },
];

export default function AuthSlider(): ReactNode {
    const [currentIndex, setCurrentIndex] = useState(0);
    const trackRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useGSAP(
        () => {
            gsap.to(trackRef.current, {
                xPercent: -100 * currentIndex,
                duration: 0.6,
                ease: "power2.inOut",
            });
        },
        { dependencies: [currentIndex], scope: containerRef },
    );

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const previousSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === slides.length - 1 ? 0 : prev + 1,
            );
        }, 2800);

        return () => clearTimeout(timeout);
    }, [currentIndex]);

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full overflow-hidden font-inter"
        >
            <div ref={trackRef} className="flex h-full w-full">
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="relative h-full w-full shrink-0"
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="h-full w-full object-cover"
                        />

                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background:
                                    "linear-gradient(to top, #0037B1E5 0%, #0037B133 20%, #0037B100 90%)",
                            }}
                        />

                        <div className="absolute bottom-30 left-4 xl:left-10 max-w-lg text-white">
                            <h2 className="text-4xl font-bold">
                                {slide.title}
                            </h2>
                            <p className="mt-4 text-lg">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute xl:right-10 xl:bottom-10 flex gap-3 z-10 right-4 bottom-5">
                <button
                    type="button"
                    onClick={previousSlide}
                    className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                    aria-label="Previous slide"
                >
                    <ChevronLeft />
                </button>
                <button
                    type="button"
                    onClick={nextSlide}
                    className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                    aria-label="Next slide"
                >
                    <ChevronRight />
                </button>
            </div>

            <div className="absolute bottom-20 xl:bottom-10 left-21 xl:left-36 flex -translate-x-1/2 gap-2 z-10">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex ? "w-5 bg-white" : "w-5 bg-white/50"}`}
                    />
                ))}
            </div>
            <div>
                <button 
                    onClick={() => router.push('/signup')}
                className="cursor-pointer absolute inline-block xl:hidden bottom-5 left-4 py-2 px-4 bg-white rounded-[12px]">Get Started</button>
            </div>
        </div>
    );
}
