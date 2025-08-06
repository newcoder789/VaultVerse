import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Hash "mo:base/Nat32";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import Debug "mo:base/Debug";
import DIP721InterfaceModule "../src/interfaces/DIP721Interface";
import HashMap "mo:base/HashMap";

actor VaultLending {
  // Types
  public type Result<T, E> = { #Ok : T; #Err : E };
  public type NftError = {
    #SelfTransfer;
    #TokenNotFound;
    #TxNotFound;
    #BurnedNFT;
    #SelfApprove;
    #OperatorNotFound;
    #Unauthorized;
    #ExistedNFT;
    #OwnerNotFound;
    #Other : Text;
    #Unknown;
    };
    
  public type LoanError = {
    #Unauthorized;
    #LoanNotFound;
    #InvalidAmount;
    #NFTNotLocked;
    #LoanError;
    #Other: Text;
  };
  public type Property = {
    key: Text;
    value: { #TextContent : Text; #NatContent : Nat; #IntContent : Int; #BoolContent : Bool; #Principal : Principal };
  };
  
  public type NFTMetadata = {
    tokenId: ?Nat;
    name: Text;
    description: Text;
    image: Text;
    attributes: [Attribute];
    collection: ?Text;
  };
  public type Attribute = {
    trait_type: Text;
    value: Text;
  };
  public type NormalizedMetadata = {
    nftId: Text;
    imageUrl: Text;
    attributes: [(Text, Text)];
    riskScore: Text;
    isEligible: Bool;
  };
  public type Loan = {
    id: Nat;
    tokenId: Nat;
    nftCanisterId: Principal;
    lender: Principal;
    borrower: Principal;
    amount: Nat;
    interestRate: Nat;
    duration: Int;
    startTime: Int;
    isActive: Bool;
    isRepaid: Bool;
    isLiquidated: Bool;
  };
  public type LockInfo = {
    owner: Principal;
    tokenId: Nat;
    canisterId: Principal;
    lockedAt: Int;
    condition: Text;
  };
  public type TxEvent = {
    time: Nat64;
    operation: Text;
    params: [Property];
    caller: Principal;
  };
  public type Standard = {
    name: Text;
    url: Text;
  };



  public type TrustedOrigin = {
    origins: [Text];
  };
  public type UserProfile = {
    username: Text;
    bio: Text;
    profilePicUrl: Text;
    joinedAt: Int;
  };
  // // DIP721 Interface
  // type DIP721InterfaceModule.DIP721Interface  = actor {
  //   transferFrom : (Principal, Principal, Nat) -> async Result<Nat, NftError>;
  //   ownerTokenIds : (Principal) -> async Result<[Nat], NftError>;
  //   tokenMetadata : (Nat) -> async Result<{ properties : [Property] }, NftError>;
  // };
  // type DIP721InterfaceModule.DIP721Interface  = actor {
    
    // type Property = {
    //     key   : Text;
    //     value : {
    //     #Nat64Content  : Nat64;
    //     #Nat32Content  : Nat32;
    //     #BoolContent   : Bool;
    //     #Nat8Content   : Nat8;
    //     #Int64Content  : Int64;
    //     #IntContent    : Int;
    //     #NatContent    : Nat;
    //     #Nat16Content  : Nat16;
    //     #Int32Content  : Int32;
    //     #Int8Content   : Int8;
    //     #Int16Content  : Int16;
    //     #BlobContent   : Blob;
    //     #NestedContent : Property;
    //     #Principal     : Principal;
    //     #TextContent   : Text;
    //   };
    //   };

    // // Loan-specific types
    // type Loan = {
    //     tokenId : Nat;
    //     lender : Principal;
    //     borrower : Principal;
    //     amount : Nat;
    //     interestRate : Nat;
    //     duration : Int;
    //     startTime : Int;
    //     isActive : Bool;
    //     isRepaid : Bool;
    //     isLiquidated : Bool;
    //   };

    // // DIP-721 types

    // type Result<T> = {
    //     #Ok : T;
    //     #Err : NftError;
    //   };

    // type Metadata = {
    //     logo : ?Text;
    //     name : ?Text;
    //     symbol : ?Text;
    //     custodians : [Principal];
    //     created_at : Int;
    //     upgraded_at : Int;
    //   };

    // private type TokenMetadata = {
    //     transferred_at : ?Nat64;
    //     transferred_by : ?Principal;
    //     owner : ?Principal;
    //     operator : ?Principal;
    //     properties : [Property];
    //     is_burned : Bool;
    //     token_identifier : Nat;
    //     burned_at : ?Nat64;
    //     burned_by : ?Principal;
    //     minted_at : Nat64;
    //     minted_by : Principal;
    //   };

    // type TxEvent = {
    //     time : Nat64;
    //     operation : Text;
    //     details : [Property];
    //     caller : Principal;
    //   };

    // type NftError = {
    //     #SelfTransfer;
    //     #TokenNotFound;
    //     #TxNotFound;
    //     #BurnedNFT;
    //     #SelfApprove;
    //     #OperatorNotFound;
    //     #Unauthorized;
    //     #ExistedNFT;
    //     #OwnerNotFound;
    //     #Other : Text;
    //     #Unknown;
    //   };
    // // Basic Interface
    // supportedInterfaces : query () -> async [{
    //     #Transfer;
    //     #Burn;
    //     #Mint;
    //     #Approval;
    //     #TransactionHistory;
    //   }];
    // tokenMetadata : query (tokenId : Nat) -> async Result<TokenMetadata>;
    // balanceOf : query (owner : Principal) -> async Result<Nat>;
    // totalSupply : query () -> async Nat;
    // ownerOf : query (tokenId : Nat) -> async Result<Principal>;
    // ownerTokenIds : query (owner : Principal) -> async Result<[Nat]>;
    // ownerTokenMetadata : query (owner : Principal) -> async Result<[TokenMetadata]>;
    // operatorOf : query (tokenId : Nat) -> async Result<Principal>;
    // operatorTokenIds : query (operator : Principal) -> async Result<[Nat]>;
    // operatorTokenMetadata : query (operator : Principal) -> async Result<[TokenMetadata]>;
    // setCustodians : shared (custodians : [Principal]) -> async ();
    // setLogo : shared (logo : Text) -> async ();
    // setName : shared (name : Text) -> async ();
    // setSymbol : shared (symbol : Text) -> async ();
    // custodians : query () -> async [Principal];
    // logo : query () -> async ?Text;
    // name : query () -> async ?Text;
    // symbol : query () -> async ?Text;
    // metadata : query () -> async Metadata;

    // // Approval Interface
    // approve : shared (operator : Principal, tokenId : Nat) -> async Result<Nat>;
    // setApprovalForAll : shared (operator : Principal, toggle : Bool) -> async Result<Nat>;
    // isApprovedForAll : query (owner : Principal, operator : Principal) -> async Result<Nat>;

    // // Transfer Interface
    // transfer : shared (to : Principal, tokenId : Nat) -> async Result<Nat>;
    // transferFrom : shared (from : Principal, to : Principal, tokenId : Nat) -> async Result<Nat>;

    // // Mint Interface
    // mint : shared (to : Principal, properties : [Property]) -> async Result<Nat>;

    // // Burn Interface
    // burn : shared (tokenId : Nat) -> async Result<Nat>;

    // // History Interface
    // transaction : query (txId : Nat) -> async Result<TxEvent>;
    // totalTransactions : query () -> async Nat;

    // // Lending Protocol Interface
    // createLoan : shared (tokenId : Nat, amount : Nat, interestRate : Nat, duration : Int) -> async Result<Nat>;
    // acceptLoan : shared (tokenId : Nat) -> async Result<Nat>;
    // repayLoan : shared (tokenId : Nat) -> async Result<Nat>;
    // liquidateLoan : shared (tokenId : Nat) -> async Result<Nat>;
    // getLoan : query (tokenId : Nat) -> async Result<Loan>;
    // };

  // Stable storage
  private stable var loanEntries: [(Nat, Loan)] = [];
  private stable var lockedEntries: [(Nat, LockInfo)] = [];
  private stable var transactionEntries: [(Nat, TxEvent)] = [];
  private stable var nextTxId: Nat = 0;
  private stable var nextLoanId: Nat = 0;
  private stable var custodians: [Principal] = [];
  
  // In-memory state with explicit types
  private var loans: Trie.Trie<Nat, Loan> = Trie.empty();
  private var lockedNfts: Trie.Trie<Nat, LockInfo> = Trie.empty();
  private var transactions: Trie.Trie<Nat, TxEvent> = Trie.empty();
  func principalHash(p: Principal): Nat32 {
    return Text.hash(Principal.toText(p));
  };
  var users = HashMap.HashMap<Principal, UserProfile>(10,Principal.equal, principalHash);

  private stable var canisterMetadata: {
    var logo: ?Text;
    var name: ?Text;
    var symbol: ?Text;
    var custodians: [Principal];
    var created_at: Int;
    var upgraded_at: Int;
  } = {
    var logo = ?"https://vaultverse.example.com/logo.png";
    var name = ?"VaultVerse Lending";
    var symbol = ?"VLT";
    var custodians = [Principal.fromText("lsoj4-xkphy-rbr5d-a5c3x-i2g7g-rxc5g-h77ih-vozzu-qsrrz-bwiui-2ae"),Principal.fromText("3tz33-zg5yy-jiy2n-lkytg-247fl-kbd6x-mfx5k-dukae-lqu7e-466ly-oae"),Principal.fromText("klrif-eqbpo-l5c72-tfjlz-z4uep-62wna-5mpay-c2y5x-3fnto-pggh2-zae")];
    var created_at = Time.now();
    var upgraded_at = Time.now();
  };

  // Hash function for Nat
  private func natHash(n: Nat): Nat32 {
    Nat32.fromNat(n);
  };

  // System functions
  system func preupgrade() {
    loanEntries := Trie.toArray<Nat, Loan, (Nat, Loan)>(loans, func(k, v) = (k, v));
    lockedEntries := Trie.toArray<Nat, LockInfo, (Nat, LockInfo)>(lockedNfts, func(k, v) = (k, v));
    transactionEntries := Trie.toArray<Nat, TxEvent, (Nat, TxEvent)>(transactions, func(k, v) = (k, v));
    custodians := canisterMetadata.custodians;
  };

  system func postupgrade() {
    loans := Array.foldLeft<(Nat, Loan), Trie.Trie<Nat, Loan>>(
      loanEntries,
      Trie.empty(),
      func(trie, (k, v)) = Trie.put(trie, { key = k; hash = natHash(k) }, Nat.equal, v).0
    );
    lockedNfts := Array.foldLeft<(Nat, LockInfo), Trie.Trie<Nat, LockInfo>>(
      lockedEntries,
      Trie.empty(),
      func(trie, (k, v)) = Trie.put(trie, { key = k; hash = natHash(k) }, Nat.equal, v).0
    );
    transactions := Array.foldLeft<(Nat, TxEvent), Trie.Trie<Nat, TxEvent>>(
      transactionEntries,
      Trie.empty(),
      func(trie, (k, v)) = Trie.put(trie, { key = k; hash = natHash(k) }, Nat.equal, v).0
    );
    loanEntries := [];
    lockedEntries := [];
    transactionEntries := [];
  };

  // Helper: Check if caller is custodian
  private func isCustodian(caller: Principal): Bool {
    Array.find(canisterMetadata.custodians, func(c: Principal): Bool { c == caller }) != null;
  };

  // Helper: Log transaction
  private func logTransaction(operation: Text, caller: Principal, params: [Property]): Nat {
    let txId = nextTxId;
    nextTxId += 1;
    let tx: TxEvent = {
      time = Nat64.fromNat(Int.abs(Time.now()));
      operation = operation;
      params = params;
      caller = caller;
    };
    transactions := Trie.put(transactions, { key = txId; hash = natHash(txId) }, Nat.equal, tx).0;
    txId;
  };

  // NFID: Supported standards
  type SupportedStandard = { url: Text; name: Text };
  public query func icrc10_supported_standards(): async [SupportedStandard] {
    [
      {
        url = "https://github.com/dfinity/ICRC/blob/main/ICRCs/ICRC-10/ICRC-10.md";
        name = "ICRC-10";
      },
      {
        url = "https://github.com/dfinity/wg-identity-authentication/blob/main/topics/icrc_28_trusted_origins.md";
        name = "ICRC-28";
      }
    ];
  };

  // NFID: Trusted origins
  type Icrc28TrustedOriginsResponse = { trusted_origins: [Text] };
  public shared({ caller }) func icrc28_trusted_origins(): async Icrc28TrustedOriginsResponse {
    let trustedOrigins: [Text] = [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:4943",
      "http://127.0.0.1:4943",
      "https://uzt4z-lp777-77774-qaabq-cai.icp0.io",
      "https://uzt4z-lp777-77774-qaabq-cai.raw.icp0.io",
      "https://uzt4z-lp777-77774-qaabq-cai.ic0.app",
      "https://uzt4z-lp777-77774-qaabq-cai.raw.ic0.app",
      "https://a6x7x-xyaaa-aaaah-qcn6q-cai.icp0.io",
      "https://a6x7x-xyaaa-aaaah-qcn6q-cai.raw.icp0.io",
      "https://a6x7x-xyaaa-aaaah-qcn6q-cai.ic0.app",
      "https://a6x7x-xyaaa-aaaah-qcn6q-cai.raw.ic0.app",
      "https://vaultic.ai",
      "https://app.vaultic.ai"
    ];
    { trusted_origins = trustedOrigins };
  };

  public shared func getDip721CanisterName(canisterId: Principal): async Result<Text,Text>{
    let thisCanister = Principal.fromActor(VaultLending);
    if(canisterId == thisCanister){
      return #Err("Bruh u cant ask for id of this canister itself \n anyway it is: VaultLending")
    };
    let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(canisterId));
    let nameOpt: ?Text = await dip721.name();
     switch (nameOpt) {
      case (?name) {
        return #Ok("Name of Canister is: " # name);
      };
      case null {
        return #Err("No name found in DIP721 interface");
      };
    };
  };

  public shared func getDip721Metadata(canisterId: Principal, tokenId: Nat): async Result<NFTMetadata, NftError> {
    let thisCanister = Principal.fromActor(VaultLending);
    if (canisterId == thisCanister) {
      return #Err(#Other("No internal NFTs"));
    };
    let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(canisterId));
    switch (await dip721.tokenMetadata(tokenId)) {
      case (#Ok(metadata)) {
        #Ok({
          tokenId = ?tokenId;
          name = findProperty(metadata.properties, "name", "Unknown NFT");
          description = findProperty(metadata.properties, "description", "No description");
          image = findProperty(metadata.properties, "image", "");
          attributes = Array.map<Property, Attribute>(metadata.properties, func(p) {
            {
              trait_type = p.key;
              value = switch (p.value) {
                case (#TextContent(t)) t;
                case (_) "";
              };
            }
          });
          collection = ?Principal.toText(canisterId);
        });
      };
      case (#Err(e)) {
        #Err(e);
      };
    };
  };



  public shared func normalizeMetadata(raw: NFTMetadata): async NormalizedMetadata {
    let attributes = Array.map<Attribute, (Text, Text)>(raw.attributes, func(attr) {
      (attr.trait_type, attr.value)
    });
    let riskScore = computeRiskScore(attributes);
    {
      nftId = switch (raw.tokenId) { case (?id) Nat.toText(id); case null "unknown" };
      imageUrl = raw.image;
      attributes = attributes;
      riskScore = Float.toText(riskScore);
      isEligible = riskScore > 0.7;
    };
  };



  private func computeRiskScore(attrs: [(Text, Text)]): Float {
    var score = 0.0;
    for ((k, v) in attrs.vals()) {
      if (k == "Rarity" and v == "Legendary") { score += 0.5 };
      if (k == "Type" and v == "Alien") { score += 0.3 };
    };
    score;
  };


  private func findProperty(props: [Property], key: Text, default: Text): Text {
    switch (Array.find(props, func(p: Property): Bool { p.key == key })) {
      case (?prop) {
        switch (prop.value) { case (#TextContent(t)) t; case (_) default };
      };
      case null { default };
    };
  };




  public shared({ caller }) func lockNFT(
    canisterId: Principal,
    tokenId: Nat,
    condition: Text,
    ): async Result<Nat, LoanError> {
    let thisCanister = Principal.fromActor(VaultLending);
    if (canisterId == thisCanister) {
      return #Err(#Other("Cannot lock internal NFTs"));
    };
    if (condition == "") {
      return #Err(#Other("Condition cannot be empty"));
    };
    switch (Trie.find(lockedNfts, { key = tokenId; hash = natHash(tokenId) }, Nat.equal)) {
      case (?_) { return #Err(#Other("Random ass error ")) };
      case null {};
    };
    switch (await verifyNFTOwnership(canisterId, tokenId, caller)) {
      case (#Ok(true)) {};
      case (#Ok(false)) { return #Err(#Other("Ownership verification failed")) };
      case (#Err(_)) { return #Err(#Other("RAE2")) };
    };
    let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(canisterId));
    switch (await dip721.transferFrom(caller, thisCanister, tokenId)) {
      case (#Ok(txId)) {
        let lockInfo: LockInfo = {
          owner = caller;
          tokenId = tokenId;
          canisterId = canisterId;
          lockedAt = Time.now();
          condition = condition;
        };
        lockedNfts := Trie.put(lockedNfts, { key = tokenId; hash = natHash(tokenId) }, Nat.equal, lockInfo).0;
        let logId = logTransaction(
          "lockNFT",
          caller,
          [
            { key = "canisterId"; value = #Principal(canisterId) },
            { key = "tokenId"; value = #NatContent(tokenId) },
            { key = "condition"; value = #TextContent(condition) }
          ]
        );
        #Ok(logId);
      };
      case (#Err(e)) { #Err(#Other("BIg BOss Error" # debug_show(e))) };
    };
  };



  public shared({ caller }) func unlockNFT(tokenId: Nat): async Result<Nat, LoanError> {
    switch (Trie.find(lockedNfts, { key = tokenId; hash = natHash(tokenId) }, Nat.equal)) {
      case (null) { return #Err(#Other("Unable to find lockINfo")) };
      case (?lockInfo) {
        if (caller != lockInfo.owner and not isCustodian(caller)) {
          return #Err(#Unauthorized);
        };
        let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(lockInfo.canisterId));
        let thisCanister = Principal.fromActor(VaultLending);
        switch (await dip721.transferFrom(thisCanister, lockInfo.owner, tokenId)) {
          case (#Ok(txId)) {
            lockedNfts := Trie.remove(lockedNfts, { key = tokenId; hash = natHash(tokenId) }, Nat.equal).0;
            let logId = logTransaction(
              "unlockNFT",
              caller,
              [{ key = "tokenId"; value = #NatContent(tokenId) }]
            );
            #Ok(logId);
          };
          case (#Err(e)) { #Err(#Other("UnlockNFT BIG BOSS ERROR")) };
        };
      };
    };
  };

  // Collateral: Query locked NFTs
  public query func getLockedNFTs(): async [(Nat, LockInfo)] {
    Trie.toArray<Nat, LockInfo, (Nat, LockInfo)>(lockedNfts, func(k, v) = (k, v));
  };

  public query func getLockedNFT(tokenId: Nat): async ?LockInfo {
    Trie.find(lockedNfts, { key = tokenId; hash = natHash(tokenId) }, Nat.equal);
  };
  

  // Lending: Verify NFT ownership
  public shared({ caller }) func verifyNFTOwnership(
    nftCanisterId: Principal,
    tokenId: Nat,
    owner: Principal
    ): async Result<Bool, LoanError> {
    let thisCanister = Principal.fromActor(VaultLending);
    if (nftCanisterId == thisCanister) {
      return #Err(#Other("Cannot verify ownership for internal NFTs"));
    };
    let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(nftCanisterId));
    switch (await dip721.ownerTokenIds(owner)) {
      case (#Ok(tokenIds)) {
        #Ok(Array.find(tokenIds, func(id: Nat): Bool { id == tokenId }) != null);
      };
      case (#Err(_)) { #Err(#Other("tokne ownership issue")) };
    };
  };
  public shared({ caller }) func createLoan(
    nftCanisterId: Principal,
    tokenId: Nat,
    amount: Nat,
    interestRate: Nat,
    duration: Int
    ): async Result<Nat, LoanError> {
    let thisCanister = Principal.fromActor(VaultLending);
    if (nftCanisterId == thisCanister) {
      return #Err(#Other("Cannot create loan with internal NFTs")); 
    };
    if (amount == 0) {
      return #Err(#Other("Invalid amount NUll"# Nat.toText(amount)));
    };
    switch (await getDip721Metadata(nftCanisterId, tokenId)) {
      case (#Ok(metadata)) {
        let normalized = await normalizeMetadata(metadata);
        if (not normalized.isEligible) {
          return #Err(#Other("NFT not eligible for loan"));
        };
        // let ltv = 0.5;
        // let maxLoan = Float.toInt(Float.fromInt(amount) * ltv);
        // if (amount > maxLoan) {
        //   return #Err(#Other("Loan amount exceeds LTV limit"));
        // };
        switch (await verifyNFTOwnership(nftCanisterId, tokenId, caller)) {
          case (#Ok(false)) { return #Err(#Unauthorized) };
          case (#Ok(true)) {};
          case (#Err(_)) { return #Err(#Other("RandomError")) };
        };
        // switch (await lockNFT(nftCanisterId, tokenId, "{\"ltv\":0.5}")) {
        //   case (#Err(_)) { return #Err(#Other("Not able to lock ")) };
        //   case (#Ok(_)) {};
        // };
        switch (Trie.find(loans, { key = tokenId; hash = natHash(tokenId) }, Nat.equal)) {
          case (?loan) {
            if (loan.isActive and not loan.isRepaid and not loan.isLiquidated) {
              return #Err(#LoanError);
            };
          };
          case null {};
        };
        let loanId = nextLoanId;
        let loan: Loan = {
          id = loanId;
          tokenId = tokenId;
          nftCanisterId = nftCanisterId;
          lender = caller;
          borrower = caller;
          amount = amount;
          interestRate = interestRate;
          duration = duration;
          startTime = Time.now();
          isActive = true;
          isRepaid = false;
          isLiquidated = false;
        };
        loans := Trie.put(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal, loan).0;
        nextLoanId += 1;
        let txId = logTransaction(
          "createLoan",
          caller,
          [
            { key = "loanId"; value = #NatContent(loanId) },
            { key = "tokenId"; value = #NatContent(tokenId) },
            { key = "canisterId"; value = #Principal(nftCanisterId) }
          ]
        );
        #Ok(txId);
      };
      case (#Err(_)) {
        return #Err(#Other("Failed to fetch NFT metadata"));
      };
    };
  };

  // Lending: Accept loan
  public shared({ caller }) func acceptLoan(loanId: Nat): async Result<Nat, LoanError> {
    switch (Trie.find(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal)) {
      case (null) { return #Err(#LoanNotFound) };
      case (?loan) {
        if (not loan.isActive or loan.isRepaid or loan.isLiquidated) {
          return #Err(#Other("Loan is not active"));
        };
        switch (Trie.find(lockedNfts, { key = loan.tokenId; hash = natHash(loan.tokenId) }, Nat.equal)) {
          case (null) { return #Err(#NFTNotLocked) };
          case (?lockInfo) {
            if (lockInfo.owner != loan.lender) {
              return #Err(#Unauthorized);
            };
            let thisCanister = Principal.fromActor(VaultLending);
            let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(loan.nftCanisterId));
            switch (await dip721.transferFrom(thisCanister, caller, loan.tokenId)) {
              case (#Ok(txId)) {
                let updatedLoan: Loan = {
                  loan with
                  borrower = caller;
                  startTime = Time.now();
                };
                loans := Trie.put(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal, updatedLoan).0;
                let updatedLockInfo: LockInfo = {
                  lockInfo with
                  owner = caller;
                };
                lockedNfts := Trie.put(lockedNfts, { key = loan.tokenId; hash = natHash(loan.tokenId) }, Nat.equal, updatedLockInfo).0;
                let logId = logTransaction(
                  "acceptLoan",
                  caller,
                  [
                    { key = "loanId"; value = #NatContent(loanId) },
                    { key = "tokenId"; value = #NatContent(loan.tokenId) }
                  ]
                );
                #Ok(logId);
              };
              case (#Err(_)) { #Err(#Other("Big boss Error in accept loan")) };
            };
          };
        };
      };
    };
  };

  // Lending: Repay loan
  public shared({ caller }) func repayLoan(loanId: Nat): async Result<Nat, LoanError> {
    switch (Trie.find(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal)) {
      case (null) { return #Err(#LoanNotFound) };
      case (?loan) {
        if (not loan.isActive or loan.isRepaid or loan.isLiquidated) {
          return #Err(#Other("Loan is not active or already processed"));
        };
        if (loan.borrower != caller) {
          return #Err(#Unauthorized);
        };
        switch (Trie.find(lockedNfts, { key = loan.tokenId; hash = natHash(loan.tokenId) }, Nat.equal)) {
          case (null) { return #Err(#NFTNotLocked) };
          case (?lockInfo) {
            if (lockInfo.owner != caller) {
              return #Err(#Unauthorized);
            };
            let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(loan.nftCanisterId));
            switch (await dip721.transferFrom(caller, loan.lender, loan.tokenId)) {
              case (#Ok(txId)) {
                let updatedLoan: Loan = {
                  loan with
                  isActive = false;
                  isRepaid = true;
                };
                loans := Trie.put(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal, updatedLoan).0;
                lockedNfts := Trie.remove(lockedNfts, { key = loan.tokenId; hash = natHash(loan.tokenId) }, Nat.equal).0;
                let logId = logTransaction(
                  "repayLoan",
                  caller,
                  [
                    { key = "loanId"; value = #NatContent(loanId) },
                    { key = "tokenId"; value = #NatContent(loan.tokenId) }
                  ]
                );
                #Ok(logId);
              };
              case (#Err(_)) { #Err(#Other("BIg BOss repay loan error2")) };
            };
          };
        };
      };
    };
  };

  // Lending: Liquidate loan
  public shared({ caller }) func liquidateLoan(loanId: Nat): async Result<Nat, LoanError> {
    switch (Trie.find(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal)) {
      case (null) { return #Err(#LoanNotFound) };
      case (?loan) {
        if (not loan.isActive or loan.isRepaid or loan.isLiquidated) {
          return #Err(#Other("Loan is not active or already processed"));
        };
        if (loan.lender != caller and not isCustodian(caller)) {
          return #Err(#Unauthorized);
        };
        if (Time.now() < loan.startTime + loan.duration) {
          return #Err(#Other("Loan is not overdue yet"));
        };
        switch (Trie.find(lockedNfts, { key = loan.tokenId; hash = natHash(loan.tokenId) }, Nat.equal)) {
          case (null) { return #Err(#NFTNotLocked) };
          case (?lockInfo) {
            let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(loan.nftCanisterId));
            switch (await dip721.transferFrom(lockInfo.owner, loan.lender, loan.tokenId)) {
              case (#Ok(id)) {
                let updatedLoan: Loan = {
                  loan with
                  isActive = false;
                  isLiquidated = true;
                };
                loans := Trie.put(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal, updatedLoan).0;
                lockedNfts := Trie.remove(lockedNfts, { key = loan.tokenId; hash = natHash(loan.tokenId) }, Nat.equal).0;
                let logId = logTransaction(
                  "liquidateLoan",
                  caller,
                  [
                    { key = "loanId"; value = #NatContent(loanId) },
                    { key = "tokenId"; value = #NatContent(loan.tokenId) }
                  ]
                );
                #Ok(logId);
              };
              case (#Err(_)) { #Err(#Other("Big boss liquidate loan err")) };
            };
          };
        };
      };
    };
  };
  // Lending: Query loan
  public query func getLoan(loanId: Nat): async Result<Loan, LoanError> {
    switch (Trie.find(loans, { key = loanId; hash = natHash(loanId) }, Nat.equal)) {
      case (?loan) { #Ok(loan) };
      case (null) { #Err(#LoanNotFound) };
    };
  };

  // Lending: Query all loans
  public query func getAllLoans(): async [(Nat, Loan)] {
    Trie.toArray<Nat, Loan, (Nat, Loan)>(loans, func(k, v) = (k, v));
  };

  // Transaction: Query transaction
  public query func transaction(txId: Nat): async Result<TxEvent, NftError> {
    switch (Trie.find(transactions, { key = txId; hash = natHash(txId) }, Nat.equal)) {
      case (?tx) { #Ok(tx) };
      case (_) { #Err(#TxNotFound) };
    };
  };

  // Transaction: Total transactions
  public query func totalTransactions(): async Nat {
    Trie.size(transactions);
  };

  // Canist
  public query func logo(): async ?Text {
    canisterMetadata.logo;
  };

  public query func name(): async ?Text {
    canisterMetadata.name;
  };

  public query func symbol(): async ?Text {
    canisterMetadata.symbol;
  };

  public query func getcustodians(): async [Principal] {
    canisterMetadata.custodians;
  };
  public shared func scoreLocalNFT(tokenId: Nat, canisterId: Principal) : async Result<Nat, NftError> {
    var score = 50;
    let dip721: DIP721InterfaceModule.DIP721Interface  = actor(Principal.toText(canisterId));
    // let  canisterId: Principal = Principal.fromText("uzt4z-lp777-77774-qaabq-cai");
    let result: Result<NFTMetadata, NftError> = await getDip721Metadata(canisterId, tokenId );
    switch(result){
      case(#Err(x)){
        return #Err(#TokenNotFound);
      };case(#Ok(NFTMetadata)){
          var score = 50;

          for (attr in NFTMetadata.attributes.vals()) {
            switch (attr.trait_type, attr.value) {
              case ("Rarity", "Legendary") { score += 25 };
              case ("Rarity", "Rare") { score += 15 };
              case ("Rarity", "Common") { score -= 10 };
              case ("Type", "Alien") { score += 10 };
              case ("Type", "Zombie") { score += 5 };
              case _ {}; // Ignore others
            }
          };

          if (score > 100) { score := 100 };
          return #Ok(score);
      };
    }
    // for (p in props.vals()) {
    //   switch (p.key, p.value) {
    //     case ("Rarity", #TextContent("Legendary")) { score += 20 };
    //     case ("Rarity", #TextContent("Common")) { score -= 10 };
    //     case ("Type", #TextContent("Alien")) { score += 5 };
    //     // ... add more logic
    //     case _ {}; // ignore
    //   };
    // };
    // return Nat.min(score, 100); // cap max score
  };
  
  public shared({caller}) func set_profile(profile: UserProfile): async () {  
    users.put(caller, profile);
  };
  public query func get_profile(who: Principal): async ?UserProfile {
    return users.get(who);
  };
  
  public shared({ caller }) func setCustodians(newCustodians: [Principal]): async () {
    if (not isCustodian(caller)) {
      throw Error.reject("Unauthorized");
    };
    canisterMetadata.custodians := newCustodians;
    ignore logTransaction(
      "setCustodians",
      caller,
      [{ key = "custodians"; value = #TextContent(Principal.toText(caller)) }]
    );
    };

  public func testMetadata() : async Text {
    let dip721 = actor("uzt4z-lp777-77774-qaabq-cai") : DIP721InterfaceModule.DIP721Interface;
    let nftCanisterId: Principal = Principal.fromText("uzt4z-lp777-77774-qaabq-cai");
    let meta = await getDip721Metadata(nftCanisterId, 0);
    return "Success!";
  };

};