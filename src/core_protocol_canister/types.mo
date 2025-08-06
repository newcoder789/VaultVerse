module {
  public type HttpRequest = {
    method : Text;
    url : Text;
    headers : [(Text, Text)];
    body : Blob;
  };

  public type HttpResponse = {
    status_code : Nat16;
    headers : [(Text, Text)];
    body : Blob;
  };
  public type NFT = {
      canisterId: Principal;
      tokenId: Text;
      standard: { #DIP721; #EXT };
  };

  public type Attribute = {
      trait_type: Text;
      value: Text;
  };
  public type NFTMetadata = {
        name: Text;
        description: Text;
        image: Text;
        attributes: [Attribute];
        collection: ?Text;
        tokenId : ?Nat; 
    };
  public type NormalizedMetadata = {
    nftId : Text;
    imageUrl : Text;
    attributes : [(Text, Text)];
    riskScore : Float;
    isEligible : Bool;
  };

}
