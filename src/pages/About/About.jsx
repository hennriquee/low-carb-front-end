import React from "react";
import "./about.css";
import MateusLuanaImg from "../../assets/images/luciana.png";

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about__container">
        <div className="about__img">
          <img draggable="false" src={MateusLuanaImg} alt="" />
        </div>
        <div className="about__content">
          <h1>Sobre mim</h1>
          <p>
            Iniciando em 2024 em Uberlândia, a<span>Low Carb & Delícias</span> é
            uma empresa comprometida com a excelência, integridade e
            transparência. Nossa equipe prepara com dedicação comidas low carb
            saborosas, criativas e saudáveis, valorizando a confiança, o
            respeito e o cuidado com cada cliente. Meu objetivo é transformar
            cada refeição em uma experiência única de prazer e bem-estar.{" "}
            <span>A sua saúde é o que mais importa!</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
