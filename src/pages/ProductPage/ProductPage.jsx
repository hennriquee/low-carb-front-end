import React, { useState, useEffect } from "react";
import "./product-page.css";
import { api } from "../../services/api";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import ReturnBtn from "../../components/ReturnBtn/ReturnBtn";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [imageIdx, setImageIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const url = window.location.href;

  const getProduct = async () => {
    setProduct((await api.get(`/produtos/${id}`)).data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  const changeImage = (idx) => {
    if (!product?.images) return;
    const total = product.images.length;
    // loop infinito
    const newIndex = (idx + total) % total;
    setImageIdx(newIndex);
  };

  const copyID = () => {
    navigator.clipboard
      .writeText(product?.id)
      .then(() => {
        toast.success("ID copiado!");
      })
      .catch((err) => {
        toast.error("Erro ao copiar: ", err);
      });
  };

  // Funções de swipe de imagem
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      // arrastou para a esquerda → próxima imagem
      changeImage(imageIdx + 1);
    } else if (diff < -50) {
      // arrastou para a direita → imagem anterior
      changeImage(imageIdx - 1);
    }

    setTouchStart(null);
  };
  // Funções de swipe de imagem

  return (
    <section className="product__page__main">
      <Toaster />
      <ReturnBtn />
      <p onClick={copyID} className="product__page__id">
        <FontAwesomeIcon icon={faCopy} /> ID: {product?.id}
      </p>
      <div
        className="product__images__container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {product ? (
          <div className="destaque__img">
            <img src={product?.images?.[imageIdx] || "/placeholder.jpg"} />
          </div>
        ) : (
          <p className="loading__text">Carregando informações...</p>
        )}
        <div className="tiny__images__container">
          {product?.images?.map((img, idx) => (
            <div
              key={idx}
              className={`tiny__img ${idx === imageIdx ? "active" : ""}`}
            >
              <img
                onClick={() => changeImage(idx)}
                src={img}
                alt={`Imagem ${idx + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="product__content__container">
        <h1 className="product__title">
          {product?.title}{" "}
          {product?.category === "Bolos & Tortas"
            ? "🍰"
            : product?.category === "Biscoitos & Cookies"
            ? "🍪"
            : product?.category === "Sobremesas & Doces"
            ? "🧁"
            : product?.category === "Salgados & Lanches"
            ? "🥟"
            : product?.category === "Pães & Roscas"
            ? "🥯"
            : ""}
        </h1>
        <p className="product__content__category">◉ {product?.category}</p>
        <p className="product__content__text">{product?.text}</p>
        <p className="product__content__price">{product?.price}</p>
        {product && (
          <div className="product__page__btns">
            <Link
              className="product__page__btn wpp__btn"
              to={`https://wa.me/5534991821068?text=Olá,+tenho+interesse+neste+imóvel:%0A${url}`}
              target="_blank"
            >
              <i className="bx bxl-whatsapp"></i>
              <span>WhatsApp</span>
            </Link>

            <p className="or__btn">ou</p>

            <Link
              className="product__page__btn email__btn"
              to={`mailto:coimbraimoveisuberlandia@gmail.com?subject=Interesse%20em%20imóvel&body=Olá,%20tenho%20interesse%20neste%20imóvel:%0A${url}`}
            >
              <i className="bx bx-envelope"></i>E-mail
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductPage;
