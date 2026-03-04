'use client';
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function Button({ children, className, variant = "primary", ...props }) {
    const variants = {
        primary: "bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200",
        accent: "bg-[#00388C] text-white hover:bg-[#002a6b]",
        outline: "border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
        ghost: "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
    };

    return (
        <motion.button
            className={cn(
                "inline-flex items-center justify-center cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
