import React, { useState, useEffect, useRef } from "react";
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
  const textRef = useRef();
  const priceRef = useRef();
  const selectSizeRef = useRef();
  const [selectedSize, setSelectedSize] = useState();

  const [temMais, setTemMais] = useState(false);
  const [expandido, setExpandido] = useState(false);

  const handleReadMore = () => {
    setTemMais((prev) => !prev);
    setExpandido((prev) => {
      const novoValor = !prev;
      textRef.current.style.overflow = novoValor ? "auto" : "hidden";
      return novoValor;
    });
    priceRef.current.style.marginTop = "48px";
  };

  const getProduct = async () => {
    setProduct((await api.get(`/produtos/${id}`)).data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  useEffect(() => {
    if (product?.price?.length > 0) {
      setSelectedSize(product.price[0].size);
    }
  }, [product]);

  useEffect(() => {
    if (textRef.current) {
      // Verifica se o conteúdo do texto passa do tamanho visível
      setTemMais(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [product]);

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

  const handleSelectSize = () => {
    setSelectedSize(selectSizeRef.current.value);
  };
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
        <p className="product__content__category">
          {product ? `◉ ${product?.category}` : ""}
        </p>
        <div ref={textRef} className="product__content__text">
          {product?.text}
        </div>
        {temMais && (
          <p onClick={handleReadMore} className="read__more">
            ...Ler mais
          </p>
        )}

        <div className="product__content__price">
          <div className="size__select">
            <label htmlFor="size">Tamanho:</label>

            <select
              name="size"
              id="size"
              ref={selectSizeRef}
              onChange={handleSelectSize}
            >
              {product?.price?.map((p) => {
                return (
                  <option key={p.size} value={p.size}>
                    {p.size}
                  </option>
                );
              })}
            </select>
          </div>
          {selectedSize &&
            product?.price
              ?.find((p) => p.size === selectedSize)
              ?.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
        </div>

        {product && (
          <div className="product__page__btns">
            <Link
              className="product__page__btn wpp__btn"
              to={`https://wa.me/5534998820464?text=Olá,+tenho+interesse+neste+produto:%0A${url}`}
              target="_blank"
            >
              <i className="bx bxl-whatsapp"></i>
              <span>WhatsApp</span>
            </Link>

            <p className="or__btn">ou</p>

            <Link
              className="product__page__btn email__btn"
              to={`mailto:coimbraimoveisuberlandia@gmail.com?subject=Interesse%20em%20produto&body=Olá,%20tenho%20interesse%20neste%20produto:%0A${url}`}
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
