// Set this before rendering the component
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';


import "@nfid/identitykit/react/styles.css"
import { IdentityKitProvider, IdentityKitTheme } from "@nfid/identitykit/react"

import { IdentityKitAuthType } from "@nfid/identitykit";
import { NFIDW, InternetIdentity, Stoic, OISY, MockedSigner } from "@nfid/identitykit"
// InternetIdentity.providerUrl = "http://localhost:4943/?canisterId=uxrrr-q7777-77774-qaaaq-cai&id=ulvla-h7777-77774-qaacq-cai"; 
// InternetIdentity.providerUrl = "https://identity.internetcomputer.org/"

// Helper to get canister IDs from env or fallback to dev'u6s2n-gx777-77774-qaaba-cai'
const CANISTER_IDS = [
  "u6s2n-gx777-77774-qaaba-cai",
 "uzt4z-lp777-77774-qaabq-cai",
  process.env.CANISTER_ID_CORE_PROTOCOL_CANISTER || "u6s2n-gx777-77774-qaaba-cai"
];

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdentityKitProvider
      authType={IdentityKitAuthType.STANDARD}
      signerClientOptions={{
        targets: CANISTER_IDS,
        derivationOrigin: window.location.hostname.includes("localhost")
          ? "http://localhost:3000"
          : window.location.origin,
      }}
      signers={[InternetIdentity, NFIDW, Stoic, OISY]}
      featuredSigner={InternetIdentity}
      theme={IdentityKitTheme.DARK}
      agentOptions={{
        host: window.location.hostname.includes("localhost")
          ? "http://127.0.0.1:4943/"
          : "https://icp0.io"
      }}
    >
      <App />
    </IdentityKitProvider>
  </React.StrictMode>,
);

