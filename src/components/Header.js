import React from "react";
import logo from "../images/banner.jpg";
import "../styles/Header.css";
class Header extends React.Component {
  render() {
    return (
      <div className="filtro">
        <div className="container-fluid">
            <img className="Navbar__brand-logo img-fluid" src={logo} alt="Logo" style={{ width: "90rem", height: "150px" }}/>         
        </div>
      </div>
    );
  }
}

export default Header;