import React, { useState, useRef } from "react";
import "./register.css";
import { api } from "../../../services/api";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const categoryRef = useRef();
  const titleRef = useRef();
  const textRef = useRef();
  const zerolactoseRef = useRef();
  const zeroglutenRef = useRef();
  const zerosugarRef = useRef();
  const formRef = useRef();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [prices, setPrices] = useState([{ size: "", value: "" }]);

  // Manipulação de preços
  const handlePriceChange = (index, field, value) => {
    setPrices((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              [field]:
                field === "value"
                  ? Number(value.replace(/\D/g, "")) / 100
                  : value,
            }
          : p
      )
    );
  };

  const addPrice = () =>
    setPrices((prev) => [...prev, { size: "", value: "" }]);
  const removePrice = (index) =>
    setPrices((prev) => prev.filter((_, i) => i !== index));

  // Upload de imagens
  const handleUploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_products");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dabzzfviw/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1200/"
        );
      }
      return null;
    } catch (err) {
      console.error("Erro no upload:", err);
      return null;
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 4) {
      toast.error("Máximo de 4 imagens!");
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit do formulário
  const handleSubmit = async () => {
    try {
      let urls = [];
      if (selectedFiles.length > 0) {
        urls = await Promise.all(
          selectedFiles.map((file) => handleUploadToCloudinary(file))
        );
      }

      const payload = {
        category: categoryRef.current.value,
        title: titleRef.current.value,
        text: textRef.current.value,
        zerolactose: zerolactoseRef.current.checked,
        zerogluten: zeroglutenRef.current.checked,
        zerosugar: zerosugarRef.current.checked,
        images: urls,
        price: prices,
      };

      await api.post("/produtos/cadastro", payload);

      formRef.current.reset();
      setSelectedFiles([]);
      setPrices([{ size: "", value: "" }]);
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
    }
  };

  async function commitProduct(e) {
    e.preventDefault();
    toast.promise(handleSubmit(), {
      loading: "Cadastrando...",
      success: <p>Cadastro realizado!</p>,
      error: <p>Erro ao cadastrar produto.</p>,
    });
  }

  return (
    <section className="register__page">
      <Toaster />
      <div className="register__main">
        <h1>Cadastro de Produtos</h1>
        <form ref={formRef} className="register__form" onSubmit={commitProduct}>
          <div className="form__container-1">
            <select required ref={categoryRef} defaultValue="">
              <option value="" disabled>
                Categoria
              </option>
              <option value="Bolos & Tortas">Bolos & Tortas</option>
              <option value="Biscoitos & Cookies">Biscoitos & Cookies</option>
              <option value="Sobremesas & Doces">Sobremesas & Doces</option>
              <option value="Pães & Roscas">Pães & Roscas</option>
              <option value="Salgados & Lanches">Salgados & Lanches</option>
            </select>

            <input
              maxLength={19}
              required
              ref={titleRef}
              type="text"
              placeholder="Título"
            />

            <div className="register__checkbox">
              <input id="zerolactose" type="checkbox" ref={zerolactoseRef} />
              <label htmlFor="zerolactose">Zero Lactose</label>
            </div>
            <div className="register__checkbox">
              <input id="zerogluten" type="checkbox" ref={zeroglutenRef} />
              <label htmlFor="zerogluten">Zero Glúten</label>
            </div>
            <div className="register__checkbox">
              <input id="zerosugar" type="checkbox" ref={zerosugarRef} />
              <label htmlFor="zerosugar">Zero Açúcar</label>
            </div>

            <textarea
              maxLength={500}
              ref={textRef}
              rows={5}
              placeholder="Texto do anúncio"
            />

            {/* Inputs de preço dinâmicos */}
            {prices.map((p, idx) => (
              <div key={idx} className="price__input">
                <select
                  value={p.size}
                  onChange={(e) =>
                    handlePriceChange(idx, "size", e.target.value)
                  }
                  required
                >
                  <option disabled value="">
                    TAM
                  </option>
                  <option value="PP">PP</option>
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="XG">XG</option>
                </select>

                <input
                  type="text"
                  placeholder="Preço (R$)"
                  value={p.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  onChange={(e) =>
                    handlePriceChange(idx, "value", e.target.value)
                  }
                  required
                />

                {idx !== 0 && (
                  <button
                    className="remove__price__btn"
                    type="button"
                    onClick={() => removePrice(idx)}
                  >
                    -
                  </button>
                )}
              </div>
            ))}

            <button
              className="add__price__btn"
              type="button"
              onClick={addPrice}
            >
              + Adicionar preço
            </button>

            <button type="submit" className="cad__btn">
              Cadastrar
            </button>
          </div>

          <div className="form__container-2">
            {selectedFiles.length > 0 && (
              <div className="preview__container">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="preview__item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx}`}
                    />
                    <button
                      className="remove__file__btn"
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              required
              className="input__images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
