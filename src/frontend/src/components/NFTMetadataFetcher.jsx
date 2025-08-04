import React, { useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../declarations/core_protocol_canister/core_protocol_canister.did.js';
import { idlFactory as dip721IdlFactory } from '../../../declarations/dip721_nft_container/dip721_nft_container.did.js';
import { useAuth, useIdentityKit } from "@nfid/identitykit/react";
import './NFTMetadataFetcher.css';
import { Principal } from '@dfinity/principal';
import { motion } from 'framer-motion';

const NFTMetadataFetcher = () => {
    const { connect, disconnect, isConnecting, user } = useAuth();
    const { identity } = useIdentityKit();
    const [nfts, setNfts] = useState([]);
    const [actor, setActor] = useState(null);
    const [authenticatedActor, setAuthenticatedActor] = useState(null);
    const [dip721Actor, setDip721Actor] = useState(null);
    const [authenticatedDip721Actor, setAuthenticatedDip721Actor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loans, setLoans] = useState([]);
    const [loanForm, setLoanForm] = useState({ tokenId: '', amount: '', interestRate: '', duration: '' });
    const [focusedTokenId, setFocusedTokenId] = useState(null);

    const canisterId = 'uzt4z-lp777-77774-qaabq-cai';
    const canisterPrincipal = 'u6s2n-gx777-77774-qaaba-cai';
    const host = 'http://127.0.0.1:4943';
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    useEffect(() => {
        const setupActors = async () => {
            if (!isConnecting && user && identity) {
                // Create the agent instances first
                const unauthenticatedAgent = new HttpAgent({ host });
                const authenticatedAgent = new HttpAgent({ identity, host });

                try {
                    // Fetch the root key on both agents for local development
                    if (isLocal) {
                        await unauthenticatedAgent.fetchRootKey();
                        await authenticatedAgent.fetchRootKey();
                        console.log("✅ Root key fetched for both agents");
                    }
                } catch (err) {
                    console.warn("Unable to fetch root key. This is expected on the mainnet.", err);
                }

                console.log("core-id:", canisterPrincipal, "\ndip-id:", canisterId);

                // Now, create the actors using the correctly configured agents
                const coreActor = Actor.createActor(idlFactory, {
                    agent: unauthenticatedAgent,
                    canisterId: canisterPrincipal,
                });
                const authCoreActor = Actor.createActor(idlFactory, {
                    agent: authenticatedAgent,
                    canisterId: canisterPrincipal,
                });
                const dipActor = Actor.createActor(dip721IdlFactory, {
                    agent: unauthenticatedAgent,
                    canisterId: canisterId,
                });
                const authDipActor = Actor.createActor(dip721IdlFactory, {
                    agent: authenticatedAgent,
                    canisterId: canisterId,
                });

                setActor(coreActor);
                setAuthenticatedActor(authCoreActor);
                setDip721Actor(dipActor);
                setAuthenticatedDip721Actor(authDipActor);

                console.log("Actors created successfully.");
                console.log("User principal:", user.principal.toText());
            }
        };
        setupActors();
    }, [user, identity, isConnecting, isLocal]);

    useEffect(() => {
        if (user && actor && dip721Actor) {
            fetchNFTs();
        }
    }, [user, actor, dip721Actor]);

    const fetchNFTs = async () => {
        if (!user || !actor || !dip721Actor) return;
        setLoading(true);
        setError(null);
        try {
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
                    }
                }
                console.log("NFT data fetched:", nftData);
                setNfts(nftData);
            } else {
                setError('Failed to fetch token IDs: ' + JSON.stringify(tokenIdsResult.Err));
            }

            const loansData = await actor.getAllLoans();
            setLoans(loansData.map(([id, loan]) => ({ id, ...loan })));
        } catch (err) {
            setError('Error fetching NFTs: ' + err.message);
            console.error("Error fetching NFTs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLoan = async (e) => {
        e.preventDefault();
        if (!authenticatedDip721Actor) {
            setError('Authenticated actor not initialized');
            return;
        }
        if (!user) {
            setError('Please connect your wallet');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            console.log("Creating loan with form data:", loanForm);
            if (!loanForm.tokenId || !loanForm.amount || !loanForm.interestRate || !loanForm.duration) {
                setError('Please fill in all fields');
                setLoading(false);
                return;
            }

            const result = await authenticatedDip721Actor.createLoan(
                BigInt(loanForm.tokenId),
                BigInt(loanForm.amount),
                BigInt(loanForm.interestRate),
                BigInt(loanForm.duration) * BigInt(1_000_000_000)
            );
            console.log("Loan creation result:", result);
            if ('Ok' in result) {
                alert('Loan created with transaction ID: ' + result.Ok);
                setLoanForm({ tokenId: '', amount: '', interestRate: '', duration: '' });
                await fetchNFTs();
            } else if ('Err' in result) {
                console.error("Loan creation failed due to:", result.Err);
                setError('Failed to create loan: ' + JSON.stringify(result.Err));
            }
        } catch (err) {
            setError('Error creating loan: ' + err.message);
            console.error("Error creating loan:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptLoan = async (loanId) => {
        if (!user || !authenticatedActor) {
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
            console.error("Error accepting loan:", err);
        } finally {
            setLoading(false);
        }
    };

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
                    placeholder="e.g., u6def-o7777-77774-qaaeq-cai"
                    readOnly
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
                        onClick={() => handleCardFocus(nft.tokenId)}
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
                                    className="text-black bg-white border border-gray-300 rounded-md p-2 mb-2 w-full"
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