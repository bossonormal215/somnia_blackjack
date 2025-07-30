"use client";
// @ts-nocheck
import { useEffect, useState, useRef } from "react";
import {
    useActiveAccount,
    ConnectButton,
    useSendTransaction,
    useReadContract,
} from "thirdweb/react";
import { prepareContractCall, getContract, waitForReceipt } from "thirdweb";
import { somniaTestnet } from "thirdweb/chains";
import { client } from "@/lib/thirdwebClient";
import { CONTRACTS, BLACKJACK_ABI } from "@/lib/contracts";
import Image from "next/image";

// Create contract instances
const contract = getContract({
    client,
    chain: somniaTestnet,
    address: CONTRACTS.SOMNIA_BLACKJACK,
});

// Helper to generate random 32 bytes as a hex string
function getRandomBytes32Hex() {
    const arr = new Uint8Array(32);
    window.crypto.getRandomValues(arr);
    return (
        "0x" +
        Array.from(arr)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
    );
}

// Helper to map card value to image filename
function getCardImage(card: number) {
    if (card === 11) return "/cards/11.svg"; // Ace
    if (card === 10) return "/cards/10.svg";
    if (card === 9) return "/cards/9.svg";
    if (card === 8) return "/cards/8.svg";
    if (card === 7) return "/cards/7.svg";
    if (card === 6) return "/cards/6.svg";
    if (card === 5) return "/cards/5.svg";
    if (card === 4) return "/cards/4.svg";
    if (card === 3) return "/cards/3.svg";
    if (card === 2) return "/cards/2.svg";
    if (card === 12 || card === 13 || card === 14) return "/cards/face.svg";
    return "/cards/10.svg";
}

function getGameMessage(gameState: any, status: string) {
    if (!gameState) return status;
    if (!gameState[2]) {
        if (gameState[1] > 21) return "Bust! You lost.";
        return "Game over.";
    }
    if (gameState[3]) return "Blackjack! You win!";
    return status;
}

