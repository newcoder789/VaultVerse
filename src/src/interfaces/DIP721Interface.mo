module {
    // Generic types (included from Generic.mo)
    public type Property = {
    key: Text;
    value: { #TextContent : Text; #NatContent : Nat; #IntContent : Int; #BoolContent : Bool; #Principal : Principal };
  };

    public type Value = {
        #Nat64Content  : Nat64;
        #Nat32Content  : Nat32;
        #BoolContent   : Bool;
        #Nat8Content   : Nat8;
        #Int64Content  : Int64;
        #IntContent    : Int;
        #NatContent    : Nat;
        #Nat16Content  : Nat16;
        #Int32Content  : Int32;
        #Int8Content   : Int8;
        #Int16Content  : Int16;
        #BlobContent   : Blob;
        #NestedContent : Property;
        #Principal     : Principal;
        #TextContent   : Text;
    };

    // public module Reserved {
    //     public func data(data : Blob) : Property = {
    //         key   = "blob";
    //         value = #BlobContent(data);
    //     };

    //     public func location(location : Text) : Property = {
    //         key   = "location";
    //         value = #TextContent(location);
    //     };

    //     public func contentHash(hash : Blob) : Property = {
    //         key   = "contentHash";
    //         value = #BlobContent(hash);
    //     };

    //     public func contentType(mime : Text) : Property = {
    //         key   = "contentType";
    //         value = #TextContent(mime);
    //     };

    //     public func thumbnail(url : Text) : Property = {
    //         key   = "thumbnail";
    //         value = #TextContent(url);
    //     };
    // };

    // Loan-specific types
    public type Loan = {
        tokenId : Nat;
        lender : Principal;
        borrower : Principal;
        amount : Nat;
        interestRate : Nat;
        duration : Int;
        startTime : Int;
        isActive : Bool;
        isRepaid : Bool;
        isLiquidated : Bool;
    };

    // DIP-721 types
    public type SupportedInterface = {
        #Transfer;
        #Burn;
        #Mint;
        #Approval;
        #TransactionHistory;
    };

    public type Result<T> = {
        #Ok : T;
        #Err : NftError;
    };

    public type Metadata = {
        logo : ?Text;
        name : ?Text;
        symbol : ?Text;
        custodians : [Principal];
        created_at : Int;
        upgraded_at : Int;
    };

    public type TokenMetadata = {
        transferred_at : ?Nat64;
        transferred_by : ?Principal;
        owner : ?Principal;
        operator : ?Principal;
        properties : [Property];
        is_burned : Bool;
        token_identifier : Nat;
        burned_at : ?Nat64;
        burned_by : ?Principal;
        minted_at : Nat64;
        minted_by : Principal;
    };

    public type TxEvent = {
        time : Nat64;
        operation : Text;
        details : [Property];
        caller : Principal;
    };

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

    // Interface for the NFT Lending Canister
    public type DIP721Interface = actor {
        // Basic Interface
        supportedInterfaces : query () -> async [SupportedInterface];
        tokenMetadata : query (tokenId : Nat) -> async Result<TokenMetadata>;
        balanceOf : query (owner : Principal) -> async Result<Nat>;
        totalSupply : query () -> async Nat;
        ownerOf : query (tokenId : Nat) -> async Result<Principal>;
        ownerTokenIds : query (owner : Principal) -> async Result<[Nat]>;
        ownerTokenMetadata : query (owner : Principal) -> async Result<[TokenMetadata]>;
        operatorOf : query (tokenId : Nat) -> async Result<Principal>;
        operatorTokenIds : query (operator : Principal) -> async Result<[Nat]>;
        operatorTokenMetadata : query (operator : Principal) -> async Result<[TokenMetadata]>;
        setCustodians : shared (custodians : [Principal]) -> async ();
        setLogo : shared (logo : Text) -> async ();
        setName : shared (name : Text) -> async ();
        setSymbol : shared (symbol : Text) -> async ();
        custodians : query () -> async [Principal];
        logo : query () -> async ?Text;
        name : query () -> async ?Text;
        symbol : query () -> async ?Text;
        metadata : query () -> async Metadata;

        // Approval Interface
        approve : shared (operator : Principal, tokenId : Nat) -> async Result<Nat>;
        setApprovalForAll : shared (operator : Principal, toggle : Bool) -> async Result<Nat>;
        isApprovedForAll : query (owner : Principal, operator : Principal) -> async Result<Nat>;

        // Transfer Interface
        transfer : shared (to : Principal, tokenId : Nat) -> async Result<Nat>;
        transferFrom : shared (from : Principal, to : Principal, tokenId : Nat) -> async Result<Nat>;

        // Mint Interface
        mint : shared (to : Principal, properties : [Property]) -> async Result<Nat>;

        // Burn Interface
        burn : shared (tokenId : Nat) -> async Result<Nat>;

        // History Interface
        transaction : query (txId : Nat) -> async Result<TxEvent>;
        totalTransactions : query () -> async Nat;

        // Lending Protocol Interface
        createLoan : shared (tokenId : Nat, amount : Nat, interestRate : Nat, duration : Int) -> async Result<Nat>;
        acceptLoan : shared (tokenId : Nat) -> async Result<Nat>;
        repayLoan : shared (tokenId : Nat) -> async Result<Nat>;
        liquidateLoan : shared (tokenId : Nat) -> async Result<Nat>;
        getLoan : query (tokenId : Nat) -> async Result<Loan>;
    };
};