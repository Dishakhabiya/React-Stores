import { createContext } from "react";
const AppContext = createContext ({
    showCart: false,
    showAddProduct: false,
    products: [],
    cartItems: [],
    loading: false,
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