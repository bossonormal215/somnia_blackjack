export const CONTRACTS = {
  SOM_REGISTRY: '0xe714dafc76afb50ceabb34e0803f29b1e49b554b',
  SOM_RESOLVER: '0xec637c3037809e76a37097c04f5020e027389a53',
  // SOMNIA_BLACKJACK: '0x6df617f4596f57a2d4be33ee63cac4b72fae6894',
  // SOMNIA_BLACKJACK: '0x4a4fa63d7e00462e38a396dda61ba4c674179d28', // game.isAlive = false; when player has blackjack
  SOMNIA_BLACKJACK: '0xf37455e895e4832d4bb6c7d5e0ce36a6d4739950', // Fixed: game.isAlive = false when player has blackjack
  // Old buggy contract: '0x6df617f4596f57a2d4be33ee63cac4b72fae6894',
} as const;

export const NETWORKS = {
  SOMNIA_TESTNET: {
    chainId: 'somnia-testnet',
    chainName: 'Somnia Testnet',
    nativeCurrency: {
      name: 'SOM',
      symbol: 'SOM',
      decimals: 18,
    },
    rpcUrls: ['https://testnet.somnia.zone'],
    blockExplorerUrls: ['https://somnia.w3us.site'],
  },
} as const;

export const BLACKJACK_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'card',
        type: 'uint8',
      },
    ],
    name: 'CardDrawn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ChipsSpent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'ChipsTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'GameStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'NFTMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RevenueWithdrawn',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BLACKJACK_CHIP_BOOST',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'CHIP_REWARD',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_BET',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_CARDS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_DAILY_CHIPS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_BET',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'chips',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'chipsEarnedToday',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'drawCard',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'games',
    outputs: [
      {
        internalType: 'uint8',
        name: 'sum',
        type: 'uint8',
      },
      {
        internalType: 'bool',
        name: 'isAlive',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'hasBlackjack',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'betAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFee',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'getGameState',
    outputs: [
      {
        internalType: 'uint8[]',
        name: '',
        type: 'uint8[]',
      },
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'limit',
        type: 'uint256',
      },
    ],
    name: 'getTopPlayers',
    outputs: [
      {
        internalType: 'address[]',
        name: 'top',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'scores',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'lastChipClaim',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'leaderboard',
    outputs: [
      {
        internalType: 'uint256',
        name: 'wins',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'gamesPlayed',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalChips',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'players',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resetGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'spendChips',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'transferChips',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'withdrawRevenue',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const formatEther = (value: any): string => {
  if (!value) return '0';
  return (Number(value) / 1e18).toString();
};

export const formatDate = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};

export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
