# Somnia Name Service Frontend

A comprehensive web interface for the Somnia Name Service, built with Next.js and Thirdweb.

## Features

### 🏷️ **Register Tab**
- Register new names on the Somnia blockchain
- Set optional metadata for each name
- Pay registration fees in ETH

### 📋 **My Names Tab**
- View all names owned by your connected wallet
- Renew expired names
- Transfer names to other addresses
- Update name metadata

### 🔍 **Search Tab**
- Search for existing names
- View name details including owner, expiry, and metadata
- Check if names are available for registration

### 🔗 **Resolver Tab**
- Set address resolution for names
- Link names to wallet addresses
- View current address mappings

### ⚙️ **Admin Tab**
- Set registration prices (admin only)
- Withdraw contract funds (admin only)
- Manage contract parameters

## Setup

### Prerequisites
- Node.js 18+ 
- Yarn or npm
- Deployed SomRegistry and SomResolver contracts

### Installation

1. **Clone and install dependencies:**
```bash
cd somnia-name_frontend
yarn install
```

2. **Configure environment variables:**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your-thirdweb-client-id
NEXT_PUBLIC_REGISTRY_ADDRESS=your-deployed-registry-address
NEXT_PUBLIC_RESOLVER_ADDRESS=your-deployed-resolver-address
```

3. **Update contract addresses:**
Edit `src/config/contracts.ts` and replace the placeholder addresses with your deployed contract addresses.

### Development

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
yarn build
yarn start
```

## Contract Integration

The frontend integrates with two main smart contracts:

### SomRegistry Contract
- **Register**: Create new name registrations
- **Renew**: Extend name expiration
- **Transfer**: Transfer name ownership
- **Set Metadata**: Update name metadata
- **Admin Functions**: Set prices and withdraw funds

### SomResolver Contract
- **Set Address**: Link names to wallet addresses
- **Get Address**: Resolve names to addresses

## Architecture

```
src/
├── app/                    # Next.js app directory
│   └── page.tsx           # Main page with tabbed interface
├── components/             # React components
│   ├── TabbedInterface.tsx # Main tabbed interface
│   └── NameCard.tsx       # Reusable name display component
├── hooks/                  # Custom React hooks
│   └── useNames.ts        # Hook for name management
├── lib/                    # Third-party library configs
│   └── thirdwebClient.ts  # Thirdweb client configuration
└── config/                 # Configuration files
    └── contracts.ts       # Contract addresses and ABIs
```

## Usage

1. **Connect Wallet**: Use the ConnectButton to connect your wallet
2. **Register Names**: Go to the Register tab to create new names
3. **Manage Names**: Use the My Names tab to view and manage your names
4. **Search Names**: Use the Search tab to look up existing names
5. **Set Resolutions**: Use the Resolver tab to link names to addresses
6. **Admin Functions**: Use the Admin tab for administrative tasks

## Styling

The interface uses Tailwind CSS for styling with a modern, responsive design featuring:
- Gradient backgrounds
- Card-based layouts
- Hover effects and transitions
- Mobile-responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
