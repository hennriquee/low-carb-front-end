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
  const priceRef = useRef();

  async function getProduct() {
    setProduct((await api.get(`/produtos/${id}`)).data);
    setIsLoading(false);
  }

  useEffect(() => {
    getProduct();
  }, [id]);

  async function handleEdit() {
    try {
      await api.put(`/produtos/${product.id}`, {
        title: titleRef.current.value,
        text: textRef.current.value,
        price: priceRef.current.value,
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
      .then(() => {
        toast.success("ID copiado!");
      })
      .catch((err) => {
        toast.error("Erro ao copiar: ", err);
      });
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
          <div className="edit__input__box">
            <label htmlFor="price">Preço:</label>

            <input
              name="price"
              ref={priceRef}
              defaultValue={product?.price}
              disabled={isLoading}
            />
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
