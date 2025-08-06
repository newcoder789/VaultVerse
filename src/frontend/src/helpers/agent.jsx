import React, { useMemo, useEffect, useState } from "react"
import { useAgent } from "@nfid/identitykit/react"
import { HttpAgent, Actor } from "@dfinity/agent";


import { idlFactory as targetIdlFactory } from "../../../declarations/core_protocol_canister/core_protocol_canister.did.js";
import { useAuth } from "@nfid/identitykit/react"

const LOCAL_ICP_HOST = "http://127.0.0.1:4943"; // LOCALHOST (DFX)

const TARGET_CANISTER_ID = 'u6s2n-gx777-77774-qaaba-cai';

export function AuthenticatedSection() {
    const authenticatedAgent = useAgent();

    const { connect, disconnect, isConnecting, user } = useAuth()
    const [unauthenticatedAgent, setUnauthenticatedAgent] = useState ();
    // Set up unauthenticated agent for local replica
    useEffect(() => {
        const agent = new HttpAgent({ host: LOCAL_ICP_HOST });

        // Optional: trust local certificate (development only!)
        agent.fetchRootKey().catch((err) => {
            console.warn("Unable to fetch root key. Check if local replica is running.");
            console.error(err);
        });

        setUnauthenticatedAgent(agent);
    }, []);

    const createActor = useMemo(() => {

        if(!unauthenticatedAgent) {
            console.log("Agent not initialized. Connect your wallet first.");
            return null;
        }

        return Actor.createActor(targetIdlFactory, {
            agent: unauthenticatedAgent,
            canisterId: TARGET_CANISTER_ID,
          });
    }, [unauthenticatedAgent]);

    const authenticatedActor = useMemo(() => {
        if (!authenticatedAgent) return null;

        return Actor.createActor(targetIdlFactory, {
            agent: authenticatedAgent,
            canisterId: TARGET_CANISTER_ID,
        });
    }, [authenticatedAgent]);


    const tryingActor = async () => {
        console.log("Trying to call actor methods...");
        if (!createActor) {
            console.log("Actor not initialized. Connect your wallet first.");
            return;
        }

        try {

            console.log(createActor)
            const result1 = await createActor.greet("Aryan");
            console.log("Result of greet:", result1);
            // const result2 = await authenticatedActor.icrc28_trusted_origins({
            //     origin: "https://example.com",
            //     canisterId: "u6s2n-gx777-77774-qaaba-cai",
            // });
            // console.log("Result of icrc28_trusted_origins:", result2);
            
        } catch (err) {
            console.error("Actor call failed:", err);
        }
    };

    return (
        <button
            onClick={tryingActor}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded"
        >
            Test Actor
        </button>
    );
}
