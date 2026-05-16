"use client";
import React, { useState, useRef, useEffect } from "react";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentCharacterUrl: string;
};

const PRESET_CHARACTERS = [
  { id: "ayano", name: "Ayano", url: "/partner.png" },
  { id: "lebron", name: "LeBron James", url: "/lebron_custom.png" },
];

type MintStatus = "idle" | "uploading_image" | "uploading_metadata" | "awaiting_signature" | "minting" | "success";

export const CharacterModal = ({ isOpen, onClose, onSelect, currentCharacterUrl }: CharacterModalProps) => {
  const [characterImage, setCharacterImage] = useState<File | string | null>(currentCharacterUrl);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const charInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [characterId, setCharacterId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [personalityPrompt, setPersonalityPrompt] = useState("");

  // Loading State
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<MintStatus>("idle");
  const [dynamicCharacters, setDynamicCharacters] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    
    // 1. Fetch the completely populated IPFS characters from our local API route
    fetch("/api/characters")
      .then(res => res.json())
      .then(fetchedChars => {
        setDynamicCharacters(fetchedChars);
      })
      .catch(console.error);
  }, [isOpen]);

  if (!isOpen) return null;

  const ALL_CHARACTERS = [...PRESET_CHARACTERS, ...dynamicCharacters];

  const handleConfirm = () => {
    let charUrl = currentCharacterUrl;
    if (characterImage instanceof File) {
      charUrl = URL.createObjectURL(characterImage);
    } else if (typeof characterImage === "string") {
      charUrl = characterImage;
    }
    onSelect(charUrl);
    onClose();
  };

  const handleWeb3Mint = async () => {
    if (!(characterImage instanceof File)) return;
    
    setIsMinting(true);
    
    try {
      // Phase 1, 2 & 3: Real Pinata IPFS Upload Pipeline
      setMintStatus("uploading_image");
      
      const formData = new FormData();
      formData.append("file", characterImage);
      formData.append("characterId", characterId);
      formData.append("displayName", displayName);
      formData.append("isPublic", isPublic.toString());
      formData.append("personalityPrompt", personalityPrompt);

      const uploadRes = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Failed to upload to IPFS");
      }

      setMintStatus("uploading_metadata"); // Visually transition for UX
      const uploadData = await uploadRes.json();
      const realIpfsUri = uploadData.ipfsUri;

      // Phase 4: Smart Contract Execution
      setMintStatus("awaiting_signature");
      
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or a Web3 wallet");
      }

      // Import ethers dynamically to prevent SSR issues
      const { BrowserProvider, Contract } = await import("ethers");
      const provider = new BrowserProvider(window.ethereum as any);
      
      // Force MetaMask to let you choose which account to connect
      await provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);
      
      // Request account access after permission is granted
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];

      // Switch to Monad Testnet (Chain ID 10143 is 0x279f in hex)
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: "0x279f" }]);
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await provider.send("wallet_addEthereumChain", [{
            chainId: "0x279f",
            chainName: "Monad Testnet",
            nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
            rpcUrls: ["https://testnet-rpc.monad.xyz"],
            blockExplorerUrls: ["https://testnet.monadscan.com/"]
          }]);
        } else {
          throw switchError;
        }
      }

      const signer = await provider.getSigner();
      
      // ABI for registerCharacter
      const abi = [
        "function registerCharacter(address to, string memory ipfsURI) public"
      ];
      const contract = new Contract("0x206B6bD31afc7C0f35298DA9D7dBF61944b67159", abi, signer);

      // Trigger wallet popup
      const tx = await contract.registerCharacter(userAddress, realIpfsUri);
      
      setMintStatus("minting");
      
      // Wait for blockchain confirmation
      await tx.wait();
      
      setMintStatus("success");
      
      // Select the newly minted character for preview
      const charUrl = URL.createObjectURL(characterImage);
      onSelect(charUrl);
      setShowUploadModal(false);
      onClose();
    } catch (error: any) {
      console.error("Minting failed", error);
      alert("Minting failed: " + (error?.info?.error?.message || error.message || "Unknown error"));
    } finally {
      setIsMinting(false);
      setMintStatus("idle");
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto p-4">
      <div 
        className="bg-[#fdfaf6] rounded-[2rem] p-6 md:p-8 max-w-xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-pink-200/50 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(244, 114, 182, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(244, 114, 182, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        <div className="text-center mb-2">
          <h2 className="text-3xl font-extrabold text-slate-700 mb-2 tracking-wide" style={{ fontFamily: '"Nunito", sans-serif' }}>Select Partner</h2>
          <p className="text-slate-500 font-medium">Choose your companion for this journey</p>
        </div>

        <div className="space-y-4">
          {/* Presets & IPFS Characters */}
          <div className="grid grid-cols-2 gap-4">
            {ALL_CHARACTERS.map((char) => (
              <div 
                key={char.id}
                onClick={() => setCharacterImage(char.url)}
                className={`
                  relative rounded-xl overflow-hidden cursor-pointer border-4 transition-all bg-white
                  ${characterImage === char.url ? 'border-pink-500 scale-105 shadow-lg' : 'border-transparent hover:scale-105 hover:shadow'}
                `}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={char.url} alt={char.name} className="w-full h-32 object-contain p-2" />
                <div className="absolute bottom-0 w-full bg-black/50 backdrop-blur-sm text-white text-xs p-1 text-center font-medium">
                  {char.name}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-slate-400 text-xs font-bold tracking-widest my-4">- OR MINT CUSTOM NFT -</div>

          {/* Open Upload Modal Button */}
          <div 
            onClick={() => setShowUploadModal(true)}
            className={`border-2 border-dashed transition-colors rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center
              ${characterImage instanceof File ? 'border-pink-500 bg-pink-50' : 'border-pink-300 hover:border-pink-500 hover:bg-pink-50/50'}`}
          >
            {characterImage instanceof File ? (
              <div className="text-pink-600 font-medium">Selected: {characterImage.name}</div>
            ) : (
              <div className="text-pink-500 font-bold uppercase tracking-wide">
                + Create Web3 Character
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 px-6 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl font-bold text-lg transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-1 py-3 px-6 bg-pink-400 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(244,114,182,0.4)] rounded-2xl font-bold text-lg transition-all hover:scale-105"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Nested Web3 Minting Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-slate-700 mb-1" style={{ fontFamily: '"Nunito", sans-serif' }}>Mint Web3 Character</h3>
              <p className="text-slate-500 text-sm">Register your character as an immutable NFT</p>
            </div>
            
            {/* Form Fields */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Character ID</label>
                <input 
                  type="text" 
                  value={characterId}
                  onChange={(e) => setCharacterId(e.target.value)}
                  disabled={isMinting}
                  placeholder="e.g. MY_CHAR_01" 
                  className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-pink-400 outline-none disabled:bg-slate-50 disabled:text-slate-400" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isMinting}
                  placeholder="e.g. Alice" 
                  className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-pink-400 outline-none disabled:bg-slate-50 disabled:text-slate-400" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Personality Prompt</label>
                <textarea 
                  value={personalityPrompt}
                  onChange={(e) => setPersonalityPrompt(e.target.value)}
                  disabled={isMinting}
                  placeholder="Describe their personality..." 
                  rows={3} 
                  className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-pink-400 outline-none resize-none disabled:bg-slate-50 disabled:text-slate-400"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isPublic" 
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={isMinting}
                  className="w-4 h-4 text-pink-500 rounded focus:ring-pink-400 disabled:opacity-50" 
                />
                <label htmlFor="isPublic" className="text-sm font-bold text-slate-600">Share Character Publicly</label>
              </div>
            </div>

            {/* Avatar Upload */}
            <div 
              onClick={() => { if (!isMinting) charInputRef.current?.click(); }}
              className={`border-2 border-dashed transition-colors rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center min-h-[120px] ${isMinting ? 'border-slate-300 opacity-50 cursor-not-allowed' : 'border-pink-300 hover:border-pink-500 hover:bg-pink-50/50 group'}`}
            >
              <input 
                type="file" 
                ref={charInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCharacterImage(e.target.files[0]);
                  }
                }}
                disabled={isMinting}
              />
              {characterImage instanceof File ? (
                <div className="text-pink-600 font-medium">Avatar: {characterImage.name}</div>
              ) : (
                <div className="text-slate-500 text-sm group-hover:scale-105 transition-transform">
                  <span className="text-pink-500 font-bold block text-lg mb-1">Upload Avatar</span>
                  Drag and drop PNG/JPG
                </div>
              )}
            </div>

            {/* Status & Actions */}
            {isMinting && (
              <div className="text-center p-3 bg-pink-50 text-pink-600 rounded-xl font-bold animate-pulse text-sm">
                {mintStatus === 'uploading_image' && "📦 Uploading image to IPFS..."}
                {mintStatus === 'uploading_metadata' && "📝 Pinning metadata JSON..."}
                {mintStatus === 'awaiting_signature' && "🦊 Please sign transaction in wallet..."}
                {mintStatus === 'minting' && "⛓️ Minting NFT on Monad Testnet..."}
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <button 
                onClick={() => setShowUploadModal(false)}
                disabled={isMinting}
                className={`flex-1 py-3 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all ${isMinting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-200'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleWeb3Mint}
                disabled={isMinting || !(characterImage instanceof File) || !displayName || !characterId}
                className={`flex-1 py-3 px-6 text-white rounded-2xl font-bold transition-all ${isMinting || !(characterImage instanceof File) || !displayName || !characterId ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 shadow-[0_0_15px_rgba(244,114,182,0.4)]'}`}
              >
                {isMinting ? "Processing..." : "Register NFT"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
