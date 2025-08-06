import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Result "mo:base/Result";
import Types "types";
import DIP721 "dip721_interface";
import Generic "Generic";

// actor NFTLocker {
    // Using your defined types
    type TokenMetadata = DIP721.TokenMetadata;
    type Property = Generic.Property;
    type NFT = Types.NFT;
    type Result<T, E> = Result.Result<T, E>;

    // Storage for locked NFTs: (user principal → NFT list)
    private var lockedNFTs = HashMap.HashMap<Principal, [NFT]>(10, Principal.equal, Principal.hash);
    
    // Lock DIP721 NFT
//     public shared(msg) func lock_dip721(
//         nftCanister: Principal,
//         tokenId: Nat
//     ) : async Result<(), Text> {
//         // Create actor reference using your interface
//         let dip721 : DIP721.BasicInterface = actor(Principal.toText(nftCanister));
        
//         // Verify ownership
//         switch (await dip721.ownerOf(tokenId)) {
//             case (#Ok(owner)) {
//                 if (owner != msg.caller) {
//                     return #err("Caller is not the owner");
//                 };
//             };
//             case (#Err(e)) { return #err("Ownership check failed") };
//         };

//         // Transfer NFT to locker
//         switch (await dip721.transferFrom(msg.caller, Principal.fromActor(NFTLocker), tokenId)) {
//             case (#Ok(_)) {
//                 // Add to vault
//                 let nft : NFT = {
//                     canisterId = nftCanister;
//                     tokenId = Nat.toText(tokenId);
//                     standard = #DIP721;
//                 };
//                 _addToVault(msg.caller, nft);
//                 #ok()
//             };
//             case (#Err(e)) { #err("Transfer failed") };
//         };
//     };

//     // Internal helper
//     private func _addToVault(user: Principal, nft: NFT) {
//         let current = switch (lockedNFTs.get(user)) {
//             case (?nfts) nfts;
//             case null [];
//         };
//         lockedNFTs.put(user, Array.append(current, [nft]));
//     };

//     // Release NFT (only callable by LoanManager)
//     public shared(msg) func releaseNFT(user: Principal, nft: NFT) : async () {
//         assert(msg.caller == Principal.fromText("loan-manager-principal"));
//         // Transfer back to user logic
//     };
// // }