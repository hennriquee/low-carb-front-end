import { useState } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Catalog from "./pages/Catalog/Catalog";
import ProductPage from "./pages/ProductPage/ProductPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Edit from "./pages/adm/Edit/Edit";
import EditProductPage from "./pages/adm/EditProductPage/EditProductPage";
import Register from "./pages/adm/Register/Register";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login/Login";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo/produto/:id" element={<ProductPage />} />

        {/* Protegidas */}
        <Route
          path="/adm/cadastro"
          element={
            <PrivateRoute>
              <Register />
            </PrivateRoute>
          }
        />

        <Route
          path="/adm/edit"
          element={
            <PrivateRoute>
              <Edit />
            </PrivateRoute>
          }
        />
        <Route
          path="/adm/edit/:id"
          element={
            <PrivateRoute>
              <EditProductPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
