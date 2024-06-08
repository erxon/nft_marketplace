import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import NFTActorClass "./nft";

actor OpenD {
  public shared (msg) func mint(image : [Nat8], name : Text) : async Principal {
    let owner : Principal = msg.caller;

    Debug.print(debug_show(Cycles.balance()));
    Cycles.add<system>(100_500_000_000);
    let newNFT = await NFTActorClass.NFT(name, owner, image);

    let newNFTPrincipal = await newNFT.getCanisterId();

    Debug.print(debug_show(Cycles.balance()));

    return newNFTPrincipal;
  };
};
