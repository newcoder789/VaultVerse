// import M "mo:matchers/Matchers";
// import T "mo:matchers/Testable";
// import Suite "mo:matchers/Suite";
// import Metadata "../src/core_protocol_canister/MetadataParser";
// import DIP721 "../src/core_protocol_canister/dip721_interface";

// let completeTokenMetadata : DIP721.TokenMetadata = {
//     transferred_at = null;
//     transferred_by = null;
//     owner = null;
//     operator = null;
//     properties = [
//         {name = "name"; value = "Test NFT"},
//         {name = "description"; value = "A test NFT"},
//         {name = "image"; value = "test.png"},
//         {name = "Background"; value = "Blue"},
//         {name = "Rarity"; value = "Epic"}
//     ];
//     is_burned = false;
//     token_identifier = 1;
//     burned_at = null;
//     burned_by = null;
//     minted_at = 0;
//     minted_by = Principal.fromText("aaaaa-aa");
// };

// let suite = Suite.suite("Metadata Tests", [
//     Suite.test("Extracts name field",
//         Metadata.extractDIP721Metadata(completeTokenMetadata).name,
//         M.equals(T.text("Test NFT"))
//     ),
//     Suite.test("Extracts image field",
//         Metadata.extractDIP721Metadata(completeTokenMetadata).image,
//         M.equals(T.text("test.png"))
//     ),
//     Suite.test("Converts properties to attributes",
//         Metadata.extractDIP721Metadata(completeTokenMetadata).attributes,
//         M.equals(T.array([
//             T.record({
//                 trait_type = T.text("name");
//                 value = T.text("Test NFT")
//             }),
//             T.record({
//                 trait_type = T.text("description");
//                 value = T.text("A test NFT")
//             }),
//             T.record({
//                 trait_type = T.text("image");
//                 value = T.text("test.png")
//             }),
//             T.record({
//                 trait_type = T.text("Background");
//                 value = T.text("Blue")
//             }),
//             T.record({
//                 trait_type = T.text("Rarity");
//                 value = T.text("Epic")
//             })
//         ]))
//     )
// ]);

// Suite.run(suite);



    // "metadata_tests": {
    //   "main": "test/test_metadata.mo",
    //   "type": "motoko"
    // },