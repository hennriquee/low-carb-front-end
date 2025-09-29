import React from "react";
import "./product-card.css";
import { Link, useNavigate } from "react-router-dom";
import "../../pages/Catalog/catalog.css";

const ProductCard = ({
  id,
  category,
  price,
  title,
  zerogluten,
  zerolactose,
  zerosugar,
  images,
}) => {
  const navigate = useNavigate();
  return (
    <div className="product__card">
      <div className="product__card__img">
        <img
          onClick={() => navigate(`/catalogo/produto/${id}`)}
          src={images[0]}
          alt="sem imagem"
        />
      </div>

      <div className="product__card__content">
        <h5 className="product__card__title">{title}</h5>
        <div className="product__card__zeros">
          <p className={zerolactose ? "green__text" : "crossed__text"}>
            • 0% Lactose
          </p>

          <p className={zerogluten ? "green__text" : "crossed__text"}>
            • 0% Glúten
          </p>

          <p className={zerosugar ? "green__text" : "crossed__text"}>
            • 0% Açúcar
          </p>
        </div>
        <hr />
        <p className="price">
          A partir de:{" "}
          <span className="price__number">
            {Math.min(...price.map((p) => p.value)).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </p>

        <Link
          to={`/catalogo/produto/${id}`}
          className="learn__more__btn brown__btn"
        >
          Saiba mais
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
