"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
    const cursorContainerRef = useRef(null);

    const stateRef = useRef({
        cursorDetected: false,
        mouse: {
            target: { x: 0, y: 0 },
            current: { x: 0, y: 0 },
            lerp: 0.2, // Adjust for smoothness vs responsiveness
        },
    });

    useEffect(() => {
        const state = stateRef.current;
        let animationFrameId;

        // 1. Track Cursor Movement
        const handleMouseMove = (e) => {
            state.cursorDetected = true;
            state.mouse.target = {
                x: e.clientX,
                y: e.clientY,
            };
        };

        window.addEventListener("mousemove", handleMouseMove);

        // 2. Animation Loop for smooth trailing
        const animate = () => {
            // Lerp Mouse Position
            state.mouse.current.x += (state.mouse.target.x - state.mouse.current.x) * state.mouse.lerp;
            state.mouse.current.y += (state.mouse.target.y - state.mouse.current.y) * state.mouse.lerp;

            if (cursorContainerRef.current) {
                // Adjust the offset (-40, -40 etc.) so the "tip" of the fire is where the cursor clicks, or center it based on preference
                // By default we center it, assuming a 80x80 size.
                cursorContainerRef.current.style.transform = `translate3d(${state.mouse.current.x}px, ${state.mouse.current.y}px, 0)`;

                // Hide until first mouse movement to avoid it stuck rendering in top left
                if (state.cursorDetected) {
                    cursorContainerRef.current.style.opacity = 1;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={cursorContainerRef}
            className="fixed top-0 left-0 z-[9999] pointer-events-none opacity-0 flex items-center justify-center -translate-x-1/2 -translate-y-[60%] sm:-translate-y-1/2" // slight Y offset to make the actual click point the base of the flame
            style={{
                // mixBlendMode: "screen", // optional glow blend
                width: "90px",
                height: "90px"
            }}
        >
            <div className="absolute inset-0 bg-orange-500/20 rounded-full filter blur-[20px] animate-pulse pointer-events-none"></div>
            <video
                src="/Fire.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain pointer-events-none"
            ></video>
        </div>
    );
}
