import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import homeImage from "/home-img.png";
import { Link, BrowserRouter, Route} from 'react-router-dom';
import Minter from "./Minter";
import { Switch } from "react-router-dom";
import Gallery from "./Gallery";
import { opend_backend } from "../../declarations/opend_backend";
import CURRENT_ID from "./main";

function Header() {
  const [userNFTs, setUserNFTs] = useState();

  async function getNFTs(){
    console.log(CURRENT_ID);

    const ownedNFTs = await opend_backend.getOwnedNFTs(CURRENT_ID);
    console.log(ownedNFTs)
    setUserNFTs(<Gallery title="Collections" ids={ownedNFTs} />);
  }

  useEffect(() => {
    getNFTs()
  }, [])

  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <h5 className="Typography-root header-logo-text">OpenD</h5>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>

            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">
                Discover
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">
                Minter
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collections">
                My NFTs
              </Link>
            </button>
          </div>
        </header>
      </div>
      <Switch>
        <Route exact path="/">
          <img src={homeImage} />
        </Route>
        <Route path="/minter">
          <Minter />
        </Route>
        <Route path="/collections">
          {userNFTs}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
