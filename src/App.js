import React, { useContext } from "react";
import Header from './components/Header/Header';
import './index.css';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import AddProduct from './components/AddProduct/AddProduct';

import AppContext, { AppContextProvider } from "./store/AppContextProvider";

function NotificationToast() {
  const { orderNotification, clearNotification } = useContext(AppContext);
  if (!orderNotification) return null;
  return (
    <div className="toast-notification" onClick={clearNotification}>
      <span>{orderNotification}</span>
      <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
    </div>
  );
}

function App() {
  return (
    <AppContextProvider>
      <NotificationToast />
      <Header />
      <Products />
      <Cart />
      <AddProduct />
    </AppContextProvider>
  );
}

export default App;