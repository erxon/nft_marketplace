import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {

    private let itemName = name;
    private var nftOwner = owner;
    private let imageBytes = content;

    Debug.print("It works");

    public query func getName() : async Text {
        return itemName;
    };

    public query func getPrincipal() : async Principal {
        return nftOwner;
    };

    public query func getContent() : async [Nat8] {
        return imageBytes;
    };

    public query func getCanisterId() : async Principal {
        return Principal.fromActor(this);
    };

    public shared(msg) func transferOwnership(newOwner: Principal) : async Text {
        
        if(msg.caller == nftOwner) {
            nftOwner := newOwner;
            return "Success";
        } else {
            return "Error: Not Initiated By NFT Owner"
        }
    }
}