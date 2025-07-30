"use client";

import { useState } from "react";

interface NameCardProps {
  name: string;
  owner: string;
  expires: string;
  metadata: string;
  isOwner: boolean;
  onRenew?: (name: string) => void;
  onTransfer?: (name: string, newOwner: string) => void;
  onUpdateMetadata?: (name: string, metadata: string) => void;
}

export default function NameCard({
  name,
  owner,
  expires,
  metadata,
  isOwner,
  onRenew,
  onTransfer,
  onUpdateMetadata,
}: NameCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [newOwner, setNewOwner] = useState("");
  const [newMetadata, setNewMetadata] = useState(metadata);
  const [isEditing, setIsEditing] = useState(false);

  const formatExpiry = (expiry: string) => {
    const date = new Date(Number.parseInt(expiry) * 1000);
    return date.toLocaleDateString();
  };

  const isExpired = () => {
    return Number.parseInt(expires) < Math.floor(Date.now() / 1000);
  };

  return (
    <div className="glass rounded-2xl p-6 hover-lift border-2 border-white/20 hover:border-purple-400/50 transition-all duration-500 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="text-3xl mr-3 group-hover:animate-bounce">⭐</span>
            <h3 className="text-2xl font-black text-white group-hover:text-gradient transition-all duration-300">
              {name}
            </h3>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-white/70 mb-1">Owner</p>
            <p className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-lg inline-block">
              {owner.slice(0, 8)}...{owner.slice(-6)}
            </p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => setShowActions(!showActions)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 neon-purple"
          >
            {showActions ? "Hide" : "Actions"}
          </button>
        )}
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70 font-medium flex items-center">
              <span className="mr-2">⏰</span>
              Expires
            </span>
            <span
              className={`font-bold px-3 py-1 rounded-lg ${
                isExpired()
                  ? "text-red-400 bg-red-500/20"
                  : "text-green-400 bg-green-500/20"
              }`}
            >
              {formatExpiry(expires)}
              {isExpired() && " (Expired)"}
            </span>
          </div>
        </div>

        {metadata && (
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <span className="text-white/70 font-medium flex items-center">
                <span className="mr-2">📝</span>
                Metadata
              </span>
              <span className="text-white text-right max-w-xs break-words">
                {metadata}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && isOwner && (
        <div className="space-y-4 border-t border-white/20 pt-6 animate-bounce-in">
          {onRenew && (
            <button
              onClick={() => onRenew(name)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 neon-blue"
            >
              🔄 Renew Magic
            </button>
          )}

          {onTransfer && (
            <div className="space-y-3">
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                placeholder="New owner address..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
              <button
                onClick={() => {
                  if (newOwner.trim()) {
                    onTransfer(name, newOwner);
                    setNewOwner("");
                  }
                }}
                disabled={!newOwner.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                🔄 Transfer Ownership
              </button>
            </div>
          )}

          {onUpdateMetadata && (
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <textarea
                    value={newMetadata}
                    onChange={(e) => setNewMetadata(e.target.value)}
                    rows={3}
                    placeholder="Update your metadata..."
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        onUpdateMetadata(name, newMetadata);
                        setIsEditing(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => {
                        setNewMetadata(metadata);
                        setIsEditing(false);
                      }}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-4 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  ✏️ Update Metadata
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// import { useState } from "react";

// interface NameCardProps {
//     name: string;
//     owner: string;
//     expires: string;
//     metadata: string;
//     isOwner: boolean;
//     onRenew?: (name: string) => void;
//     onTransfer?: (name: string, newOwner: string) => void;
//     onUpdateMetadata?: (name: string, metadata: string) => void;
// }

// export default function NameCard({
//     name,
//     owner,
//     expires,
//     metadata,
//     isOwner,
//     onRenew,
//     onTransfer,
//     onUpdateMetadata,
// }: NameCardProps) {
//     const [showActions, setShowActions] = useState(false);
//     const [newOwner, setNewOwner] = useState("");
//     const [newMetadata, setNewMetadata] = useState(metadata);
//     const [isEditing, setIsEditing] = useState(false);

//     const formatExpiry = (expiry: string) => {
//         const date = new Date(parseInt(expiry) * 1000);
//         return date.toLocaleDateString();
//     };

//     const isExpired = () => {
//         return parseInt(expires) < Math.floor(Date.now() / 1000);
//     };

//     return (
//         <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//             <div className="flex justify-between items-start mb-3">
//                 <div>
//                     <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
//                     <p className="text-sm text-gray-600">Owner: {owner}</p>
//                 </div>
//                 {isOwner && (
//                     <button
//                         onClick={() => setShowActions(!showActions)}
//                         className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                     >
//                         {showActions ? "Hide" : "Actions"}
//                     </button>
//                 )}
//             </div>

//             <div className="space-y-2 text-sm">
//                 <p>
//                     <span className="font-medium">Expires:</span>{" "}
//                     <span className={isExpired() ? "text-red-600" : "text-gray-700"}>
//                         {formatExpiry(expires)}
//                         {isExpired() && " (Expired)"}
//                     </span>
//                 </p>
//                 {metadata && (
//                     <p>
//                         <span className="font-medium">Metadata:</span> {metadata}
//                     </p>
//                 )}
//             </div>

//             {showActions && isOwner && (
//                 <div className="mt-4 space-y-3 border-t pt-3">
//                     {onRenew && (
//                         <button
//                             onClick={() => onRenew(name)}
//                             className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
//                         >
//                             Renew Name
//                         </button>
//                     )}

//                     {onTransfer && (
//                         <div className="space-y-2">
//                             <input
//                                 type="text"
//                                 value={newOwner}
//                                 onChange={(e) => setNewOwner(e.target.value)}
//                                 placeholder="New owner address"
//                                 className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//                             />
//                             <button
//                                 onClick={() => {
//                                     if (newOwner.trim()) {
//                                         onTransfer(name, newOwner);
//                                         setNewOwner("");
//                                     }
//                                 }}
//                                 disabled={!newOwner.trim()}
//                                 className="w-full bg-orange-600 text-white py-2 px-3 rounded text-sm hover:bg-orange-700 disabled:opacity-50"
//                             >
//                                 Transfer Name
//                             </button>
//                         </div>
//                     )}

//                     {onUpdateMetadata && (
//                         <div className="space-y-2">
//                             {isEditing ? (
//                                 <>
//                                     <textarea
//                                         value={newMetadata}
//                                         onChange={(e) => setNewMetadata(e.target.value)}
//                                         rows={2}
//                                         className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
//                                     />
//                                     <div className="flex space-x-2">
//                                         <button
//                                             onClick={() => {
//                                                 onUpdateMetadata(name, newMetadata);
//                                                 setIsEditing(false);
//                                             }}
//                                             className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
//                                         >
//                                             Save
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 setNewMetadata(metadata);
//                                                 setIsEditing(false);
//                                             }}
//                                             className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700"
//                                         >
//                                             Cancel
//                                         </button>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <button
//                                     onClick={() => setIsEditing(true)}
//                                     className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700"
//                                 >
//                                     Update Metadata
//                                 </button>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }
