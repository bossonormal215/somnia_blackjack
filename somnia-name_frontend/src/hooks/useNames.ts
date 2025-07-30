import { useState, useEffect } from 'react';
import {
  useActiveAccount,
  useSendTransaction,
  useReadContract,
} from 'thirdweb/react';
import { getContract, prepareContractCall, readContract } from 'thirdweb';
import {
  somRegistryAddress,
  somRegistryABI,
  somResolverAddress,
} from '@/utils/contract';
import { client } from '@/lib/thirdwebClient';
import { somniaTestnet } from 'thirdweb/chains';
import showNotification from '@/components/Notification';

interface NameRecord {
  name: string;
  owner: string;
  expires: string;
  metadata: string;
}

export function useNames() {
  const account = useActiveAccount();
  const address = account?.address;
  const [names, setNames] = useState<NameRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the contract instance
  const registryContract = getContract({
    address: somRegistryAddress,
    abi: somRegistryABI,
    chain: somniaTestnet,
    client,
  });

  // Fetch the real price from the contract
  const { data: contractPrice, isLoading: priceLoading } = useReadContract({
    contract: registryContract,
    method: 'price',
  });

  // Fetch names owned by the connected user
  const {
    data: myNames,
    isLoading: myNamesLoading,
    refetch: refetchMyNames,
  } = useReadContract({
    contract: registryContract,
    method: 'getNamesOfOwner',
    params: address
      ? ([address] as const)
      : ((() => Promise<readonly [string]>) as any),
    queryOptions: { enabled: !!address },
  });

  // Remove nameDetailsQueries and useReadContract calls inside the loop
  const [myNameRecords, setMyNameRecords] = useState<NameRecord[]>([]);

  // Fetch function for my names
  const fetchMyNameRecords = async () => {
    if (!myNames || !Array.isArray(myNames) || !address) {
      setMyNameRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const records: NameRecord[] = await Promise.all(
      myNames.map(async (name: string) => {
        const [owner, expires, metadata] = await Promise.all([
          readContract({
            contract: registryContract,
            method: 'ownerOf',
            params: [name],
          }),
          readContract({
            contract: registryContract,
            method: 'expiresAt',
            params: [name],
          }),
          readContract({
            contract: registryContract,
            method: 'metadataOf',
            params: [name],
          }),
        ]);
        return {
          name,
          owner,
          expires: expires?.toString() || '0',
          metadata: metadata || '',
        };
      })
    );
    setMyNameRecords(records);
    setLoading(false);
  };

  // Only fetch on initial mount
  useEffect(() => {
    fetchMyNameRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose refresh function
  const refreshMyNames = fetchMyNameRecords;

  // Register a new name
  const { mutate: sendRegister, isPending: isRegistering } =
    useSendTransaction();

  const registerName = async (name: string, metadata: string = '') => {
    try {
      setLoading(true);
      const tx = prepareContractCall({
        contract: registryContract,
        method: 'register',
        params: [name, somResolverAddress, metadata],
        value: contractPrice ? BigInt(contractPrice.toString()) : BigInt(1),
      });
      sendRegister(tx as any, {
        onSuccess: () => {
          setLoading(false);
          refetchMyNames();
        },
        onError: (error) => {
          setLoading(false);
          console.log(error);
          const message =
            (error as any)?.reason || error?.message || 'Unknown error';
          showNotification({
            type: 'error',
            message: `Registration failed: ${message}`,
            isVisible: true,
            onClose: () => {},
          });
          console.error('Registration failed:', error);
        },
      });
      // Don't setLoading(false) here, handled in callbacks
      return true;
    } catch (error: any) {
      setLoading(false);
      const message = error?.reason || error?.message || 'Unknown error';
      showNotification({
        type: 'error',
        message: `Registration failed: ${message}`,
        isVisible: true,
        onClose: () => {},
      });
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Renew a name
  const renewName = async (name: string) => {
    try {
      console.log('Renewing name:', name);
      // ...actual renewal logic here...
      return true;
    } catch (error: any) {
      const message = error?.reason || error?.message || 'Unknown error';
      showNotification({
        type: 'error',
        message: `Renewal failed: ${message}`,
        isVisible: true,
        onClose: () => {},
      });
      console.error('Renewal failed:', error);
      throw error;
    }
  };

  // Transfer a name
  const transferName = async (name: string, newOwner: string) => {
    try {
      console.log('Transferring name:', name, 'to:', newOwner);
      // ...actual transfer logic here...
      return true;
    } catch (error: any) {
      const message = error?.reason || error?.message || 'Unknown error';
      showNotification({
        type: 'error',
        message: `Transfer failed: ${message}`,
        isVisible: true,
        onClose: () => {},
      });
      console.error('Transfer failed:', error);
      throw error;
    }
  };

  // Update metadata
  const updateMetadata = async (name: string, metadata: string) => {
    try {
      console.log('Updating metadata for name:', name, 'to:', metadata);
      // ...actual update logic here...
      return true;
    } catch (error: any) {
      const message = error?.reason || error?.message || 'Unknown error';
      showNotification({
        type: 'error',
        message: `Metadata update failed: ${message}`,
        isVisible: true,
        onClose: () => {},
      });
      console.error('Metadata update failed:', error);
      throw error;
    }
  };

  // Set address in resolver
  const setResolverAddress = async (name: string, addr: string) => {
    try {
      console.log('Setting address for name:', name, 'to:', addr);
      // ...actual set address logic here...
      return true;
    } catch (error: any) {
      const message = error?.reason || error?.message || 'Unknown error';
      showNotification({
        type: 'error',
        message: `Setting address failed: ${message}`,
        isVisible: true,
        onClose: () => {},
      });
      console.error('Setting address failed:', error);
      throw error;
    }
  };

  // Get address from resolver
  const getResolverAddress = async (name: string): Promise<string | null> => {
    try {
      console.log('Getting address for name:', name);
      return null;
    } catch (error) {
      console.error('Getting address failed:', error);
      return null;
    }
  };

  // Helper to format timestamp to date string
  function formatTimestampToDate(ts: string | number | bigint): string {
    if (!ts) return '';
    let n: number;
    if (typeof ts === 'bigint') {
      n = Number(ts);
    } else if (typeof ts === 'string') {
      n = parseInt(ts);
    } else {
      n = ts;
    }
    if (isNaN(n) || n === 0) return '';
    const date = new Date(n * 1000); // seconds to ms
    return date.toLocaleString();
  }

  // Get name details
  const getNameDetails = async (name: string): Promise<NameRecord | null> => {
    try {
      // Fetch details from the contract
      const [owner, expires, metadata] = await Promise.all([
        readContract({
          contract: registryContract,
          method: 'ownerOf',
          params: [name],
        }),
        readContract({
          contract: registryContract,
          method: 'expiresAt',
          params: [name],
        }),
        readContract({
          contract: registryContract,
          method: 'metadataOf',
          params: [name],
        }),
      ]);
      return {
        name,
        owner: owner || '',
        expires: formatTimestampToDate(expires),
        metadata: metadata || '',
      };
    } catch (error: any) {
      const message = error?.reason || error?.message || 'Unknown error';
      showNotification({
        type: 'error',
        message: `Error getting name details: ${message}`,
        isVisible: true,
        onClose: () => {},
      });
      console.error('Error getting name details:', error);
      return null;
    }
  };

  return {
    names,
    loading: loading || priceLoading || myNamesLoading,
    price: contractPrice ? contractPrice.toString() : '...',
    address,
    registerName,
    isRegistering,
    renewName,
    transferName,
    updateMetadata,
    setResolverAddress,
    getResolverAddress,
    getNameDetails,
    myNames: myNameRecords,
    myNamesLoading: loading,
    refreshMyNames,
  };
}