export default function Home() {
    const account = useActiveAccount();
    const { mutate: sendTransaction } = useSendTransaction();

    const [status, setStatus] = useState("");
    const [isDrawing, setIsDrawing] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const cardRowRef = useRef<HTMLDivElement>(null);

    // Read contract data using hooks
    const { data: gameStateData, refetch: refetchGameState } = useReadContract({
        contract,
        method: "getGameState",
        params: [account?.address || "0x0"],
        queryOptions: { enabled: !!account?.address }
    });

    const { data: chipsData, refetch: refetchChips } = useReadContract({
        contract,
        method: "chips",
        params: [account?.address || "0x0"],
        queryOptions: { enabled: !!account?.address }
    });

    const { data: feeData } = useReadContract({
        contract,
        method: "getFee",
        params: [],
    });

    // Convert hook data to local state
    const gameState = gameStateData as any || null;
    const chips = chipsData ? Number(chipsData as unknown as bigint) : 0;
    const fee = feeData ? BigInt((feeData as unknown as bigint).toString()) : BigInt(0);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // Poll game state for up to 10 seconds after a tx
    const pollGameState = async () => {
        setError(null);
        let tries = 0;
        while (tries < 5) {
            try {
                await new Promise((res) => setTimeout(res, 2000));
                refetchGameState();
                refetchChips();
                tries++;
            } catch (err) {
                console.error("[POLL] Error refetching gameState:", err);
                tries++;
            }
        }
    };

    // Start Game with polling
    const startGameWithPolling = async () => {
        setStatus("Starting game...");
        setError(null);
        if (!account) {
            setError("Wallet not connected.");
            return;
        }

        try {
            const randomHex = getRandomBytes32Hex();
            if (!randomHex) throw new Error("Failed to generate randomness");

            console.log("[LOG] Fee from contract:", fee.toString());
            const bet = BigInt("100000000000000000"); // 0.1 STT
            const total_value = bet + fee;
            console.log(
                "[LOG] Bet:",
                bet.toString(),
                "Total value (bet+fee):",
                total_value.toString()
            );

            console.log("randomHex", randomHex);
            console.log("starting game");

            const transaction = prepareContractCall({
                contract,
                method: "function startGame()",
                params: [],
                value: total_value,
            });

            sendTransaction(transaction as any, {
                onSuccess: async (result) => {
                    console.log("[TX] Start Game hash:", result.transactionHash);
                    setStatus("Waiting for game to start...");

                    // Wait for transaction receipt
                    await waitForReceipt({
                        client,
                        chain: somniaTestnet,
                        transactionHash: result.transactionHash,
                    });

                    // Poll for game state
                    await pollGameState();
                    setStatus("Game started!");
                },
                onError: (error) => {
                    console.error("[ERROR] Transaction send failed:", error);
                    const errorString = error?.message || "unknown error";
                    let userError = "";
                    if (errorString.toLowerCase().includes("insufficient funds")) {
                        userError = "Insufficient funds. Please add more STT to your wallet.";
                    } else if (errorString.toLowerCase().includes("user rejected")) {
                        userError = "Transaction rejected by user.";
                    } else if (errorString.toLowerCase().includes("revert")) {
                        userError = "Contract reverted. Please check your bet and try again.";
                    } else if (errorString.toLowerCase().includes("game in progress")) {
                        userError = "Game already in progress. Please finish current game first.";
                        // Refresh game state to show current game
                        refetchGameState();
                    } else if (errorString.toLowerCase().includes("network")) {
                        userError = "Network error. Please check your connection and try again.";
                    } else {
                        userError = `❌ Transaction failed: ${errorString}`;
                    }
                    setError(userError);
                    setStatus("");
                }
            });
        } catch (err: any) {
            console.error("[ERROR] startGameWithPolling failed:", err);
            setError("Failed to start game. " + (err?.message || String(err)));
            setStatus("");
        }
    };

    // Draw Card with polling
    const handleDrawCardWithPolling = async () => {
        setIsDrawing(true);
        setError(null);
        if (!account) {
            setError("Wallet not connected.");
            setIsDrawing(false);
            return;
        }

        try {
            const randomHex = getRandomBytes32Hex();
            if (!randomHex) throw new Error("Failed to generate randomness");

            console.log("[LOG] Fee from contract:", fee.toString());

            const transaction = prepareContractCall({
                contract,
                method: "function drawCard()",
                params: [],
                value: fee,
            });

            sendTransaction(transaction as any, {
                onSuccess: async (result) => {
                    console.log("[TX] Draw Card hash:", result.transactionHash);
                    setStatus("Drawing card...");

                    // Wait for transaction receipt
                    await waitForReceipt({
                        client,
                        chain: somniaTestnet,
                        transactionHash: result.transactionHash,
                    });

                    // Poll for game state
                    await pollGameState();
                    setStatus("Card drawn.");
                    setIsDrawing(false);
                },
                onError: (error) => {
                    console.error("[ERROR] Transaction send failed:", error);
                    const errorString = error?.message || "unknown error";
                    let userError = "";
                    if (errorString.toLowerCase().includes("insufficient funds")) {
                        userError = "Insufficient funds. Please add more STT to your wallet.";
                    } else if (errorString.toLowerCase().includes("user rejected")) {
                        userError = "Transaction rejected by user.";
                    } else if (errorString.toLowerCase().includes("revert")) {
                        userError = "Contract reverted. Please check your bet and try again.";
                    } else if (errorString.toLowerCase().includes("blackjack already")) {
                        userError = "Blackjack already. Please start a new game.";
                    } else if (errorString.toLowerCase().includes("no active game")) {
                        userError = "No active game. Please start a new game.";
                    } else if (errorString.toLowerCase().includes("insufficient fee")) {
                        userError = "Insufficient fee. Please add more STT to your wallet.";
                    } else {
                        userError = `❌ Transaction failed: ${errorString}`;
                    }
                    setError(userError);
                    setStatus("");
                    setIsDrawing(false);
                }
            });
        } catch (err: any) {
            console.error("[ERROR] handleDrawCardWithPolling failed:", err);
            setError("Failed to draw card. " + (err?.message || String(err)));
            setStatus("");
            setIsDrawing(false);
        }
    };

    // Reset game handler
    const handleResetGame = async () => {
        if (!account) return;
        setIsResetting(true);

        try {
            const transaction = prepareContractCall({
                contract,
                method: "function resetGame()",
                params: [],
            });

            sendTransaction(transaction as any, {
                onSuccess: async (result) => {
                    console.log("[TX] Reset Game hash:", result.transactionHash);

                    // Wait for transaction receipt
                    await waitForReceipt({
                        client,
                        chain: somniaTestnet,
                        transactionHash: result.transactionHash,
                    });

                    setStatus("Game reset. You can start a new game.");
                    refetchGameState();
                    refetchChips();
                    setIsResetting(false);
                },
                onError: (error) => {
                    console.error("[ERROR] Reset game failed:", error);
                    const errorString = error?.message || "unknown error";
                    let userError = "";
                    if (errorString.toLowerCase().includes("user rejected")) {
                        userError = "Transaction rejected by user.";
                    } else {
                        userError = `Failed to reset game: ${errorString}`;
                    }
                    setStatus(userError);
                    setIsResetting(false);
                }
            });
        } catch (err: any) {
            console.error("[ERROR] Reset game preparation failed:", err);
            const errorString = err?.message || "unknown error";
            let userError = "";
            if (errorString.toLowerCase().includes("user rejected")) {
                userError = "Transaction rejected by user.";
            } else {
                userError = `Failed to reset game: ${errorString}`;
            }
            setStatus(userError);
            setIsResetting(false);
        }
    };

    return (
        <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-800 to-green-950 font-sans">
            <div className="w-full max-w-md rounded-xl shadow-2xl bg-white/90 overflow-hidden flex flex-col items-center relative backdrop-blur-md border border-green-700">
                {/* Header Row */}
                <div className="w-full bg-green-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight">
                            BlackJack Mini App
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-400 text-green-900 px-3 py-1 rounded-full shadow-md">
                        <Image
                            src="/cards/peacock.svg"
                            alt="chips"
                            width={20}
                            height={20}
                        />
                        <span className="font-bold text-sm">{chips} Chips</span>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="w-full flex flex-col items-center p-6 bg-green-100/50">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 w-full rounded shadow-sm">
                            <div className="flex items-center">
                                <svg
                                    className="h-5 w-5 text-red-500 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <p className="font-medium text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {!account ? (
                        <div className="flex flex-col items-center justify-center py-10 w-full">
                            <div className="mb-6 text-center">
                                <h2 className="text-xl font-bold text-green-900 mb-2">
                                    Welcome to BlackJack
                                </h2>
                                <p className="text-green-800">
                                    Connect your wallet to start playing
                                </p>
                            </div>
                            <ConnectButton
                                client={client}
                                theme="light"
                                connectModal={{ size: "compact" }}
                                connectButton={{
                                    className: "bg-green-800 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition duration-200 flex items-center gap-2"
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-full">
                            {/* Game Status Banner */}
                            {gameState && (
                                <div
                                    className={`w-full mb-6 p-3 rounded-lg text-center font-medium ${gameState[3]
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                        : !gameState[2]
                                            ? "bg-red-100 text-red-800 border border-red-300"
                                            : "bg-green-100 text-green-800 border border-green-300"
                                        }`}
                                >
                                    {getGameMessage(gameState, status)}
                                </div>
                            )}

                            {/* Game Controls */}
                            <div className="flex flex-col items-center w-full">
                                {/* Show Start Game only if no gameState or isAlive is false */}
                                {(!gameState || (gameState && !gameState[2])) && (
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-2 rounded-lg shadow mb-4 transition text-lg w-full"
                                        onClick={startGameWithPolling}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            Start Game (0.1 STT)
                                        </span>
                                    </button>
                                )}

                                {/* Show Draw Card only if gameState exists, isAlive is true, and hasBlackjack is false */}
                                {gameState && gameState[2] && !gameState[3] && (
                                    <button
                                        className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold px-8 py-2 rounded-lg shadow mb-4 transition text-lg w-full"
                                        onClick={handleDrawCardWithPolling}
                                        disabled={isDrawing}
                                    >
                                        {isDrawing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-green-900"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    ></path>
                                                </svg>
                                                Drawing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    ></path>
                                                </svg>
                                                Draw Card
                                            </span>
                                        )}
                                    </button>
                                )}

                                {/* Show Reset Game only if gameState exists and isAlive is false */}
                                {gameState && !gameState[2] && (
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-2 rounded-lg shadow mb-4 transition text-lg w-full"
                                        onClick={handleResetGame}
                                        disabled={isResetting}
                                    >
                                        {isResetting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8z"
                                                    ></path>
                                                </svg>
                                                Resetting...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    ></path>
                                                </svg>
                                                Reset Game
                                            </span>
                                        )}
                                    </button>
                                )}

                                {/* New Game button for users who win */}
                                {gameState && gameState[3] && (
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-2 rounded-lg shadow mb-4 transition text-lg w-full"
                                        onClick={startGameWithPolling}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                ></path>
                                            </svg>
                                            New Game
                                        </span>
                                    </button>
                                )}
                            </div>

                            {/* Cards Display */}
                            {gameState && Array.isArray(gameState[0]) && gameState[0].length > 0 && (
                                <div className="flex flex-col items-center mt-4 w-full">
                                    <div
                                        ref={cardRowRef}
                                        className="flex flex-row gap-3 mb-6 transition-all duration-500 justify-center min-h-[120px]"
                                    >
                                        {gameState[0].map((card: number, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`transition-transform duration-500 ${isDrawing && idx === gameState[0].length - 1
                                                    ? "animate-bounce"
                                                    : ""
                                                    }`}
                                                style={{
                                                    transform: `rotate(${(idx - (gameState[0].length - 1) / 2) * 5
                                                        }deg)`,
                                                    transformOrigin: "bottom center",
                                                    marginTop: Math.abs(
                                                        (idx - (gameState[0].length - 1) / 2) * 3
                                                    ),
                                                }}
                                            >
                                                <Image
                                                    src={getCardImage(card) || "/placeholder.svg"}
                                                    alt={`Card ${card}`}
                                                    width={70}
                                                    height={100}
                                                    className="rounded-xl shadow-lg bg-white border-2 border-green-800"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stats Bar */}
                                    <div className="grid grid-cols-3 gap-3 w-full mb-4">
                                        <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-md border border-green-200">
                                            <span className="text-xs text-green-700 font-medium mb-1">
                                                Sum
                                            </span>
                                            <span
                                                className={`text-xl font-bold ${gameState[1] > 21
                                                    ? "text-red-600"
                                                    : gameState[1] === 21
                                                        ? "text-yellow-600"
                                                        : "text-green-800"
                                                    }`}
                                            >
                                                {gameState[1]}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-md border border-green-200">
                                            <span className="text-xs text-green-700 font-medium mb-1">
                                                Status
                                            </span>
                                            <span
                                                className={`text-sm font-bold ${gameState[2] ? "text-green-600" : "text-red-600"
                                                    }`}
                                            >
                                                {gameState[2] ? "Active" : "Game Over"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-md border border-green-200">
                                            <span className="text-xs text-green-700 font-medium mb-1">
                                                Blackjack
                                            </span>
                                            <span
                                                className={`text-sm font-bold ${gameState[3] ? "text-yellow-600" : "text-gray-500"
                                                    }`}
                                            >
                                                {gameState[3] ? "Yes!" : "No"}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`text-center text-xl font-bold mt-2 ${gameState[3]
                                            ? "text-yellow-600"
                                            : !gameState[2]
                                                ? "text-red-600"
                                                : "text-green-800"
                                            }`}
                                    >
                                        {getGameMessage(gameState, status)}
                                    </div>
                                </div>
                            )}

                            {!gameState && status && (
                                <div className="text-green-900 text-center mt-6 p-4 bg-blue-100 rounded-lg border border-blue-300 font-medium">
                                    {status}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-6 text-green-200 text-xs opacity-80 text-center">
                <div>Built for Somnia Blockchain</div>
                <div className="mt-1">Powered by Thirdweb</div>
            </div>
            <style jsx global>{`
        .animate-bounce {
          animation: bounce 0.8s;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg) scale(1.1);
          }
        }
      `}</style>
        </div>
    );
} 