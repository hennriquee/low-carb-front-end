import React, { useState, useRef, useEffect } from "react";
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
  const priceRef = useRef();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [priceDisabled, setPriceDisabled] = useState(true);
  const [price, setPrice] = useState("");

  const handlePriceChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    const formattedValue = (Number(numericValue) / 100).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );
    setPrice(formattedValue);
  };

  const handleUploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_products");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dabzzfviw/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        const optimizedUrl = data.secure_url.replace(
          "/upload/",
          "/upload/f_auto,q_auto,w_1200/"
        );
        return optimizedUrl;
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

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
      };
      if (
        priceRef.current &&
        priceRef.current.value &&
        priceRef.current.value !== "R$ 0,00"
      ) {
        payload.price = priceRef.current.value;
      } else {
        payload.price = "R$ -";
      }
      await api.post("/produtos/cadastro", payload);
      formRef.current.reset();
      priceRef.current.value = "";
      setSelectedFiles([]);
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      throw err;
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

  const togglePriceInput = () => {
    setPriceDisabled((prev) => !prev);
  };

  useEffect(() => {
    priceRef.current.value = "";
  }, [priceDisabled]);

  return (
    <section className="register__page">
      <Toaster />
      <div className="register__main">
        <h1>Cadastro de Produtos</h1>
        <form ref={formRef} className="register__form" onSubmit={commitProduct}>
          <div className="form__container-1">
            <select
              required
              ref={categoryRef}
              className="category__select"
              defaultValue=""
            >
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
              cols={50}
              placeholder="Texto do anúncio"
            />
            <div className="price__input">
              <input
                onChange={togglePriceInput}
                className="price__input__check"
                type="checkbox"
              />
              <input
                disabled={priceDisabled}
                ref={priceRef}
                type="text"
                placeholder="Preço (R$)"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
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
                      type="button"
                      className="remove__btn"
                      onClick={() => handleRemove(idx)}
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
