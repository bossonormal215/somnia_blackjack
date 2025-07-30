"use client";

import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export default function Notification({
  message,
  type,
  isVisible,
  onClose,
}: NotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25";
      case "error":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25";
      case "info":
        return "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📢";
    }
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-4 rounded-xl backdrop-blur-sm border border-white/20 transform transition-all duration-300 ${getTypeStyles()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getIcon()}</span>
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white/80 hover:text-white transition-colors duration-200 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// import { useState, useEffect } from "react";

// interface NotificationProps {
//     message: string;
//     type: "success" | "error" | "info";
//     isVisible: boolean;
//     onClose: () => void;
// }

// export default function Notification({ message, type, isVisible, onClose }: NotificationProps) {
//     useEffect(() => {
//         if (isVisible) {
//             const timer = setTimeout(() => {
//                 onClose();
//             }, 5000);

//             return () => clearTimeout(timer);
//         }
//     }, [isVisible, onClose]);

//     if (!isVisible) return null;

//     const getTypeStyles = () => {
//         switch (type) {
//             case "success":
//                 return "bg-green-500 text-white";
//             case "error":
//                 return "bg-red-500 text-white";
//             case "info":
//                 return "bg-blue-500 text-white";
//             default:
//                 return "bg-gray-500 text-white";
//         }
//     };

//     return (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${getTypeStyles()}`}>
//             <div className="flex items-center justify-between">
//                 <span>{message}</span>
//                 <button
//                     onClick={onClose}
//                     className="ml-4 text-white hover:text-gray-200"
//                 >
//                     ×
//                 </button>
//             </div>
//         </div>
//     );
// }
