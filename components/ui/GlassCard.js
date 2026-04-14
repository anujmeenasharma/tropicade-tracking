'use client';
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn(
                "glass-card",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
