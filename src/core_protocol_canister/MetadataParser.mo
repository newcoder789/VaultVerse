import DIP721 "dip721_interface";
import Types "types";
import Array "mo:base/Array";
import Generic "Generic";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import Principal "mo:base/Principal";


module {

    public type Attribute = Types.Attribute;
    public type NFTMetadata = Types.NFTMetadata;
    public type TokenMetadata = DIP721.TokenMetadata;
    public type Property = Generic.Property;
    public type Value = Generic.Value;
    // public type NormalizedMetadata = Types.NormalizedMetadata;


    // Helper to convert Generic.Value to Text
    func valueToText(v : Value) : Text {
        switch (v) {
            case (#TextContent(t)) t;
            case (#NatContent(n)) Nat.toText(n);
            case (#IntContent(i)) Int.toText(i);
            case (#BoolContent(b)) Bool.toText(b);
            case (#Principal(p)) Principal.toText(p);
            case _ ""; // Default for other types
        }
    };

    public func extractDIP721Metadata(
        metadata: TokenMetadata
    ) : NFTMetadata {
        // Convert properties to attributes
        let attributes = Array.map<Property, Attribute>(
            metadata.properties,
            func(prop) = { 
                trait_type = prop.key; 
                value = valueToText(prop.value);
            }
        );
        
        // Extract standard fields
        var name = "";
        var description = "";
        var image = "";
        
        for (prop in metadata.properties.vals()) {
            let propValue = valueToText(prop.value);
            switch (prop.key) {
                case "name" { name := propValue };
                case "description" { description := propValue };
                case "image" { image := propValue };
                case _ {};
            };
        };
        
    {
        name;
        description;
        image;
        attributes;
        collection = null;
        tokenId = null;
    };
    
    // public func parseHttpResponse(body: Blob) : ?NFTMetadata {
    //     // Implement your HTTP response parsing here
    //     null // Placeholder
    // };
};

}