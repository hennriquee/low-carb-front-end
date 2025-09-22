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

  // PRICE FORMAT
  const [price, setPrice] = useState("");

  const handlePriceChange = (e) => {
    // remove tudo que não é número
    const numericValue = e.target.value.replace(/\D/g, "");

    // converte para reais (duas casas decimais)
    const formattedValue = (Number(numericValue) / 100).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

    setPrice(formattedValue);
  };
  // PRICE FORMAT

  // Upload de imagem no Cloudinary
  const handleUploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_products"); // preset deve existir no Cloudinary

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
        //  adiciona parâmetros de otimização direto na URL
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

  // Seleção de arquivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newFile = files[0];
    setSelectedFiles((prev) => {
      if (prev.length < 4) {
        return [...prev, newFile];
      } else {
        const updated = [...prev];
        updated[updated.length - 1] = newFile;
        return updated;
      }
    });
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      // 1) Faz upload das imagens para Cloudinary
      let urls = [];
      if (selectedFiles.length > 0) {
        urls = await Promise.all(
          selectedFiles.map((file) => handleUploadToCloudinary(file))
        );
      }

      // Envia os dados para o backend

      const payload = {
        category: categoryRef.current.value,
        title: titleRef.current.value,
        text: textRef.current.value,
        zerolactose: zerolactoseRef.current.checked,
        zerogluten: zeroglutenRef.current.checked,
        zerosugar: zerosugarRef.current.checked,
        images: urls,
      };

      // Só adiciona price se tiver valor
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

      // 3) Reset do formulário
      formRef.current.reset();
      priceRef.current.value = "";
      setSelectedFiles([]);
      window.location.reload();
    } catch (err) {
      console.error("Erro ao cadastrar imóvel:", err);
      // relança para o toast.promise capturar
      throw err;
    }
  };

  // Commit com toast.promise
  async function commitProduct(e) {
    e.preventDefault();
    console.log(zeroglutenRef.current.value);
    toast.promise(
      handleSubmit(), // retorna a Promise do handleSubmit
      {
        loading: "Cadastrando...",
        success: <p>Cadastro realizado!</p>,
        error: <p>Erro ao cadastrar produto.</p>,
      }
    );
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
              <option value="Bolo">Bolo</option>
              <option value="Doce">Doce</option>
              <option value="Salgado">Salgado</option>
              <option value="Trigo">Trigo</option>
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
          {/* Upload de imagens */}
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
              onChange={handleFileChange}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
