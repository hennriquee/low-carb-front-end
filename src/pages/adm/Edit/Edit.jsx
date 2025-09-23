import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../services/api";
import "./edit.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";
import "../../../components/ProductCard/product-card.css";

const Edit = () => {
  const searchRef = useRef();
  const [products, setProducts] = useState();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef();
  const formRef = useRef();

  async function getAllProducts() {
    setProducts((await api.get("/produtos")).data);
  }

  useEffect(() => {
    getAllProducts();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setProducts([]);
    setLoading((prev) => !prev);
    const id = searchRef.current.value;

    try {
      setSelectedProduct((await api.get(`/produtos/${id}`)).data);
      setLoading((prev) => !prev);
    } catch {
      setLoading((prev) => !prev);
      toast.error("ID não encontrado.");
    }
    searchRef.current.value = "";
  }

  async function deleteProduct(id) {
    return api.delete(`/produtos/${id}`);
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await toast.promise(deleteProduct(id), {
          loading: "Excluindo...",
          success: <p>Produto excluído.</p>,
          error: <p>Erro ao excluir produto.</p>,
        });

        window.location.reload();
      } catch (err) {
        toast.error(err.response?.data?.message || "Erro ao excluir produto.");
      }
    }
  }

  return (
    <section className="edit__main">
      <Toaster />
      <h1>Edição de Produtos</h1>
      <form ref={formRef} onSubmit={handleSearch} className="edit__input__id">
        <input required ref={searchRef} type="text" placeholder="ID" />

        <button className="edit__search__btn" type="submit">
          <FontAwesomeIcon
            className="edit__search__icon"
            icon={faMagnifyingGlass}
          />
        </button>
      </form>

      <div className="edit__product__cards">
        {selectedProduct ? (
          <div key={selectedProduct.id} ref={cardRef} className="product__card">
            <div className="product__card__img">
              <img src={selectedProduct.images[0]} alt="sem imagem" />
            </div>

            <div className="product__card__content">
              <h5 className="product__card__title">{selectedProduct.title}</h5>
              <div className="product__card__zeros">
                <p
                  className={
                    selectedProduct.zerolactose
                      ? "green__text"
                      : "crossed__text"
                  }
                >
                  • 0% Lactose
                </p>

                <p
                  className={
                    selectedProduct.zerogluten ? "green__text" : "crossed__text"
                  }
                >
                  • 0% Glúten
                </p>

                <p
                  className={
                    selectedProduct.zerosugar ? "green__text" : "crossed__text"
                  }
                >
                  • 0% Açúcar
                </p>
                <hr />
              </div>
              <p className="price">{selectedProduct.price ?? "R$ -"}</p>

              <div className="edit__card_btns">
                <Link
                  to={`/adm/edit/${selectedProduct.id}`}
                  className="brown__btn edit__card__btn"
                >
                  Editar
                </Link>
                <Link
                  onClick={() => handleDelete(selectedProduct.id)}
                  className="trash__btn"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Link>
              </div>
            </div>
          </div>
        ) : products ? (
          products.map((product) => {
            return (
              <div key={product.id} ref={cardRef} className="product__card">
                <div className="product__card__img">
                  <img src={product.images[0]} alt="sem imagem" />
                </div>

                <div className="product__card__content">
                  <h5 className="product__card__title">{product.title}</h5>
                  <div className="product__card__zeros">
                    <p
                      className={
                        product.zerolactose ? "green__text" : "crossed__text"
                      }
                    >
                      • 0% Lactose
                    </p>

                    <p
                      className={
                        product.zerogluten ? "green__text" : "crossed__text"
                      }
                    >
                      • 0% Glúten
                    </p>

                    <p
                      className={
                        product.zerosugar ? "green__text" : "crossed__text"
                      }
                    >
                      • 0% Açúcar
                    </p>
                  </div>
                  <hr />
                  <p className="price">{product.price ?? "R$ -"}</p>

                  <div className="edit__card_btns">
                    <Link
                      to={`/adm/edit/${product.id}`}
                      className="edit__card__btn brown__btn"
                    >
                      Editar
                    </Link>
                    <Link
                      onClick={() => handleDelete(product.id)}
                      className="trash__btn"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : loading ? (
          "Carregando informações..."
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default Edit;
