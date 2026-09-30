import React from "react";
import Header from './components/Header/Header';
import './index.css';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import AddProduct from './components/AddProduct/AddProduct';

import { AppContextProvider } from "./store/AppContextProvider";
function App() {
 
  return (
    <AppContextProvider >
    <Header  />
    <Products />
    <Cart  />

    <AddProduct  />
    </AppContextProvider>
  );
}

export default App;