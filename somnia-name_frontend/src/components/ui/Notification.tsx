import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { clsx } from "clsx";

interface NotificationProps {
    type: "success" | "error" | "info";
    message: string;
    onClose?: () => void;
    duration?: number;
}

const Notification = ({ type, message, onClose, duration = 5000 }: NotificationProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onClose?.(), 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info,
    };

    const styles = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const Icon = icons[type];

    if (!isVisible) return null;

    return (
        <div
            className={clsx(
                "fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg transition-all duration-300",
                styles[type]
            )}
        >
            <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{message}</p>
                {onClose && (
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(() => onClose(), 300);
                        }}
                        className="ml-auto flex-shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export { Notification }; 