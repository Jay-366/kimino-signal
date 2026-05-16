import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Bypass local TLS certificate verification errors during development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function GET() {
  const hashesFilePath = path.join(process.cwd(), "ipfs_hashes.json");
  try {
    const fileData = await fs.readFile(hashesFilePath, "utf8");
    const savedHashes = JSON.parse(fileData);
    
    const populatedCharacters = [];
    for (const hashObj of savedHashes) {
      try {
        const gatewayUrl = hashObj.uri.replace("ipfs://", "https://ipfs.io/ipfs/");
        const ipfsRes = await fetch(gatewayUrl);
        if (ipfsRes.ok) {
          const metadata = await ipfsRes.json();
          
          const finalCharacter = {
            id: hashObj.id,
            name: metadata.name,
            url: metadata.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/") // We still return the pinata gateway for frontend image rendering
          };
          
          console.log(`\n✅ SUCCESSFULLY FETCHED FROM IPFS!`);
          console.log(`- Character ID: ${finalCharacter.id}`);
          console.log(`- Display Name: ${finalCharacter.name}`);
          console.log(`- Original IPFS Metadata Hash: ${hashObj.uri}`);
          console.log(`- Image URL: ${finalCharacter.url}\n`);

          populatedCharacters.push(finalCharacter);
        }
      } catch (err) {
        console.error("Failed to fetch from IPFS server-side", err);
      }
    }
    
    return NextResponse.json(populatedCharacters);
  } catch (e) {
    return NextResponse.json([]); // Return empty array if file doesn't exist yet
  }
}
