import { useReadContract, useSendTransaction } from "thirdweb/react";
import { getContract } from "thirdweb";
import { useState } from "react";
import { somRegistryAddress, somResolverAddress } from "@/utils/contract";
import { client } from "@/lib/thirdwebClient";
import { somniaTestnet } from "thirdweb/chains";

export const useNamingService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registryContract = getContract({
    address: somRegistryAddress,
    chain: somniaTestnet,
    client,
  });
  const resolverContract = getContract({
    address: somResolverAddress,
    chain: somniaTestnet,
    client,
  });

  // Read operations
  const { data: price, isLoading: priceLoading } = useReadContract({
    contract: registryContract,
    method: "function price() view returns (uint256)",
  });

  const { mutate: sendTransaction } = useSendTransaction();

  const executeWithLoading = async (operation: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerName = async (name: string, metadata: string) => {
    return executeWithLoading(async () => {
      // This would need to be implemented with proper thirdweb v5 transaction
      console.log("Registering name:", name, "with metadata:", metadata);
      return true;
    });
  };

  const renewName = async (name: string) => {
    return executeWithLoading(async () => {
      // This would need to be implemented with proper thirdweb v5 transaction
      console.log("Renewing name:", name);
      return true;
    });
  };

  const updateMetadata = async (name: string, metadata: string) => {
    return executeWithLoading(async () => {
      // This would need to be implemented with proper thirdweb v5 transaction
      console.log("Updating metadata for name:", name, "to:", metadata);
      return true;
    });
  };

  const updateResolver = async (name: string, resolverAddress: string) => {
    return executeWithLoading(async () => {
      // This would need to be implemented with proper thirdweb v5 transaction
      console.log("Updating resolver for name:", name, "to:", resolverAddress);
      return true;
    });
  };

  const setResolvedAddress = async (name: string, address: string) => {
    return executeWithLoading(async () => {
      // This would need to be implemented with proper thirdweb v5 transaction
      console.log("Setting address for name:", name, "to:", address);
      return true;
    });
  };

  return {
    // State
    isLoading,
    error,
    priceLoading,
    
    // Read operations
    price,
    
    // Write operations
    registerName,
    renewName,
    updateMetadata,
    updateResolver,
    setResolvedAddress,
    
    // Utilities
    clearError: () => setError(null),
  };
}; 