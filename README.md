# Kimino Signal 🌸

Kimino Signal is an interactive Web3 application that allows users to create, mint, and interact with unique 2D Anime-style Character NFTs on the **Monad Testnet**. 

Featuring a gorgeous visual-novel aesthetic, this application seamlessly bridges the gap between beautiful front-end experiences and decentralized blockchain storage, ensuring that every character you create is permanently stored on IPFS and securely minted to your Web3 wallet.

---

## 🌟 Features

- **Web3 Wallet Integration**: Seamless, beautiful wallet connections powered by RainbowKit and Wagmi.
- **Decentralized Storage**: Automated IPFS pinning for character images and metadata using Pinata.
- **Monad Testnet Minting**: Gas-efficient ERC721 NFT minting via the custom `CharacterRegistry` smart contract.
- **Dynamic Character Gallery**: Instantly fetches and displays your minted characters directly from IPFS alongside built-in presets.
- **Visual Novel Aesthetic**: Immersive UI with animated Sakura particles, dynamic modals, and responsive layouts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Tailwind CSS
- **Web3 Libraries**: 
  - `@rainbow-me/rainbowkit` (Wallet UI)
  - `wagmi` (React Hooks for Web3)
  - `viem` (Ethereum interactions)

### Backend & Storage
- **API Routes**: Next.js Serverless Routes
- **Storage**: Pinata (IPFS Gateway & Pinning)
- **Database (Local)**: Automated JSON-based hash registry (`ipfs_hashes.json`)

### Smart Contracts
- **Framework**: Hardhat
- **Language**: Solidity (^0.8.20)
- **Standards**: OpenZeppelin ERC721URIStorage
- **Network**: Monad Testnet (Chain ID: 10143)

---

## 🚀 Getting Started

### Prerequisites

You will need the following installed:
- [Node.js](https://nodejs.org/en/) (v18+)
- A [Pinata](https://pinata.cloud/) Account + API JWT (for IPFS uploads)
- A [Reown / WalletConnect](https://cloud.reown.com/) Project ID (for RainbowKit)
- A Web3 Wallet (like MetaMask) funded with Monad Testnet `MON` tokens.

### Installation

1. **Clone the repository** (or download the source):
   ```bash
   git clone https://github.com/Imcz-dotcom/kimino_signal.git
   cd kimino_signal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note: if you run into ERESOLVE errors due to React 19 / Wagmi, append `--legacy-peer-deps`)*

3. **Configure Environment Variables**:
   Create a `.env` file in the root of the project and add the following keys:
   ```env
   # Deployer Private Key for Hardhat (if you plan to modify contracts)
   MONAD_PRIVATE_KEY="your_wallet_private_key"

   # Pinata API JWT with 'Admin' Scopes (Required for minting)
   PINATA_JWT="your_pinata_jwt_here"

   # WalletConnect Project ID for RainbowKit
   NEXT_PUBLIC_REOWN_PROJECT_ID="your_reown_project_id"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📜 Smart Contract Architecture

The core of the application relies on the `CharacterRegistry.sol` contract deployed on the Monad Testnet.

- **Contract Address**: `0x6d10A01197564EcBCF826F292E0995c8476EBC64`
- **Standard**: ERC721

When a user mints a character via the UI:
1. The frontend securely uploads the image to IPFS via Pinata.
2. A structured JSON Metadata file (containing the description and image HTTP gateway link) is uploaded to IPFS.
3. The user signs a MetaMask transaction to call the `registerCharacter` function on the smart contract, binding the IPFS URI to their new Token ID.

---

## 📁 Key Project Structure

```text
kimino_signal/
├── app/
│   ├── api/
│   │   ├── characters/route.ts  # Serves the minted IPFS hashes to the frontend
│   │   └── pinata/route.ts      # Handles server-side IPFS pinning to bypass CORS
│   ├── components/              # UI Components (CharacterModal, Navigation, ConnectButton)
│   ├── scene1/                  # Visual Novel gameplay screens
│   ├── layout.tsx               # Root layout containing RainbowKit Providers
│   └── page.tsx                 # Landing Page Title Screen
├── smart_contracts/             # Solidity source code
├── lib/                         # Utility functions & Web3 Fetchers
├── public/                      # Static assets and preset character images
└── ipfs_hashes.json             # Local registry of newly minted IPFS characters
```

---

## 📝 License

This project is created for educational and experimental purposes. All custom assets and code belong to their respective owners.
