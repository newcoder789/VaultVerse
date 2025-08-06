import { useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as dip721Idl } from "../../../declarations/dip721_nft_container/dip721_nft_container.did.js"; // Import DIP-721 interface 
import "./hero.css";
import { useAuth } from "@nfid/identitykit/react"


export default function NFTMinter({ userPrincipal }) {
    const [toPrincipal, setToPrincipal] = useState(userPrincipal || "");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [rarity, setRarity] = useState("Common");
    const [type, setType] = useState("Human");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
        
    
    const { connect, disconnect, isConnecting, user } = useAuth()

    const handleMint = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
                        
            // Validate inputs
            if (!toPrincipal || !name || !image ) {
                throw new Error("All fields are required");
            }
            // const toPrincipal = Principal.fromText(toPrincipal);
            if (!isConnecting && user?.principal){
                const userPrincipal = user.principal;
                // Configure agent
                const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });
                await agent.fetchRootKey().catch((err) => {
                    console.warn("Unable to fetch root key:", err);
                });

                // Initialize actor
                const nftActor = Actor.createActor(dip721Idl, {
                    agent,
                    canisterId: "uzt4z-lp777-77774-qaabq-cai",
                });

                // Prepare properties
                const properties = [
                    { key: "name", value: { TextContent: name } },
                    { key: "image", value: { TextContent: image } },
                    { key: "Rarity", value: { TextContent: rarity } },
                    { key: "Type", value: { TextContent: type } },
                ];
                console.log("Minting properties:", userPrincipal);
                // Call mint
                const result = await nftActor.mint(userPrincipal, properties);
                console.log("Mint result:", result);

                if ("Ok" in result) {
                    setResult(`NFT minted successfully! Transaction ID: ${result.Ok}`);
                } else {
                    setError(`Mint failed: ${JSON.stringify(result.Err)}`);
                }
            }
        } catch (err) {
            console.error("Mint error:", err);
            setError(err.message || "Failed to mint NFT");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nft-minter">
            <h2>Mint a New NFT</h2>
            <form onSubmit={handleMint}>
                <div>
                    <label>Recipient Principal:</label>
                    <input
                        type="text"
                        value={toPrincipal}
                        onChange={(e) => setToPrincipal(e.target.value)}
                        placeholder="e.g., wyhxy-a475w-..."
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Test NFT"
                        required
                    />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="e.g., https://example.com/nft.png"
                        required
                    />
                </div>
                <div>
                    <label>Rarity:</label>
                    <select value={rarity} onChange={(e) => setRarity(e.target.value)}>
                        <option value="Common">Common</option>
                        <option value="Rare">Rare</option>
                        <option value="Legendary">Legendary</option>
                    </select>
                </div>
                <div>
                    <label>Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Human">Human</option>
                        <option value="Alien">Alien</option>
                        <option value="Robot">Robot</option>
                    </select>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Minting..." : "Mint NFT"}
                </button>
            </form>
            {result && <p className="success">{result}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
}