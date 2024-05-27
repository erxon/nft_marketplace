import Debug "mo:base/Debug";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) {

    let itemName = name;
    let nftOwner = owner;
    let imageBytes = content;

    Debug.print("It works");
}