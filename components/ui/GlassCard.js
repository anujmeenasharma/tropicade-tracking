'use client';
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                "rounded-2xl glass shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]",
                "border-l-[6px] border-l-[#00388C]",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
