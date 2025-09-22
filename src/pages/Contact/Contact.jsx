import React from "react";
import { Link } from "react-router-dom";
import "./contact.css";

const Contact = () => {
  return (
    <div className="contact__page">
      <div className="contact__container">
        <h1>Contato</h1>
        <div className="contact-boxes">
          <Link
            target="_blank"
            className="contact__box email-contact__box"
            to="mailto:lowcarbedelicias@gmail.com?subject=Interesse%20em%20Im%C3%B3vel&body=Ol%C3%A1%2C%20tenho%20interesse%20nos%20servi%C3%A7os%20da%20Coimbra%20Im%C3%B3veis%2C%20poderia%20entrar%20em%20contato%20comigo%3F"
          >
            <div className="contact__box-title">
              <i className="bx bx-envelope"></i>
              <span>E-mail</span>
            </div>
            <p>lowcarbedelicias@gmail.com</p>
          </Link>
          <div className="contact__line__boxes">
            <Link
              target="_blank"
              className="contact__box instagram-contact__box"
              to="https://www.instagram.com/lowcarbedelicias/"
            >
              <div className="contact__box-title">
                <i className="bx bxl-instagram"></i>
                <span>Instagram</span>
              </div>
              <p>@lowcarbedelicias</p>
            </Link>
            <Link
              target="_blank"
              to="https://wa.me/5534998820464?text=Olá,+tenho+interesse+nos+produtos+da+Low+Carb+&+Delícias!"
              className="contact__box wpp-contact__box"
            >
              <div className="contact__box-title">
                <i className="bx bxl-whatsapp"></i>
                <span>WhatsApp</span>
              </div>
              <p>+55 (34) 9882-0464</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
