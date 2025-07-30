"use client";

import React, { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdwebClient";
import { somniaTestnet } from "thirdweb/chains";
import { useNames } from "@/hooks/useNames";
import NameCard from "./NameCard";

interface TabProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: string;
  gradient: string;
}

const Tab: React.FC<TabProps> = ({
  isActive,
  onClick,
  children,
  icon,
  gradient,
}) => (
  <button
    onClick={onClick}
    className={`group relative px-8 py-4 font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 ${
      isActive
        ? `${gradient} text-white shadow-2xl neon-purple`
        : "bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20 border border-white/20 hover:border-white/40"
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl group-hover:animate-bounce">{icon}</span>
      <span className="text-lg">{children}</span>
    </div>
    {isActive && (
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse-ring"></div>
    )}
  </button>
);

export default function TabbedInterface() {
  const [activeTab, setActiveTab] = useState(0);
  const {
    address,
    price,
    myNames,
    myNamesLoading,
    registerName,
    renewName,
    transferName,
    updateMetadata,
    setResolverAddress,
    getResolverAddress,
    getNameDetails,
    refreshMyNames,
  } = useNames();

  const tabs = [
    {
      name: "Register",
      icon: "🚀",
      gradient: "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600",
      component: (
        <RegisterTab
          price={price}
          onRegister={registerName}
          isLoading={false}
        />
      ),
    },
    {
      name: "My Names",
      icon: "💎",
      gradient: "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600",
      component: (
        <MyNamesTab
          address={address}
          myNames={myNames}
          myNamesLoading={myNamesLoading}
          onRenew={renewName}
          onTransfer={transferName}
          onUpdateMetadata={updateMetadata}
          isLoading={false}
          refreshMyNames={refreshMyNames}
        />
      ),
    },
    {
      name: "Search",
      icon: "🔮",
      gradient: "bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600",
      component: <SearchTab getNameDetails={getNameDetails} />,
    },
    {
      name: "Resolver",
      icon: "⚡",
      gradient: "bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600",
      component: (
        <ResolverTab
          onSetAddress={setResolverAddress}
          onGetAddress={getResolverAddress}
          isLoading={false}
        />
      ),
    },
    {
      name: "Admin",
      icon: "👑",
      gradient: "bg-gradient-to-r from-red-600 via-pink-600 to-purple-600",
      component: <AdminTab address={address} />,
    },
  ];

  return (
    <div className="min-h-screen bg-cosmic animate-gradient relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute top-40 right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "6s" }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8 animate-bounce-in">
            <h1 className="text-8xl font-black mb-6 text-rainbow leading-tight">
              Somnia Name Service
            </h1>
            <div className="flex justify-center mb-6">
              <div className="w-32 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full animate-shimmer"></div>
            </div>
            <p className="text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              ✨ Where dreams meet the blockchain ✨
              <br />
              <span className="text-xl text-white/70">
                Secure your digital identity on the Somnia Testnet with our
                revolutionary decentralized naming system
              </span>
            </p>
          </div>

          <div className="inline-block p-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl animate-pulse-ring">
            <div className="glass rounded-2xl p-6 hover-lift">
              <ConnectButton
                chain={somniaTestnet}
                client={client}
                connectModal={{ showThirdwebBranding: false, size: "compact" }}
                wallets={wallets}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass rounded-3xl shadow-2xl p-8 max-w-7xl mx-auto hover-lift">
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                isActive={activeTab === index}
                onClick={() => setActiveTab(index)}
                icon={tab.icon}
                gradient={tab.gradient}
              >
                {tab.name}
              </Tab>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px] glass-dark rounded-3xl p-10 border-2 border-white/20">
            <div className="animate-bounce-in">{tabs[activeTab].component}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Register Tab Component
function RegisterTab({
  price,
  onRegister,
  isLoading,
}: {
  price: string;
  onRegister: (name: string, metadata?: string) => Promise<boolean>;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [metadata, setMetadata] = useState("");

  const handleRegister = async () => {
    if (!name.trim()) return;
    try {
      await onRegister(name, metadata);
      setName("");
      setMetadata("");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-float">🚀</div>
        <h2 className="text-5xl font-black text-white mb-6 text-gradient">
          Register Your Dream Name
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Claim your unique identity on the Somnia network and join the
          revolution
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        <div className="space-y-4">
          <label className="block text-lg font-bold text-white/90">
            ✨ Dream Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your magical name..."
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 hover:bg-white/15"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-bold text-white/90">
            📝 Metadata (optional)
          </label>
          <textarea
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            placeholder="Add some magic to your name..."
            rows={4}
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300 resize-none hover:bg-white/15"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={!name.trim() || isLoading}
          className="w-full btn-cosmic text-white py-6 px-8 rounded-2xl font-black text-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 neon-purple"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Casting Magic...</span>
            </div>
          ) : (
            <span>🎯 Register Name ({price} STT)</span>
          )}
        </button>
      </div>
    </div>
  );
}

// My Names Tab Component
function MyNamesTab({
  address,
  myNames,
  myNamesLoading,
  onRenew,
  onTransfer,
  onUpdateMetadata,
  isLoading,
  refreshMyNames,
}: {
  address: string | undefined;
  myNames: any[];
  myNamesLoading: boolean;
  onRenew: (name: string) => Promise<boolean>;
  onTransfer: (name: string, newOwner: string) => Promise<boolean>;
  onUpdateMetadata: (name: string, metadata: string) => Promise<boolean>;
  isLoading: boolean;
  refreshMyNames: () => void;
}) {
  const renderMyNamesTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">
          Your Magical Collection
        </h3>
        <button
          onClick={refreshMyNames}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 neon-blue"
        >
          🔄 Refresh Magic
        </button>
      </div>

      {myNamesLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-white/80 text-xl">Summoning your names...</p>
          </div>
        </div>
      ) : myNames && myNames.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myNames.map((record: any, index: number) => (
            <div
              key={record.name}
              className="animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <NameCard
                name={record.name}
                owner={record.owner}
                expires={record.expires}
                metadata={record.metadata}
                isOwner={true}
                onRenew={onRenew}
                onTransfer={onTransfer}
                onUpdateMetadata={onUpdateMetadata}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-8xl mb-8 animate-float">🌟</div>
          <h3 className="text-3xl font-bold text-white mb-4">No Names Yet!</h3>
          <p className="text-white/70 text-xl mb-2">
            Your magical journey awaits
          </p>
          <p className="text-white/50 text-lg">
            Register your first dream name to begin!
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-float">💎</div>
        <h2 className="text-5xl font-black text-white mb-6 text-gradient">
          My Dream Names
        </h2>
        <p className="text-xl text-white/80">
          Manage your digital identity collection
        </p>
      </div>

      {!address ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-8 animate-float">🔐</div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h3>
          <p className="text-white/70 text-xl">
            Unlock your magical names collection
          </p>
        </div>
      ) : (
        renderMyNamesTab()
      )}
    </div>
  );
}

// Search Tab Component
function SearchTab({
  getNameDetails,
}: {
  getNameDetails: (name: string) => Promise<any>;
}) {
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) return;
    setSearching(true);
    try {
      const result = await getNameDetails(searchName);
      setSearchResult(result);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-float">🔮</div>
        <h2 className="text-5xl font-black text-white mb-6 text-gradient">
          Search the Universe
        </h2>
        <p className="text-xl text-white/80">
          Discover names across the Somnia cosmos
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter name to explore..."
            className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-300 hover:bg-white/15"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={!searchName.trim() || searching}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 neon-blue"
          >
            {searching ? "🔍" : "Search"}
          </button>
        </div>

        {searchResult && (
          <div className="glass rounded-2xl p-8 border-2 border-white/20 animate-bounce-in">
            <h3 className="font-bold text-white mb-6 text-xl">
              🎯 Search Results for "{searchName}"
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-white/70 font-medium">Owner:</span>
                <span className="text-white font-mono text-sm bg-white/10 px-3 py-1 rounded-lg">
                  {searchResult.owner.slice(0, 6)}...
                  {searchResult.owner.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-white/70 font-medium">Expires:</span>
                <span className="text-white font-bold">
                  {searchResult.expires}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-white/70 font-medium">Metadata:</span>
                <span className="text-white">
                  {searchResult.metadata || "None"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Resolver Tab Component
function ResolverTab({
  onSetAddress,
  onGetAddress,
  isLoading,
}: {
  onSetAddress: (name: string, addr: string) => Promise<boolean>;
  onGetAddress: (name: string) => Promise<string | null>;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSetAddress = async () => {
    if (!name.trim() || !address.trim()) return;
    try {
      await onSetAddress(name, address);
      setName("");
      setAddress("");
    } catch (error) {
      console.error("Setting address failed:", error);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-float">⚡</div>
        <h2 className="text-5xl font-black text-white mb-6 text-gradient">
          Address Resolver
        </h2>
        <p className="text-xl text-white/80">
          Connect names to blockchain addresses
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-8">
        <div className="space-y-4">
          <label className="block text-lg font-bold text-white/90">
            🏷️ Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name to resolve..."
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-bold text-white/90">
            🔗 Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter blockchain address..."
            className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-400 transition-all duration-300 hover:bg-white/15"
          />
        </div>

        <button
          onClick={handleSetAddress}
          disabled={!name.trim() || !address.trim() || isLoading}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-6 px-8 rounded-2xl font-black text-xl hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 neon-pink"
        >
          {isLoading ? "⚡ Connecting..." : "⚡ Set Address"}
        </button>
      </div>
    </div>
  );
}

// Admin Tab Component
function AdminTab({ address }: { address: string | undefined }) {
  const [newPrice, setNewPrice] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetPrice = async () => {
    if (!newPrice.trim()) return;
    setIsLoading(true);
    try {
      console.log("Setting price to:", newPrice);
      setNewPrice("");
    } catch (error) {
      console.error("Setting price failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAddress.trim()) return;
    setIsLoading(true);
    try {
      console.log("Withdrawing to:", withdrawAddress);
      setWithdrawAddress("");
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-float">👑</div>
        <h2 className="text-5xl font-black text-white mb-6 text-gradient">
          Admin Control
        </h2>
        <p className="text-xl text-white/80">Manage the Somnia universe</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-10">
        <div className="glass rounded-2xl p-8 border-2 border-white/20 hover-lift">
          <h3 className="font-black text-white mb-8 text-2xl flex items-center">
            <span className="mr-3">💰</span>
            Set Registration Price
          </h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-bold text-white/90">
                New Price (STT)
              </label>
              <input
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter new magical price..."
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-red-500/50 focus:border-red-400 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <button
              onClick={handleSetPrice}
              disabled={!newPrice.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "⚡ Setting..." : "💫 Set Price"}
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border-2 border-white/20 hover-lift">
          <h3 className="font-black text-white mb-8 text-2xl flex items-center">
            <span className="mr-3">💸</span>
            Withdraw Treasury
          </h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-bold text-white/90">
                Withdraw Address
              </label>
              <input
                type="text"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="Enter destination address..."
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white text-lg placeholder-white/50 focus:ring-4 focus:ring-red-500/50 focus:border-red-400 transition-all duration-300 hover:bg-white/15"
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={!withdrawAddress.trim() || isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-red-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "💸 Withdrawing..." : "💎 Withdraw"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import { ConnectButton } from "thirdweb/react";
// import { client, wallets } from "@/lib/thirdwebClient";
// import { somniaTestnet } from "thirdweb/chains";
// import { useNames } from "@/hooks/useNames";
// import NameCard from "./NameCard";
// import Notification from "./Notification";

// interface TabProps {
//     isActive: boolean;
//     onClick: () => void;
//     children: React.ReactNode;
// }

// const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => (
//     <button
//         onClick={onClick}
//         className={`px-4 py-2 font-medium rounded-lg transition-colors ${isActive
//             ? "bg-blue-600 text-white"
//             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//             }`}
//     >
//         {children}
//     </button>
// );

// export default function TabbedInterface() {
//     const [activeTab, setActiveTab] = useState(0);
//     const {
//         address,
//         price,
//         myNames,
//         myNamesLoading,
//         registerName,
//         renewName,
//         transferName,
//         updateMetadata,
//         setResolverAddress,
//         getResolverAddress,
//         getNameDetails,
//         refreshMyNames,
//     } = useNames();

//     const tabs = [
//         { name: "Register", component: <RegisterTab price={price} onRegister={registerName} isLoading={false} /> },
//         { name: "My Names", component: <MyNamesTab address={address} myNames={myNames} myNamesLoading={myNamesLoading} onRenew={renewName} onTransfer={transferName} onUpdateMetadata={updateMetadata} isLoading={false} refreshMyNames={refreshMyNames} /> },
//         { name: "Search", component: <SearchTab getNameDetails={getNameDetails} /> },
//         { name: "Resolver", component: <ResolverTab onSetAddress={setResolverAddress} onGetAddress={getResolverAddress} isLoading={false} /> },
//         { name: "Admin", component: <AdminTab address={address} /> },
//     ];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
//             <div className="container mx-auto px-4 py-8">
//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <h1 className="text-4xl font-bold text-gray-900 mb-4">
//                         Somnia Name Service
//                     </h1>
//                     <p className="text-lg text-gray-600 mb-6">
//                         Decentralized naming system on Somnia Testnet
//                     </p>
//                     <ConnectButton
//                         chain={somniaTestnet}
//                         client={client}
//                         connectModal={{ showThirdwebBranding: false, size: "compact" }}
//                         wallets={wallets}
//                     />
//                 </div>

//                 {/* Tabs */}
//                 <div className="bg-white rounded-xl shadow-lg p-6">
//                     <div className="flex space-x-2 mb-6 overflow-x-auto">
//                         {tabs.map((tab, index) => (
//                             <Tab
//                                 key={index}
//                                 isActive={activeTab === index}
//                                 onClick={() => setActiveTab(index)}
//                             >
//                                 {tab.name}
//                             </Tab>
//                         ))}
//                     </div>

//                     {/* Tab Content */}
//                     <div className="min-h-[400px]">
//                         {tabs[activeTab].component}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Register Tab Component
// function RegisterTab({ price, onRegister, isLoading }: {
//     price: string;
//     onRegister: (name: string, metadata?: string) => Promise<boolean>;
//     isLoading: boolean;
// }) {
//     const [name, setName] = useState("");
//     const [metadata, setMetadata] = useState("");

//     const handleRegister = async () => {
//         if (!name.trim()) return;

//         try {
//             await onRegister(name, metadata);
//             setName("");
//             setMetadata("");
//         } catch (error) {
//             console.error("Registration failed:", error);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-900">Register New Name</h2>
//             <div className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Name
//                     </label>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         placeholder="Enter name to register"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Metadata (optional)
//                     </label>
//                     <textarea
//                         value={metadata}
//                         onChange={(e) => setMetadata(e.target.value)}
//                         placeholder="Enter metadata for this name"
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <button
//                     onClick={handleRegister}
//                     disabled={!name.trim() || isLoading}
//                     className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {isLoading ? "Registering..." : `Register Name (${price} ETH)`}
//                 </button>
//             </div>
//         </div>
//     );
// }

// // My Names Tab Component
// function MyNamesTab({
//     address,
//     myNames,
//     myNamesLoading,
//     onRenew,
//     onTransfer,
//     onUpdateMetadata,
//     isLoading,
//     refreshMyNames
// }: {
//     address: string | undefined;
//     myNames: any[];
//     myNamesLoading: boolean;
//     onRenew: (name: string) => Promise<boolean>;
//     onTransfer: (name: string, newOwner: string) => Promise<boolean>;
//     onUpdateMetadata: (name: string, metadata: string) => Promise<boolean>;
//     isLoading: boolean;
//     refreshMyNames: () => void;
// }) {
//     const renderMyNamesTab = () => (
//         <div className="space-y-4">
//             <button
//                 onClick={refreshMyNames}
//                 className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//                 Refresh
//             </button>
//             {myNamesLoading ? (
//                 <div>Loading your names...</div>
//             ) : myNames && myNames.length > 0 ? (
//                 myNames.map((record: any) => (
//                     <NameCard
//                         key={record.name}
//                         name={record.name}
//                         owner={record.owner}
//                         expires={record.expires}
//                         metadata={record.metadata}
//                         isOwner={true}
//                         onRenew={onRenew}
//                         onTransfer={onTransfer}
//                         onUpdateMetadata={onUpdateMetadata}
//                     />
//                 ))
//             ) : (
//                 <div>You do not own any names yet.</div>
//             )}
//         </div>
//     );

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-900">My Names</h2>
//             {!address ? (
//                 <p className="text-gray-600">Please connect your wallet to view your names.</p>
//             ) : (
//                 renderMyNamesTab()
//             )}
//         </div>
//     );
// }

// // Search Tab Component
// function SearchTab({ getNameDetails }: { getNameDetails: (name: string) => Promise<any> }) {
//     const [searchName, setSearchName] = useState("");
//     const [searchResult, setSearchResult] = useState<any>(null);
//     const [searching, setSearching] = useState(false);

//     const handleSearch = async () => {
//         if (!searchName.trim()) return;

//         setSearching(true);
//         try {
//             const result = await getNameDetails(searchName);
//             setSearchResult(result);
//         } catch (error) {
//             console.error("Search failed:", error);
//             setSearchResult(null);
//         } finally {
//             setSearching(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-900">Search Names</h2>
//             <div className="space-y-4">
//                 <div className="flex space-x-2">
//                     <input
//                         type="text"
//                         value={searchName}
//                         onChange={(e) => setSearchName(e.target.value)}
//                         placeholder="Enter name to search"
//                         className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                     <button
//                         onClick={handleSearch}
//                         disabled={!searchName.trim() || searching}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                     >
//                         {searching ? "Searching..." : "Search"}
//                     </button>
//                 </div>

//                 {searchResult && (
//                     <div className="border border-gray-200 rounded-lg p-4">
//                         <h3 className="font-medium mb-2">Search Results for "{searchName}"</h3>
//                         <div className="space-y-2 text-sm">
//                             <p><span className="font-medium">Owner:</span> {searchResult.owner}</p>
//                             <p><span className="font-medium">Expires:</span> {searchResult.expires}</p>
//                             <p><span className="font-medium">Metadata:</span> {searchResult.metadata}</p>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // Resolver Tab Component
// function ResolverTab({ onSetAddress, onGetAddress, isLoading }: {
//     onSetAddress: (name: string, addr: string) => Promise<boolean>;
//     onGetAddress: (name: string) => Promise<string | null>;
//     isLoading: boolean;
// }) {
//     const [name, setName] = useState("");
//     const [address, setAddress] = useState("");

//     const handleSetAddress = async () => {
//         if (!name.trim() || !address.trim()) return;

//         try {
//             await onSetAddress(name, address);
//             setName("");
//             setAddress("");
//         } catch (error) {
//             console.error("Setting address failed:", error);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-900">Address Resolver</h2>
//             <div className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Name
//                     </label>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         placeholder="Enter name"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Address
//                     </label>
//                     <input
//                         type="text"
//                         value={address}
//                         onChange={(e) => setAddress(e.target.value)}
//                         placeholder="Enter address"
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>
//                 <button
//                     onClick={handleSetAddress}
//                     disabled={!name.trim() || !address.trim() || isLoading}
//                     className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                     {isLoading ? "Setting..." : "Set Address"}
//                 </button>
//             </div>
//         </div>
//     );
// }

// // Admin Tab Component
// function AdminTab({ address }: { address: string | undefined }) {
//     const [newPrice, setNewPrice] = useState("");
//     const [withdrawAddress, setWithdrawAddress] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSetPrice = async () => {
//         if (!newPrice.trim()) return;

//         setIsLoading(true);
//         try {
//             // This would need to be implemented with contract calls
//             console.log("Setting price to:", newPrice);
//             setNewPrice("");
//         } catch (error) {
//             console.error("Setting price failed:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleWithdraw = async () => {
//         if (!withdrawAddress.trim()) return;

//         setIsLoading(true);
//         try {
//             // This would need to be implemented with contract calls
//             console.log("With withdrawing to:", withdrawAddress);
//             setWithdrawAddress("");
//         } catch (error) {
//             console.error("Withdrawal failed:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-6">
//             <h2 className="text-2xl font-semibold text-gray-900">Admin Functions</h2>
//             <div className="space-y-6">
//                 <div className="border border-gray-200 rounded-lg p-4">
//                     <h3 className="font-medium mb-4">Set Registration Price</h3>
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 New Price (ETH)
//                             </label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 value={newPrice}
//                                 onChange={(e) => setNewPrice(e.target.value)}
//                                 placeholder="Enter new price in ETH"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <button
//                             onClick={handleSetPrice}
//                             disabled={!newPrice.trim() || isLoading}
//                             className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//                         >
//                             {isLoading ? "Setting..." : "Set Price"}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="border border-gray-200 rounded-lg p-4">
//                     <h3 className="font-medium mb-4">Withdraw Funds</h3>
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Withdraw Address
//                             </label>
//                             <input
//                                 type="text"
//                                 value={withdrawAddress}
//                                 onChange={(e) => setWithdrawAddress(e.target.value)}
//                                 placeholder="Enter address to withdraw to"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <button
//                             onClick={handleWithdraw}
//                             disabled={!withdrawAddress.trim() || isLoading}
//                             className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
//                         >
//                             {isLoading ? "Withdrawing..." : "Withdraw"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
