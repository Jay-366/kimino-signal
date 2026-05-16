import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const characterId = formData.get("characterId") as string;
    const displayName = formData.get("displayName") as string;
    const isPublic = formData.get("isPublic") as string;
    const personalityPrompt = formData.get("personalityPrompt") as string;

    if (!file || !displayName) {
      return NextResponse.json({ error: "Missing file or name" }, { status: 400 });
    }

    const pinataJWT = process.env.PINATA_JWT;
    if (!pinataJWT) {
      return NextResponse.json({ error: "Pinata JWT not configured in .env" }, { status: 500 });
    }

    // 1. Upload Image to Pinata
    const imageFormData = new FormData();
    imageFormData.append("file", file);
    
    // Add custom metadata to Pinata dashboard for organization
    const pinataOptions = JSON.stringify({ cidVersion: 1 });
    imageFormData.append("pinataOptions", pinataOptions);
    const pinataMetadata = JSON.stringify({ name: `Avatar-${displayName}` });
    imageFormData.append("pinataMetadata", pinataMetadata);

    console.log("Uploading image to IPFS...");
    const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: imageFormData,
    });

    if (!imageRes.ok) {
      throw new Error(`Failed to upload image: ${await imageRes.text()}`);
    }

    const imageData = await imageRes.json();
    const imageGatewayUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

    // 2. Construct ERC721 Metadata JSON
    const metadata = {
      name: displayName,
      description: personalityPrompt,
      image: imageGatewayUrl, // Use a direct HTTP gateway link instead of ipfs:// to force MetaMask to load it instantly
      attributes: [
        { trait_type: "Internal ID", value: characterId },
        { trait_type: "Publicly Shared", value: isPublic }
      ]
    };

    // 3. Upload JSON to Pinata
    console.log("Uploading metadata JSON to IPFS...");
    const jsonRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pinataJWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `Metadata-${displayName}.json`
        }
      }),
    });

    if (!jsonRes.ok) {
      throw new Error(`Failed to upload metadata: ${await jsonRes.text()}`);
    }

    const jsonData = await jsonRes.json();
    const metadataIpfsUri = `ipfs://${jsonData.IpfsHash}`;

    // AUTOMATION: Save the hash to a local text/JSON file
    const fs = await import("fs/promises");
    const path = await import("path");
    const hashesFilePath = path.join(process.cwd(), "ipfs_hashes.json");
    let savedHashes = [];
    try {
      const fileData = await fs.readFile(hashesFilePath, "utf8");
      savedHashes = JSON.parse(fileData);
    } catch (e) {
      // File doesn't exist yet, that's fine
    }
    
    savedHashes.push({
      id: characterId,
      uri: metadataIpfsUri,
      timestamp: Date.now()
    });
    
    await fs.writeFile(hashesFilePath, JSON.stringify(savedHashes, null, 2));

    return NextResponse.json({ success: true, ipfsUri: metadataIpfsUri });
  } catch (error: any) {
    console.error("Pinata upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
