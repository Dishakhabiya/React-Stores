import { createContext } from "react";
const AppContext = createContext ({
    showCart: false,
    showAddProduct: false,
    products: {},
    cartItems: [],
    loading: false,
    orderNotification: null,
    clearNotification: () => {},
    openCart: () => {},
    closeCart: () => {},
    openAddProduct: () => {},
    closeAddProduct: () => {},
    handleAddProduct: () => {},
    handleAddToCart: () => {},
    handleIncreaseItem: () => {},
    handleDecreaseItem: () => {},
    handleCheckout: () => {}
   });
export default AppContext;