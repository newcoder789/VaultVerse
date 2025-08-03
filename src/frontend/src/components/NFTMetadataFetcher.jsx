import React, { useState, useEffect, useMemo } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/core_protocol_canister/core_protocol_canister.did.js';
import { idlFactory as dip721IdlFactory } from '../../../declarations/dip721_nft_container/dip721_nft_container.did.js';
import { useAuth, useIdentityKit } from "@nfid/identitykit/react"
import './NFTMetadataFetcher.css';
import { Principal } from '@dfinity/principal';
import {motion} from 'framer-motion';
import { useAgent } from "@nfid/identitykit/react"

const NFTMetadataFetcher = () => {
    const { connect, disconnect, isConnecting, user } = useAuth()   
    // const authenticatedAgent = useAgent()
    const { identity } = useIdentityKit();
    const [nfts, setNfts] = useState([]);
    const [actor, setActor] = useState(null);
    const [authenticatedActor, setAuthenticatedActor] = useState(null);
    const [dip721Actor, setDip721Actor] = useState(null);
    const [authenticatedDip721Actor, setAuthenticatedDip721Actor] = useState(null);
    const [authenticatedAgent, setAuthenticatedAgent] = useState(null);
    // const [canisterId, setCanisterId] = useState('uzt4z-lp777-77774-qaabq-cai');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loans, setLoans] = useState([]);
    const [loanForm, setLoanForm] = useState({ tokenId: '', amount: '', interestRate: '', duration: '' });
    const [focusedTokenId, setFocusedTokenId] = useState(null);
    const canisterId = 'uzt4z-lp777-77774-qaabq-cai';
    const canisterPrincipal = 'u6s2n-gx777-77774-qaaba-cai';
    // const isLocal = window.location.hostname.includes('localhost');
    // const HOST = isLocal ? 'http://127.0.0.1:4943' : 'https://ic0.app';
    // const canisterPrincipal = 'u6s2n-gx777-77774-qaaba-cai'; 
    // const canisterId = 'uzt4z-lp777-77774-qaabq-cai';  // dip canister id 
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    useEffect(() => {
        const setupActors = async () => {
            if (!isConnecting && user && identity ) {
                const authenticatedAgent = new HttpAgent({ identity, host: 'http://127.0.0.1:4943' });
                setAuthenticatedAgent(authenticatedAgent)
                const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
                try {
                    // if (isLocal) {
                        await agent.fetchRootKey();
                        console.log("✅ Root key fetched for both agents");
                    // }
                } catch (err) {
                    console.warn("Unable to fetch root key");
                    console.error(err);
                }
                // Only create actors after root key is fetched (or immediately if not local)
                console.log("core-id:", canisterPrincipal, "\ndip-id:", canisterId)
                const authenticatedActor = Actor.createActor(idlFactory, {
                        agent: authenticatedAgent,
                        canisterId: canisterPrincipal,
                        host: 'http://127.0.0.1:4943/',
                    });
                const authenticatedDip721Actor = Actor.createActor(dip721IdlFactory, {
                        agent: authenticatedAgent,
                        canisterId: canisterId,
                        host: 'http://127.0.0.1:4943/',
                    });
                  
                const actor = Actor.createActor(idlFactory, {
                    agent,
                    canisterId: canisterPrincipal,
                    host: 'http://127.0.0.1:4943/',
                });
                const dip721Actor = Actor.createActor(dip721IdlFactory, {
                    agent,
                    canisterId: canisterId,
                    host: 'http://127.0.0.1:4943/',
                });
                // const authenticatedDip721Actor = Actor.createActor(dip721IdlFactory, {
                //     agent: authenticatedAgent,
                //     canisterId: canisterId,
                // });
                setAuthenticatedActor(authenticatedActor);
                setActor(actor);
                setDip721Actor(dip721Actor);
                setAuthenticatedDip721Actor(authenticatedDip721Actor);
                console.log("Actors created after root key fetch");
                console.log("User principal:", user.principal);
            }
        };
        setupActors();
    }, [user, user?.principal, isConnecting, identity]);
    useEffect(() => {
        if (user && actor && dip721Actor) {
            fetchNFTs();
        }
    }, [user, actor, dip721Actor]);
    const fetchNFTs = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            if (!isConnecting && user?.principal ) {
                const userPrincipal = user.principal;
                const tokenIdsResult = await dip721Actor.ownerTokenIds(userPrincipal);
                console.log("Token IDs result:", tokenIdsResult);
                if ('Ok' in tokenIdsResult) {
                    const tokenIds = tokenIdsResult.Ok;
                    const nftData = [];
                    for (const tokenId of tokenIds) {
                        const metadataResult = await actor.getDip721Metadata(Principal.fromText(canisterId), BigInt(tokenId));
                        console.log(`Metadata result for token ${tokenId}:`, metadataResult);
                        if ('Ok' in metadataResult) {
                            const metadata = metadataResult.Ok;
                            const normalizedResult = await actor.normalizeMetadata(metadata);
                            nftData.push({ tokenId: Number(tokenId), metadata, normalized: normalizedResult });
                        } else {
                            console.error(`Failed to fetch metadata for token ${tokenId}:`, metadataResult.Err);
                            continue;
                        }
                        }
                    console.log("NFT data fetched:", nftData);
                    setNfts(nftData);
                } else {
                    setError('Failed to fetch token IDs: ' + JSON.stringify(tokenIdsResult.Err));
                }
    
                // Fetch loans
                const loansData = await actor.getAllLoans();
                setLoans(loansData.map(([id, loan]) => ({ id, ...loan })));
            }
        } catch (err) {
            setError('Error fetching NFTs: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLoan = async (e) => {
        e.preventDefault();
        if (!authenticatedActor) {
            setError('Authenticated actor not initialized');
            return;
          }
        if(!authenticatedAgent){
            setError("authenticated agent not set");
            return;
        }
        if (!user && !actor && !authenticatedDip721Actor) {
            setError('Please connect your wallet');
            return;
        }

        setLoading(true);
        setError(null);
        try {            
            console.log("Creating loan with form data:", loanForm);
            if (!loanForm.tokenId || !loanForm.amount || !loanForm.interestRate || !loanForm.duration) {
                setError('Please fill in all fields');  
            }
            console.log("canister id and actor and agent is working before creating loan :", Principal.fromText(canisterId), authenticatedDip721Actor)  
            const result = await authenticatedDip721Actor.createLoan(
                BigInt(loanForm.tokenId),
                BigInt(loanForm.amount),
                BigInt(loanForm.interestRate),
                BigInt(loanForm.duration) * BigInt(1_000_000_000)
            );
            console.log("LOan creationg result:", result)
            
            if ('Ok' in result) {
                alert('Loan created with transaction ID: ' + result.Ok);
                setLoanForm({ tokenId: '', amount: '', interestRate: '', duration: '' });
                await fetchNFTs();
            }else if ('Err' in result) {
                console.error("Loan creation failed due to:", result.Err);
              }else {
                setError('Failed to create loan: ' + JSON.stringify(result.Err));
            }
        } catch (err) {
            setError('Error creating loan: ' + err);
            console.log("Error creating loan: ", err)
        } finally {
            setLoading(false);
        }};

    const handleAcceptLoan = async (loanId) => {
        if (!user) {
            setError('Please connect your wallet');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const result = await authenticatedActor.acceptLoan(loanId);
            if ('Ok' in result) {
                alert('Loan accepted with transaction ID: ' + result.Ok);
                await fetchNFTs();
            } else {
                setError('Failed to accept loan: ' + JSON.stringify(result.Err));
            }
        } catch (err) {
            setError('Error accepting loan: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     if (user) {
    //         fetchNFTs();
    //     }
    // }, [user]);

    const handleCardFocus = (tokenId) => {
        setFocusedTokenId(tokenId);
        setLoanForm((prev) => ({ ...prev, tokenId }));
    };

    return (
        <div className="nft-fetcher">
            <h2>NFT Lending Dashboard</h2>
            {!user ? (
                <button onClick={connect}>Connect Wallet</button>
            ) : (
                <div>
                    <button onClick={disconnect}>Disconnect</button>
                    <p>Principal: {user.principal.toText()}</p>
                </div>
            )}
            <div>
                <label>External Canister ID:</label>
                <input
                    type="text"
                    value={canisterId}
                    // onChange={(e) => setCanisterId(e.target.value)}
                    placeholder="e.g., u6def-o7777-77774-qaaeq-cai"
                />
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <h3>Your NFTs</h3>
            <div className="nft-list">
                {nfts.map((nft) => (
                    <motion.div
                        key={nft.tokenId}
                        className={`nft-card${focusedTokenId === nft.tokenId ? ' focused' : ''}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: focusedTokenId === nft.tokenId ? 1.08 : 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                            handleCardFocus(nft.tokenId)
                            console.log("Focused token ID:", nft.tokenId);}}
                        style={{
                            zIndex: focusedTokenId === nft.tokenId ? 10 : 1,
                            boxShadow: focusedTokenId === nft.tokenId ? '0 0 0 4px #e99b63, 0 8px 32px rgba(0,0,0,0.25)' : '',
                            position: focusedTokenId === nft.tokenId ? 'relative' : 'static',
                        }}
                    >

                        <h4>{nft.metadata.name}</h4>
                        <img src={nft.normalized.imageUrl} alt={nft.metadata.name} />
                        <p>ID: {nft.tokenId}</p>
                        <p>Risk Score: {nft.normalized.riskScore}</p>
                        <p>Eligible: {nft.normalized.isEligible ? 'Yes' : 'No'}</p>
                        {nft.normalized.isEligible && (
                            <form onSubmit={handleCreateLoan}>
                                <input
                                    type="hidden"
                                    name="tokenId"
                                    value={nft.tokenId}
                                    readOnly
                                />
                                <input
                                    type="number"
                                    placeholder="Loan Amount"
                                    value={loanForm.amount}
                                    onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                                    className = "text-black bg-white border border-gray-300 rounded-md p-2 mb-2 w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Interest Rate (basis points)"
                                    value={loanForm.interestRate}
                                    onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                                    className="text-black bg-white border border-gray-300 rounded-md p-2 mb-2 w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Duration (seconds)"
                                    value={loanForm.duration}
                                    onChange={(e) => setLoanForm({ ...loanForm, duration: e.target.value })}
                                    className="text-black bg-white border border-gray-300 rounded-md p-2 mb-2 w-full"
                                />
                                <button type="submit" disabled={loading}>Create Loan</button>
                            </form>
                        )}
                    </motion.div>
                ))}
            </div>
            <h3>Available Loans</h3>
            <div className="loan-list">
                {loans.map((loan) => (
                    <div key={loan.id} className="loan-card">
                        <p>Loan ID: {loan.id}</p>
                        <p>Token ID: {loan.tokenId}</p>
                        <p>Canister: {loan.nftCanisterId.toText()}</p>
                        <p>Amount: {loan.amount}</p>
                        <p>Interest Rate: {loan.interestRate / 100}%</p>
                        <p>Duration: {loan.duration / 1_000_000_000} seconds</p>
                        <p>Status: {loan.isActive ? 'Active' : loan.isRepaid ? 'Repaid' : 'Liquidated'}</p>
                        {loan.isActive && !loan.isRepaid && !loan.isLiquidated && (
                            <button onClick={() => handleAcceptLoan(loan.id)} disabled={loading}>
                                Accept Loan
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NFTMetadataFetcher;

// Add CSS for .nft-card.focused in NFTMetadataFetcher.css:
// .nft-card.focused {
//   outline: 3px solid #e99b63;
//   box-shadow: 0 0 0 4px #e99b63, 0 8px 32px rgba(0,0,0,0.25);
//   transform: scale(1.08);
//   z-index: 10;
// }