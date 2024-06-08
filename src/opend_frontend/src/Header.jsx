import React from "react";
import logo from "/logo.png";
import homeImage from "/home-img.png";
import { Link, BrowserRouter, Route} from 'react-router-dom';
import Minter from "./Minter";
import { Switch } from "react-router-dom";
import Gallery from "./Gallery";

function Header() {
  return (
    <BrowserRouter>
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
          <Gallery title="Collections" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Header;
