"use client";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdwebClient";
import { somniaTestnet } from "thirdweb/chains";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-8">Somnia Name Service</h1>
            <ConnectButton
                chain={somniaTestnet}
                client={client}
                connectModal={{ showThirdwebBranding: false, size: "compact" }}
                wallets={wallets}
            />
        </div>
    );
}
