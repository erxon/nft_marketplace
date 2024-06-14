import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/nft";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend_backend } from "../../declarations/opend_backend";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();

  const id = Principal.fromText(props.id);

  const localhost = "http://localhost:3000/";
  const agent = new HttpAgent({ host: localhost });

  agent.fetchRootKey();

  let NFTActor;

  async function loadNFT() {
    NFTActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    });

    const name = await NFTActor.getName();
    const principal = await NFTActor.getPrincipal();
    const imageData = await NFTActor.getContent();

    const imageContent = new Uint8Array(imageData);
    const imageBlob = new Blob([imageContent.buffer], { type: 'image/png' });
    const imageURL = URL.createObjectURL(imageBlob);


    setName(name);
    setOwner(principal.toText());
    setImage(imageURL);
    setButton(<Button handleClick={handleSell} text={"Sell"} />);
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;

  function handleSell(){
    setPriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => (price = e.target.value)}
    />);
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function sellItem(){
    const listingResult = await opend_backend.listItem(id, Number(price))
    console.log("Result: " + listingResult);
    if (listingResult === "Success"){
      const openDId = await opend_backend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      console.log("Transfer: ", transferResult);
    }
  }

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
