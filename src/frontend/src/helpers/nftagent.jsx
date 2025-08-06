
// const agent = useAgent();

// import { Actor } from "@dfinity/agent";
// import { idlFactory as dip721Idl } from "../dip721/dip721.did.js"; // path to your IDL
// const DIP721_CANISTER_ID = "your-nft-canister-id";

// import extjs from "./extjs";
// import entrepotIDL from './candid/entrepot.did';

// const nftActor = useMemo(() => {
    //     if (!agent) return null;
    
    //     return Actor.createActor(dip721Idl, {
        //         agent,
        //         canisterId: DIP721_CANISTER_ID,
        //     });
        // }, [agent]);
        
        
// import { useAgent } from "@nfid/identitykit/react";
import { idlFactory as dip721IdlFactory } from "../../../declarations/dip721_nft_container/dip721_nft_container.did.js"; // Adjust the path as necessary
import { Actor, HttpAgent } from '@dfinity/agent';
import { useAuth } from "@nfid/identitykit/react";

export default async function get_data() {
    const { connect, disconnect, isConnecting, user } = useAuth()
    const canisterId = 'uzt4z-lp777-77774-qaabq-cai';  // dip canister id 
    const canisterId1 = '"bx6pk-jqaaa-aaaag-qbjpa-cai"';  // dip tested canister id 
    
    const agent = new HttpAgent({ host: 'http://127.0.0.1:4943' });
    await agent.fetchRootKey();
    const dip721Actor = Actor.createActor(dip721IdlFactory, {
        agent,
        canisterId: canisterId1,
    });
    console.log("DIP721 Actor created:", dip721Actor);
    // console.log("User principal:", user.principal);
    // const userPrincipal = user.principal;

    const response = await fetch(
        'https://us-central1-entrepot-api.cloudfunctions.net/api/collectionsDev',
    )
    var r2 = await response.json();
    console.log("here is the response from the api", r2);

    // const ext = extjs.connect(); // Connect to IC
    // const entrepot = ext.canister("6z5wo-yqaaa-aaaah-qcsfa-cai", entrepotIDL);
    // const data = await entrepot.decodeTokenId("fioai-paaaa-aaaap-aanzq-cai");
    // console.log("letsee the data we extraxted:", data);

    console.log("Trying ot fecth the metadata", r2[0])
    console.log("Trying ot fecth the metadata", r2[0].hasOwnProperty("metadata"));
    if (r2[0].hasOwnProperty("metadata")) {
        const metadata = await entrepot.decodeTokenId(r2[0].metadata);
        console.log("letsee the data we extraxted:", metadata);
    }    
}