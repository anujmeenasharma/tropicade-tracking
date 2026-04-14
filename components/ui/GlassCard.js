'use client';
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

export function GlassCard({ children, className, ...props }) {
    return (
        <motion.div
            className={cn("rounded-xl", className)}
            style={{
                background: '#FFFFFF',
                border: '1px solid #E2E6EF',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
