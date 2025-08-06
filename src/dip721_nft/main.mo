import Array "mo:base/Array";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Nat32 "mo:base/Nat32";
import Int "mo:base/Int";


import Generic "./Generic";

actor class NFTLendingCanister(
    _logo : ?Text,
    _name : ?Text,
    _symbol : ?Text,
    _custodians : [Principal],
    _created_at : Int
) {
    // Helper function to hash Nat to Nat32
    private func hashNat(n : Nat) : Hash.Hash {
        Nat32.fromNat(n);
    };
    // Metadata for the canister
    private stable var canisterMetadata : {
        var logo : ?Text;
        var name : ?Text;
        var symbol : ?Text;
        var custodians : [Principal];
        var created_at : Int;
        var upgraded_at : Int;
        } = {
        var logo = ?"https://vaultverse.example.com/logo.png";
        var name = ?"VaultVerse Lending";
        var symbol = ?"VVNFT";
        var custodians = [Principal.fromText("lsoj4-xkphy-rbr5d-a5c3x-i2g7g-rxc5g-h77ih-vozzu-qsrrz-bwiui-2ae"),Principal.fromText("3tz33-zg5yy-jiy2n-lkytg-247fl-kbd6x-mfx5k-dukae-lqu7e-466ly-oae"),Principal.fromText("klrif-eqbpo-l5c72-tfjlz-z4uep-62wna-5mpay-c2y5x-3fnto-pggh2-zae"), Principal.fromText("ehm6p-bceuv-4wnaw-gvdjq-2fkc6-gptzi-dgs3y-utlp3-v4c5f-uzfwz-nqe")];
        var created_at = _created_at;
        var upgraded_at = Time.now();
    };

    // Stable storage for tokens, owners, operators, and transactions
    private stable var tokenEntries : [(Nat, TokenMetadata)] = [];
    private stable var ownerEntries : [(Principal, [Nat])] = [];
    private stable var operatorEntries : [(Principal, [Nat])] = [];
    private stable var approvalForAllEntries : [(Principal, [Principal])] = [];
    private stable var transactionEntries : [(Nat, TxEvent)] = [];
    private stable var loanEntries : [(Nat, Loan)] = [];

    // In-memory HashMaps for efficient access
    private var tokens = HashMap.HashMap<Nat, TokenMetadata>(0, Nat.equal, hashNat);
    private var owners = HashMap.HashMap<Principal, List.List<Nat>>(0, Principal.equal, Principal.hash);
    private var operators = HashMap.HashMap<Principal, List.List<Nat>>(0, Principal.equal, Principal.hash);
    private var approvalForAll = HashMap.HashMap<Principal, List.List<Principal>>(0, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<Nat, TxEvent>(0, Nat.equal, hashNat);
    private var loans = HashMap.HashMap<Nat, Loan>(0, Nat.equal, hashNat);

    // Stable counter for transaction IDs
    private stable var nextTxId : Nat = 0;

    // Loan-specific types
    public type Loan = {
        tokenId : Nat;
        lender : Principal;
        borrower : Principal;
        amount : Nat; // Loan amount in smallest unit (e.g., ICP cycles)
        interestRate : Nat; // Annual interest rate in basis points (e.g., 500 = 5%)
        duration : Int; // Loan duration in nanoseconds
        startTime : Int; // Loan start time
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
        properties : [Generic.Property];
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
        details : [Generic.Property];
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

    // System functions for stable storage
    system func preupgrade() {
        tokenEntries := Iter.toArray(tokens.entries());
        ownerEntries := Array.map<(Principal, List.List<Nat>), (Principal, [Nat])>(
            Iter.toArray(owners.entries()),
            func((p, t)) = (p, List.toArray(t))
        );
        operatorEntries := Array.map<(Principal, List.List<Nat>), (Principal, [Nat])>(
            Iter.toArray(operators.entries()),
            func((p, t)) = (p, List.toArray(t))
        );
        approvalForAllEntries := Array.map<(Principal, List.List<Principal>), (Principal, [Principal])>(
            Iter.toArray(approvalForAll.entries()),
            func((p, t)) = (p, List.toArray(t))
        );
        transactionEntries := Iter.toArray(transactions.entries());
        loanEntries := Iter.toArray(loans.entries());
    };

    system func postupgrade() {
        tokens := HashMap.fromIter<Nat, TokenMetadata>(tokenEntries.vals(), tokenEntries.size(), Nat.equal, hashNat);
        owners := HashMap.fromIter<Principal, List.List<Nat>>(
            Array.map<(Principal, [Nat]), (Principal, List.List<Nat>)>(
                ownerEntries,
                func((p, t)) = (p, List.fromArray(t))
            ).vals(),
            ownerEntries.size(),
            Principal.equal,
            Principal.hash
        );
        operators := HashMap.fromIter<Principal, List.List<Nat>>(
            Array.map<(Principal, [Nat]), (Principal, List.List<Nat>)>(
                operatorEntries,
                func((p, t)) = (p, List.fromArray(t))
            ).vals(),
            operatorEntries.size(),
            Principal.equal,
            Principal.hash
        );
        approvalForAll := HashMap.fromIter<Principal, List.List<Principal>>(
            Array.map<(Principal, [Principal]), (Principal, List.List<Principal>)>(
                approvalForAllEntries,
                func((p, t)) = (p, List.fromArray(t))
            ).vals(),
            approvalForAllEntries.size(),
            Principal.equal,
            Principal.hash
        );
        transactions := HashMap.fromIter<Nat, TxEvent>(transactionEntries.vals(), transactionEntries.size(), Nat.equal, hashNat);
        loans := HashMap.fromIter<Nat, Loan>(loanEntries.vals(), loanEntries.size(), Nat.equal, hashNat);
        tokenEntries := [];
        ownerEntries := [];
        operatorEntries := [];
        approvalForAllEntries := [];
        transactionEntries := [];
        loanEntries := [];
    };

    // Helper function to check if caller is a custodian
    private func isCustodian(p : Principal) : Bool {
        Array.find(canisterMetadata.custodians, func(c : Principal) : Bool { c == p }) != null;
    };

    // Helper function to log transactions
    private func logTransaction(
        operation : Text,
        caller : Principal,
        details : [Generic.Property]
        ) : Nat {
        let txId = nextTxId;
        nextTxId += 1;
        let tx : TxEvent = {
            time = Nat64.fromNat(Int.abs(Time.now()));
            operation = operation;
            details = details;
            caller = caller;
        };
        transactions.put(txId, tx);
        txId;
    };

    // --- BasicInterface Implementation ---

    public query func supportedInterfaces() : async [SupportedInterface] {
        [#Transfer, #Burn, #Mint, #Approval, #TransactionHistory];
    };

    public query func tokenMetadata(tokenId : Nat) : async Result<TokenMetadata> {
        switch (tokens.get(tokenId)) {
            case (?token) { #Ok(token) };
            case null { #Err(#TokenNotFound) };
        };
    };

    public query func balanceOf(owner : Principal) : async Result<Nat> {
        switch (owners.get(owner)) {
            case (?tokenIds) { #Ok(List.size(tokenIds)) };
            case null { #Err(#OwnerNotFound) };
        };
    };

    public query func totalSupply() : async Nat {
        tokens.size();
    };

    public query func ownerOf(tokenId : Nat) : async Result<Principal> {
        switch (tokens.get(tokenId)) {
            case (?token) {
                switch (token.owner) {
                    case (?owner) { #Ok(owner) };
                    case null { #Err(#OwnerNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };

    public query func ownerTokenIds(owner : Principal) : async Result<[Nat]> {
        switch (owners.get(owner)) {
            case (?tokenIds) { #Ok(List.toArray(tokenIds)) };
            case null { #Err(#OwnerNotFound) };
        };
    };

    public query func ownerTokenMetadata(owner : Principal) : async Result<[TokenMetadata]> {
        switch (owners.get(owner)) {
            case (?tokenIds) {
                let metadataArray = Array.map<Nat, TokenMetadata>(
                    List.toArray(tokenIds),
                    func(tId : Nat) : TokenMetadata {
                        switch (tokens.get(tId)) {
                            case (?m) { m };
                            case null { assert(false); loop {} }; // Unreachable
                        };
                    }
                );
                #Ok(metadataArray);
            };
            case null { #Err(#OwnerNotFound) };
        };
    };

    public query func operatorOf(tokenId : Nat) : async Result<Principal> {
        switch (tokens.get(tokenId)) {
            case (?token) {
                switch (token.operator) {
                    case (?operator) { #Ok(operator) };
                    case null { #Err(#OperatorNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };

    public query func operatorTokenIds(operator : Principal) : async Result<[Nat]> {
        switch (operators.get(operator)) {
            case (?tokenIds) { #Ok(List.toArray(tokenIds)) };
            case null { #Err(#OperatorNotFound) };
        };
    };

    public query func operatorTokenMetadata(operator : Principal) : async Result<[TokenMetadata]> {
        switch (operators.get(operator)) {
            case (?tokenIds) {
                let metadataArray = Array.map<Nat, TokenMetadata>(
                    List.toArray(tokenIds),
                    func(tId : Nat) : TokenMetadata {
                        switch (tokens.get(tId)) {
                            case (?m) { m };
                            case null { assert(false); loop {} }; // Unreachable
                        };
                    }
                );
                #Ok(metadataArray);
            };
            case null { #Err(#OperatorNotFound) };
        };
    };

    public shared ({ caller }) func setCustodians(custodians : [Principal]) : async () {
        if (not isCustodian(caller)) {
            throw Error.reject("Unauthorized: Caller is not a custodian");
        };
        canisterMetadata.custodians := custodians;
        ignore logTransaction(
            "setCustodians",
            caller,
            [Generic.Reserved.data(Principal.toBlob(caller))]
        );
    };

    public shared ({ caller }) func setLogo(logo : Text) : async () {
        if (not isCustodian(caller)) {
            throw Error.reject("Unauthorized: Caller is not a custodian");
        };
        canisterMetadata.logo := ?logo;
        ignore logTransaction("setLogo", caller, [Generic.Reserved.location(logo)]);
    };

    public shared ({ caller }) func setName(name : Text) : async () {
        if (not isCustodian(caller)) {
            throw Error.reject("Unauthorized: Caller is not a custodian");
        };
        canisterMetadata.name := ?name;
        ignore logTransaction("setName", caller, [Generic.Reserved.data(Text.encodeUtf8(name))]);
    };

    public shared ({ caller }) func setSymbol(symbol : Text) : async () {
        if (not isCustodian(caller)) {
            throw Error.reject("Unauthorized: Caller is not a custodian");
        };
        canisterMetadata.symbol := ?symbol;
        ignore logTransaction("setSymbol", caller, [Generic.Reserved.data(Text.encodeUtf8(symbol))]);
    };

    public query func custodians() : async [Principal] {
        canisterMetadata.custodians;
    };

    public query func logo() : async ?Text {
        canisterMetadata.logo;
    };

    public query func name() : async ?Text {
        canisterMetadata.name;
    };

    public query func symbol() : async ?Text {
        canisterMetadata.symbol;
    };

    public query func metadata() : async Metadata {
        {
            logo = canisterMetadata.logo;
            name = canisterMetadata.name;
            symbol = canisterMetadata.symbol;
            custodians = canisterMetadata.custodians;
            created_at = canisterMetadata.created_at;
            upgraded_at = canisterMetadata.upgraded_at;
        };
    };

    // --- ApprovalInterface Implementation ---

    public shared ({ caller }) func approve(operator : Principal, tokenId : Nat) : async Result<Nat> {
        if (caller == operator) {
            return #Err(#SelfApprove);
        };
        switch (tokens.get(tokenId)) {
            case (?token) {
                if (token.is_burned) {
                    return #Err(#BurnedNFT);
                };
                switch (token.owner) {
                    case (?owner) {
                        if (owner != caller and not isCustodian(caller)) {
                            return #Err(#Unauthorized);
                        };
                        let updatedToken = {
                            token with
                            operator = ?operator;
                        };
                        tokens.put(tokenId, updatedToken);
                        let currentOperatorTokens = switch (operators.get(operator)) {
                            case (?list) list;
                            case null List.nil<Nat>();
                        };
                        let updatedOperatorTokens = List.push(tokenId, currentOperatorTokens);
                        operators.put(operator, updatedOperatorTokens);
                        let txId = logTransaction(
                            "approve",
                            caller,
                            [
                                { key = "tokenId"; value = #NatContent(tokenId) },
                                { key = "operator"; value = #Principal(operator) }
                            ]
                        );
                        #Ok(txId);
                    };
                    case null { #Err(#OwnerNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };

    public shared ({ caller }) func setApprovalForAll(operator : Principal, toggle : Bool) : async Result<Nat> {
        if (caller == operator) {
            return #Err(#SelfApprove);
        };
        let currentOperators = switch (approvalForAll.get(caller)) {
            case (?list) list;
            case null List.nil<Principal>();
        };
        let alreadyApproved = List.some(currentOperators, func(p : Principal) : Bool { p == operator });
        let updatedOperators = if (toggle) {
            if (alreadyApproved) {
                currentOperators;
            } else {
                List.push(operator, currentOperators);
            };
        } else {
            List.filter(currentOperators, func(p : Principal) : Bool { p != operator });
        };
        approvalForAll.put(caller, updatedOperators);
        let txId = logTransaction(
            "setApprovalForAll",
            caller,
            [
                { key = "operator"; value = #Principal(operator) },
                { key = "toggle"; value = #BoolContent(toggle) }
            ]
        );
        #Ok(txId);
    };

    public query func isApprovedForAll(owner : Principal, operator : Principal) : async Result<Nat> {
        // In isApprovedForAll, replace lines around 451
        let operatorsList = switch (approvalForAll.get(owner)) {
            case (?list) list;
            case null List.nil<Principal>();
        };
        let isApproved = List.some(operatorsList, func(p : Principal) : Bool { p == operator });
        #Ok(if (isApproved) 1 else 0);
    };

    // --- TransferInterface Implementation ---

    public shared ({ caller }) func transfer(to : Principal, tokenId : Nat) : async Result<Nat> {
        if (caller == to) {
            return #Err(#SelfTransfer);
        };
        switch (tokens.get(tokenId)) {
            case (?token) {
                if (token.is_burned) {
                    return #Err(#BurnedNFT);
                };
                switch (token.owner) {
                    case (?owner) {
                        if (owner != caller and token.operator != ?caller and not isCustodian(caller)) {
                            return #Err(#Unauthorized);
                        };
                        // Check if token is part of an active loan
                        switch (loans.get(tokenId)) {
                            case (?loan) {
                                if (loan.isActive and not loan.isRepaid and not loan.isLiquidated) {
                                    return #Err(#Other("Token is locked in an active loan"));
                                };
                            };
                            case null {};
                        };
                        // Update token metadata
                        let updatedToken = {
                            token with
                            owner = ?to;
                            transferred_at = ?Nat64.fromNat(Int.abs(Time.now()));
                            transferred_by = ?caller;
                            operator = null;
                        };
                        tokens.put(tokenId, updatedToken);
                        // Update owners
                        let currentOwnerTokens = switch (owners.get(owner)) {
                            case (?list) list;
                            case null List.nil<Nat>();
                        };
                        let updatedOwnerTokens = List.filter(currentOwnerTokens, func(t : Nat) : Bool { t != tokenId });
                        // Clear operator
                        switch (token.operator) {
                            case (?op) {
                                let currentOpTokens = switch (operators.get(op)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedOpTokens = List.filter(currentOpTokens, func(t : Nat) : Bool { t != tokenId });
                                operators.put(op, updatedOpTokens);
                            };
                            case null {};
                        };
                        let txId = logTransaction(
                            "transfer",
                            caller,
                            [
                                { key = "tokenId"; value = #NatContent(tokenId) },
                                { key = "to"; value = #Principal(to) }
                            ]
                        );
                        #Ok(txId);
                    };
                    case null { #Err(#OwnerNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };

    public shared ({ caller }) func transferFrom(from : Principal, to : Principal, tokenId : Nat) : async Result<Nat> {
        if (from == to) {
            return #Err(#SelfTransfer);
        };
        switch (tokens.get(tokenId)) {
            case (?token) {
                if (token.is_burned) {
                    return #Err(#BurnedNFT);
                };
                switch (token.owner) {
                    case (?owner) {
                        if (owner != from) {
                            return #Err(#Unauthorized);
                        };
                        let isOperator = token.operator == ?caller;
                        let operatorsList = switch (approvalForAll.get(from)) {
                            case (?list) list;
                            case null List.nil<Principal>();
                        };
                        let isApprovedForAll = List.some(operatorsList, func(p : Principal) : Bool { p == caller });
                        if (not (isOperator or isApprovedForAll or isCustodian(caller))) {
                            return #Err(#Unauthorized);
                        };
                        // Check if token is part of an active loan
                        switch (loans.get(tokenId)) {
                            case (?loan) {
                                if (loan.isActive and not loan.isRepaid and not loan.isLiquidated) {
                                    return #Err(#Other("Token is locked in an active loan"));
                                };
                            };
                            case null {};
                        };
                        // Update token metadata
                        let updatedToken = {
                            token with
                            owner = ?to;
                            transferred_at = ?Nat64.fromNat(Int.abs(Time.now()));
                            transferred_by = ?caller;
                            operator = null;
                        };
                        tokens.put(tokenId, updatedToken);
                        // Update owners
                        // In transferFrom, replace lines around 568
                        let currentFromTokens = switch (owners.get(from)) {
                            case (?list) list;
                            case null List.nil<Nat>();
                        };
                        let updatedFromTokens = List.filter(currentFromTokens, func(t : Nat) : Bool { t != tokenId });
                        owners.put(from, updatedFromTokens);
                        let currentToTokens = switch (owners.get(to)) {
                            case (?list) list;
                            case null List.nil<Nat>();
                        };
                        let updatedToTokens = List.push(tokenId, currentToTokens);
                        owners.put(to, updatedToTokens);
                        // Clear operator
                        switch (token.operator) {
                            case (?op) {
                                // In transferFrom, replace lines around 583
                                let currentToTokens = switch (owners.get(to)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedToTokens = List.push(tokenId, currentToTokens);
                                owners.put(to, updatedToTokens);
                            };
                            case null {};
                        };
                        let txId = logTransaction(
                            "transferFrom",
                            caller,
                            [
                                { key = "from"; value = #Principal(from) },
                                { key = "to"; value = #Principal(to) },
                                { key = "tokenId"; value = #NatContent(tokenId) }
                            ]
                        );
                        #Ok(txId);
                    };
                    case null { #Err(#OwnerNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };
    
    
    public query func getTokenById(id : Nat) : async ?TokenMetadata {
        tokens.get(id)
    };
    // --- MintInterface Implementation ---

    private var nextTokenId : Nat = 1;

    public shared ({ caller }) func mint(to : Principal, properties : [Generic.Property]) : async    Result<Nat> {
        if (not isCustodian(caller)) {
            return #Err(#Unauthorized);
        };

        // Validate properties
        let hasName = Array.find<Generic.Property>(properties, func(p) { p.key == "name" }) != null;
        let hasImage = Array.find<Generic.Property>(properties, func(p) { p.key == "image" }) != null;
        if (not hasName or not hasImage) {
            return #Err(#Other("Name and image are required"));
        };

        let tokenId = nextTokenId;
        switch (tokens.get(tokenId)) {
            case (?_) { return #Err(#ExistedNFT) };
            case null {
                let token : TokenMetadata = {
                    transferred_at = null;
                    transferred_by = null;
                    owner = ?to;
                    operator = null;
                    properties = properties;
                    is_burned = false;
                    token_identifier = tokenId;
                    burned_by = null;
                    burned_at = null;
                    minted_at = Nat64.fromNat(Int.abs(Time.now()));
                    minted_by = caller;
                };
                tokens.put(tokenId, token);
                let currentToTokens = switch (owners.get(to)) {
                    case (?list) list;
                    case null List.nil<Nat>();
                };
                let updatedToTokens = List.push(tokenId, currentToTokens);
                owners.put(to, updatedToTokens);
                let txId = logTransaction(
                    "mint",
                    caller,
                    [
                        { key = "to"; value = #Principal(to) },
                        { key = "tokenId"; value = #NatContent(tokenId) }
                    ]
                );
                nextTokenId += 1;
                #Ok(txId);
            };
        };
    };
    public query func getNextTokenId() : async Nat {
        nextTokenId
    };

    // --- BurnInterface Implementation ---

    public shared ({ caller }) func burn(tokenId : Nat) : async Result<Nat> {
        switch (tokens.get(tokenId)) {
            case (?token) {
                if (token.is_burned) {
                    return #Err(#BurnedNFT);
                };
                switch (token.owner) {
                    case (?owner) {
                        if (owner != caller and not isCustodian(caller)) {
                            return #Err(#Unauthorized);
                        };
                        // Check if token is part of an active loan
                        switch (loans.get(tokenId)) {
                            case (?loan) {
                                if (loan.isActive and not loan.isRepaid and not loan.isLiquidated) {
                                    return #Err(#Other("Token is locked in an active loan"));
                                };
                            };
                            case null {};
                        };
                        let updatedToken = {
                            token with
                            owner = null;
                            operator = null;
                            is_burned = true;
                            burned_at = ?Nat64.fromNat(Int.abs(Time.now()));
                            burned_by = ?caller;
                        };
                        tokens.put(tokenId, updatedToken);
                        let currentOwnerTokens = switch (owners.get(owner)) {
                            case (?list) list;
                            case null List.nil<Nat>();
                        };
                        let updatedOwnerTokens = List.filter(currentOwnerTokens, func(t : Nat) : Bool { t != tokenId });
                        owners.put(owner, updatedOwnerTokens);
                        switch (token.operator) {
                            case (?op) {
                                // In acceptLoan, replace lines around 685
                                let currentBorrowerTokens = switch (owners.get(caller)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedBorrowerTokens = List.push(tokenId, currentBorrowerTokens);
                                owners.put(caller, updatedBorrowerTokens);
                            };
                            case null {};
                        };
                        let txId = logTransaction(
                            "burn",
                            caller,
                            [{ key = "tokenId"; value = #NatContent(tokenId) }]
                        );
                        #Ok(txId);
                    };
                    case null { #Err(#OwnerNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };

    // --- HistoryInterface Implementation ---

    public query func transaction(txId : Nat) : async Result<TxEvent> {
        switch (transactions.get(txId)) {
            case (?tx) { #Ok(tx) };
            case null { #Err(#TxNotFound) };
        };
    };

    public query func totalTransactions() : async Nat {
        transactions.size();
    };

    // --- Lending Protocol Implementation ---

    public shared ({ caller }) func createLoan(
        tokenId : Nat,
        amount : Nat,
        interestRate : Nat,
        duration : Int
        ) : async Result<Nat> {
        switch (tokens.get(tokenId)) {
            case (?token) {
                if (token.is_burned) {
                    return #Err(#BurnedNFT);
                };
                switch (token.owner) {
                    case (?owner) {
                        if (owner != caller) {
                            return #Err(#Other("Unoruthorized: Caller is not the owner of the token"#  Nat.toText(tokenId) # "owner:" # Principal.toText(owner) # "caller:" # Principal.toText(caller))); 
                        };
                        switch (loans.get(tokenId)) {
                            case (?loan) {
                                if (loan.isActive and not loan.isRepaid and not loan.isLiquidated) {
                                    return #Err(#Other("Token is already in an active loan"));
                                };
                            };
                            case null {};
                        };
                        let loan : Loan = {
                            tokenId = tokenId;
                            lender = caller;
                            borrower = caller; // Initially, lender holds the token
                            amount = amount;
                            interestRate = interestRate;
                            duration = duration;
                            startTime = Time.now();
                            isActive = true;
                            isRepaid = false;
                            isLiquidated = false;
                        };
                        loans.put(tokenId, loan);
                        let txId = logTransaction(
                            "createLoan",
                            caller,
                            [
                                { key = "tokenId"; value = #NatContent(tokenId) },
                                { key = "amount"; value = #NatContent(amount) },
                                { key = "interestRate"; value = #NatContent(interestRate) },
                                { key = "duration"; value = #IntContent(duration) }
                            ]
                        );
                        #Ok(txId);
                    };
                    case null { #Err(#OwnerNotFound) };
                };
            };
            case null { #Err(#TokenNotFound) };
        };
    };

    public shared ({ caller }) func acceptLoan(tokenId : Nat) : async Result<Nat> {
        switch (loans.get(tokenId)) {
            case (?loan) {
                if (not loan.isActive or loan.isRepaid or loan.isLiquidated) {
                    return #Err(#Other("Loan is not active"));
                };
                switch (tokens.get(tokenId)) {
                    case (?token) {
                        if (token.is_burned) {
                            return #Err(#BurnedNFT);
                        };
                        switch (token.owner) {
                            case (?owner) {
                                if (owner != loan.lender) {
                                    return #Err(#Unauthorized);
                                };
                                // Transfer NFT to borrower (caller)
                                let updatedToken = {
                                    token with
                                    owner = ?caller;
                                    transferred_at = ?Nat64.fromNat(Int.abs(Time.now()));
                                    transferred_by = ?loan.lender;
                                    operator = null;
                                };
                                tokens.put(tokenId, updatedToken);
                                let currentLenderTokens = switch (owners.get(loan.lender)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedLenderTokens = List.filter(currentLenderTokens, func(t : Nat) : Bool { t != tokenId });
                                let currentBorrowerTokens = switch (owners.get(caller)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedBorrowerTokens = List.push(tokenId, currentBorrowerTokens);
                                // Update loan
                                let updatedLoan = {
                                    loan with
                                    borrower = caller;
                                    startTime = Time.now();
                                };
                                loans.put(tokenId, updatedLoan);
                                let txId = logTransaction(
                                    "acceptLoan",
                                    caller,
                                    [
                                        { key = "tokenId"; value = #NatContent(tokenId) },
                                        { key = "lender"; value = #Principal(loan.lender) }
                                    ]
                                );
                                #Ok(txId);
                            };
                            case null { #Err(#OwnerNotFound) };
                        };
                    };
                    case null { #Err(#TokenNotFound) };
                };
            };
            case null { #Err(#Other("No loan found for token")) };
        };
    };

    public shared ({ caller }) func repayLoan(tokenId : Nat) : async Result<Nat> {
        switch (loans.get(tokenId)) {
            case (?loan) {
                if (not loan.isActive or loan.isRepaid or loan.isLiquidated) {
                    return #Err(#Other("Loan is not active or already repaid/liquidated"));
                };
                if (loan.borrower != caller) {
                    return #Err(#Unauthorized);
                };
                switch (tokens.get(tokenId)) {
                    case (?token) {
                        if (token.is_burned) {
                            return #Err(#BurnedNFT);
                        };
                        switch (token.owner) {
                            case (?owner) {
                                if (owner != caller) {
                                    return #Err(#Unauthorized);
                                };
                                // Transfer NFT back to lender
                                let updatedToken = {
                                    token with
                                    owner = ?loan.lender;
                                    transferred_at = ?Nat64.fromNat(Int.abs(Time.now()));
                                    transferred_by = ?caller;
                                    operator = null;
                                };
                                tokens.put(tokenId, updatedToken);
                                let currentBorrowerTokens = switch (owners.get(caller)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedBorrowerTokens = List.filter(currentBorrowerTokens, func(t : Nat) : Bool { t != tokenId });
                                let currentLenderTokens = switch (owners.get(loan.lender)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedLenderTokens = List.push(tokenId, currentLenderTokens);
                                // Update loan
                                let updatedLoan = {
                                    loan with
                                    isActive = false;
                                    isRepaid = true;
                                };
                                loans.put(tokenId, updatedLoan);
                                let txId = logTransaction(
                                    "repayLoan",
                                    caller,
                                    [{ key = "tokenId"; value = #NatContent(tokenId) }]
                                );
                                #Ok(txId);
                            };
                            case null { #Err(#OwnerNotFound) };
                        };
                    };
                    case null { #Err(#TokenNotFound) };
                };
            };
            case null { #Err(#Other("No loan found for token")) };
        };
    };

    public shared ({ caller }) func liquidateLoan(tokenId : Nat) : async Result<Nat> {
        switch (loans.get(tokenId)) {
            case (?loan) {
                if (not loan.isActive or loan.isRepaid or loan.isLiquidated) {
                    return #Err(#Other("Loan is not active or already repaid/liquidated"));
                };
                if (loan.lender != caller and not isCustodian(caller)) {
                    return #Err(#Unauthorized);
                };
                // Check if loan duration has expired
                let currentTime = Time.now();
                if (currentTime < loan.startTime + loan.duration) {
                    return #Err(#Other("Loan duration has not expired"));
                };
                switch (tokens.get(tokenId)) {
                    case (?token) {
                        if (token.is_burned) {
                            return #Err(#BurnedNFT);
                        };
                        switch (token.owner) {
                            case (?owner) {
                                // Transfer NFT back to lender
                                let updatedToken = {
                                    token with
                                    owner = ?loan.lender;
                                    transferred_at = ?Nat64.fromNat(Int.abs(Time.now()));
                                    transferred_by = ?caller;
                                    operator = null;
                                };
                                tokens.put(tokenId, updatedToken);
                                let currentOwnerTokens = switch (owners.get(owner)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedOwnerTokens = List.filter(currentOwnerTokens, func(t : Nat) : Bool { t != tokenId });
                                let currentLenderTokens = switch (owners.get(loan.lender)) {
                                    case (?list) list;
                                    case null List.nil<Nat>();
                                };
                                let updatedLenderTokens = List.push(tokenId, currentLenderTokens);
                                // Update loan
                                let updatedLoan = {
                                    loan with
                                    isActive = false;
                                    isLiquidated = true;
                                };
                                loans.put(tokenId, updatedLoan);
                                let txId = logTransaction(
                                    "liquidateLoan",
                                    caller,
                                    [{ key = "tokenId"; value = #NatContent(tokenId) }]
                                );
                                #Ok(txId);
                            };
                            case null { #Err(#OwnerNotFound) };
                        };
                    };
                    case null { #Err(#TokenNotFound) };
                };
            };
            case null { #Err(#Other("No loan found for token")) };
        };
    };

    public query func getLoan(tokenId : Nat) : async Result<Loan> {
        switch (loans.get(tokenId)) {
            case (?loan) { #Ok(loan) };
            case null { #Err(#Other("No loan found for token")) };
        };
    };
};