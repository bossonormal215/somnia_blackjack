# Somnia Blackjack Game

A decentralized Blackjack game built for the Somnia blockchain using onchain randomness instead of Pyth Entropy.

## Overview

This project consists of two main components:
1. **Smart Contract** (`somnia-blackjack.sol`) - A Solidity contract that implements the Blackjack game logic with onchain randomness
2. **Frontend** (`blackjack/page.tsx`) - A Next.js page using Thirdweb for wallet integration and contract interaction

## Key Differences from Original

The original Blackjack3 contract used Pyth Network's Entropy for randomness, which isn't available on Somnia yet. Our version:

- **Removes Pyth Entropy dependencies** - No more `IEntropy` and `IEntropyConsumer` interfaces
- **Uses onchain randomness** - Combines `block.prevrandao`, `block.timestamp`, `block.number`, player address, and nonce
- **Immediate execution** - No callback system needed, cards are dealt instantly
- **Lower minimum bet** - Reduced from 1 ETH to 0.1 SOM for better accessibility
- **Zero fees** - No entropy fees since we use onchain randomness

## Smart Contract Features

- **Game Logic**: Complete Blackjack implementation with proper card values and scoring
- **Chip System**: Players earn chips for playing, with daily limits and bonuses
- **Leaderboard**: Track player statistics and top performers
- **House Edge**: 10% bonus payout for wins, standard house revenue model
- **Security**: Uses multiple entropy sources for randomness generation

## Frontend Features

- **Thirdweb Integration**: Modern wallet connection with multiple wallet support
- **Real-time Updates**: Automatic game state fetching and updates
- **Responsive Design**: Mobile-friendly interface with beautiful card animations
- **Error Handling**: Comprehensive error messages and transaction status tracking
- **Visual Cards**: CSS-based playing cards with proper suits and colors

## Deployment Instructions

### 1. Deploy the Smart Contract

```bash
cd somnia-naming-contracts
npm install
npx hardhat run scripts/deploy-blackjack.js --network somnia-testnet
```

### 2. Update Frontend Configuration

After deployment, update the contract address in `somnia-name_frontend/src/lib/contracts.ts`:

```typescript
export const CONTRACTS = {
  // ... other contracts
  SOMNIA_BLACKJACK: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
} as const;
```

### 3. Run the Frontend

```bash
cd somnia-name_frontend
npm install
npm run dev
```

Visit `http://localhost:3000/blackjack` to play the game!

## Game Rules

1. **Starting**: Pay 0.1 SOM to start a game and receive 2 cards
2. **Objective**: Get as close to 21 as possible without going over
3. **Card Values**: Number cards = face value, Face cards = 10, Ace = 11
4. **Actions**: Draw additional cards or stay with current hand
5. **Winning**: Beat the house by getting 21 (Blackjack) or having the dealer bust
6. **Rewards**: Win 1.1x your bet + bonus chips for playing

## Technical Architecture

### Randomness Generation

The contract uses a combination of onchain sources for randomness:

```solidity
function _generateRandomNumber(address player, uint256 nonce) internal view returns (uint256) {
    return uint256(keccak256(abi.encodePacked(
        block.prevrandao,  // Ethereum 2.0 randomness beacon
        block.timestamp,   // Block timestamp
        block.number,      // Block number
        player,            // Player address
        nonce              // Per-player nonce
    )));
}
```

### Frontend Architecture

- **Thirdweb**: Handles wallet connections and contract interactions
- **React Hooks**: Manages state and real-time updates
- **Tailwind CSS**: Responsive styling and animations
- **Contract Reads**: Automatic fetching of game state and player chips
- **Transaction Handling**: Robust error handling and user feedback

## Security Considerations

- **Randomness**: While not as secure as VRF, the combination of multiple onchain sources provides reasonable randomness for a game
- **Reentrancy**: Contract uses proper state updates before external calls
- **Access Control**: Owner-only functions for revenue withdrawal
- **Input Validation**: Proper bet limits and game state checks

## Future Improvements

- [ ] Integrate Pyth Entropy when available on Somnia
- [ ] Add multiplayer functionality
- [ ] Implement NFT rewards system
- [ ] Add more card games (Poker, Baccarat)
- [ ] Enhanced analytics and statistics

## File Structure

```
somnia-naming-contracts/
├── contracts/
│   └── somnia-blackjack.sol       # Main game contract
└── scripts/
    └── deploy-blackjack.js        # Deployment script

somnia-name_frontend/
├── src/
│   ├── app/
│   │   └── blackjack/
│   │       └── page.tsx           # Game interface
│   └── lib/
│       ├── contracts.ts           # Contract addresses
│       └── thirdwebClient.ts      # Thirdweb configuration
```

## Support

For issues or questions:
1. Check that your wallet is connected to Somnia testnet
2. Ensure you have sufficient SOM for transactions
3. Verify the contract address is correctly set in the frontend
4. Check browser console for detailed error messages

Built with ❤️ for the Somnia ecosystem! 