import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../services/api";
import { useState, useRef, useEffect } from "react";
import "./edit-product-page.css";
import { Toaster, toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import ReturnBtn from "../../../components/ReturnBtn/ReturnBtn";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const titleRef = useRef();
  const textRef = useRef();

  const [prices, setPrices] = useState([]);

  // Carrega produto
  async function getProduct() {
    const res = await api.get(`/produtos/${id}`);
    setProduct(res.data);

    // garante que o price seja array de objetos { size, value } e value como número
    const formattedPrices = (res.data.price || []).map((p) => ({
      size: p.size,
      value: Number(p.value) || 0,
    }));

    setPrices(formattedPrices);
    setIsLoading(false);
  }

  useEffect(() => {
    getProduct();
  }, [id]);

  // Atualiza price
  const handlePriceChange = (index, field, value) => {
    setPrices((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              [field]:
                field === "value"
                  ? Number(value.replace(/\D/g, "")) / 100 // armazena número
                  : value,
            }
          : p
      )
    );
  };

  const addPrice = () => {
    setPrices([...prices, { size: "", value: 0 }]);
  };

  const removePrice = (index) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  // Salvar alterações
  async function handleEdit() {
    try {
      await api.put(`/produtos/${product.id}`, {
        title: titleRef.current.value,
        text: textRef.current.value,
        price: prices,
      });
    } catch (err) {
      throw err.response?.data?.message || "Erro ao salvar.";
    }
  }

  const commitEdit = async (e) => {
    e.preventDefault();
    await toast.promise(handleEdit(), {
      loading: "Alterando...",
      success: <p>Alterações salvas!</p>,
      error: <p>Erro ao salvar.</p>,
    });
    navigate("/adm/edit");
  };

  const copyID = () => {
    navigator.clipboard
      .writeText(product?.id)
      .then(() => toast.success("ID copiado!"))
      .catch(() => toast.error("Erro ao copiar"));
  };

  return (
    <div className="edit__container__main">
      <Toaster />
      <ReturnBtn />
      <div className="edit__container">
        <p onClick={copyID} className="edit__container__id">
          <FontAwesomeIcon icon={faCopy} /> ID: {id}
        </p>
        <form onSubmit={commitEdit} className="edit__form">
          <div className="edit__input__box">
            <label htmlFor="title">Título:</label>
            <input
              name="title"
              ref={titleRef}
              defaultValue={product?.title}
              disabled={isLoading}
              maxLength={19}
            />
          </div>

          <div className="edit__input__box">
            <label htmlFor="text">Texto:</label>
            <textarea
              name="text"
              ref={textRef}
              defaultValue={product?.text}
              disabled={isLoading}
              maxLength={500}
              rows={5}
            />
          </div>

          <div className="edit__input__box prices__container">
            <label>Preços:</label>
            {prices.map((p, index) => (
              <div key={index} className="price__row">
                <select
                  required
                  value={p.size}
                  onChange={(e) =>
                    handlePriceChange(index, "size", e.target.value)
                  }
                  disabled={isLoading}
                >
                  <option value="">TAM</option>
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
                  value={
                    p.value
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(p.value)
                      : ""
                  }
                  onChange={(e) =>
                    handlePriceChange(index, "value", e.target.value)
                  }
                  disabled={isLoading}
                  required
                />

                <button
                  type="button"
                  onClick={() => removePrice(index)}
                  disabled={isLoading}
                >
                  Remover
                </button>
              </div>
            ))}

            <button type="button" onClick={addPrice} disabled={isLoading}>
              + Adicionar preço
            </button>
          </div>

          <div className="edit__container__btns">
            <Link className="edit__container__btn cancel__btn" to={"/adm/edit"}>
              Cancelar
            </Link>
            <button className="edit__container__btn save__btn" type="submit">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
