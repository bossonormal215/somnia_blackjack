import { clsx } from "clsx";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "elevated";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", children, ...props }, ref) => {
        const baseClasses = "rounded-xl border";

        const variants = {
            default: "bg-white border-gray-200 shadow-sm",
            elevated: "bg-white border-gray-200 shadow-lg",
        };

        return (
            <div
                ref={ref}
                className={clsx(baseClasses, variants[variant], className)}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export { Card }; 