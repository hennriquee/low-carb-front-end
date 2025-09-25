import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./footer.css";
import {
  lowCarbInstagramLink,
  lowCarbWhatsAppLink,
  myGithubLink,
  myWhatsAppLink,
} from "../../assets/links";

const Footer = () => {
  const { pathname } = useLocation();
  return (
    <footer
      style={{
        display:
          pathname.includes("/adm") || pathname.includes("/login")
            ? "none"
            : "flex",
      }}
    >
      <div className="footer-container">
        <div className="footer-title">
          <h3>
            <span>&copy; 2025</span> <br />
            Low Carb Delícias.
          </h3>
        </div>
        <div className="footer-links">
          <Link to={lowCarbInstagramLink} target="_blank">
            <i className="bx bxl-instagram"></i>
          </Link>

          <Link
            to={lowCarbWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bx bxl-whatsapp"></i>
          </Link>
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-title">
          <h3>
            <span> Developed by</span>
            <br />
            Bruno Henrique.
          </h3>
        </div>

        <div className="footer-links">
          <Link to={myGithubLink} target="_blank">
            <i className="bx bxl-github"></i>
          </Link>

          <Link to={myWhatsAppLink} target="_blank" rel="noopener noreferrer">
            <i className="bx bxl-whatsapp"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
