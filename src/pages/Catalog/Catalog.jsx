import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./catalog.css";
import ProductCard from "../../components/ProductCard/ProductCard";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // estado de carregamento

  async function getProducts() {
    try {
      const response = await api.get("/produtos");
      setProducts(response.data);
    } finally {
      setLoading(false); // garante que o loading vai parar mesmo se der erro
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section className="catalog__main">
      <h1>Cardápio</h1>
      {loading ? (
        <p className="loading__message">Carregando produtos...</p> // mensagem enquanto busca
      ) : products.length > 0 ? (
        <div className="products">
          {products.map((imovel) => (
            <ProductCard key={imovel.id} {...imovel} />
          ))}
        </div>
      ) : (
        <p>Nenhum produto encontrado.</p> // fallback caso venha vazio
      )}
    </section>
  );
};

export default Catalog;
