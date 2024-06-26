import React, { useEffect, useState } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/nft";
import { idlFactory as tokenIdlFactory } from "../../declarations/eton_token_backend";
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opend_backend } from "../../declarations/opend_backend";
import CURRENT_ID from "./main";
import PriceLabel from "./PriceLabel";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [listingStatus, setListingStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

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
    setImage(imageURL);
    setOwner(principal.toText());

    if (props.role === "collection") {
      const nftIsListed = await opend_backend.isListed(id);

      if (nftIsListed) {
        setBlur({ filter: "blur(4px)" });
        setOwner("OpenD");
        setListingStatus("Listed")
      } else {
        setButton(<Button handleClick={handleSell} text={"Sell"} />);
      }
    } else if (props.role === "discover") {
      const originalOwner = await opend_backend.getOriginalOwner(Principal.fromText(props.id));

      if (originalOwner.toString() !== CURRENT_ID.toString()) {

        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await opend_backend.getListedNFTPrice(Principal.fromText(props.id));
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />)
    }
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;

  function handleSell() {
    setPriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => (price = e.target.value)}
    />);
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  }

  async function handleBuy() {
    console.log("Buy")
    setLoaderHidden(false);

    const tokenActor = Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("by6od-j4aaa-aaaaa-qaadq-cai")
    });

    const sellerId = await opend_backend.getOriginalOwner(Principal.fromText(props.id));
    const itemPrice = await opend_backend.getListedNFTPrice(Principal.fromText(props.id));

    const result = await tokenActor.transfer(sellerId, itemPrice);

    if (result === "Success") {
      const transferResult = await opend_backend.completePurchase(
        Principal.fromText(props.id),
        sellerId,
        CURRENT_ID
      );
      console.log("purchase: " + transferResult);
      setLoaderHidden(true)
      setDisplay(false);
    }
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false)
    const listingResult = await opend_backend.listItem(id, Number(price))
    console.log("Result: " + listingResult);
    if (listingResult === "Success") {
      const openDId = await opend_backend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnership(openDId);
      console.log("Transfer: ", transferResult);
      if (transferResult === "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenD")
      }
    }

  }

  return (
    <div style={{ display: shouldDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div className="lds-ellipsis" hidden={loaderHidden}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {listingStatus}</span>
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
