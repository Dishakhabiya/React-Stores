import React, {useState} from 'react';
import AppContext from './app-context';

import { useEffect } from 'react';
const getApiBaseUrl = () => {
  let raw = (process.env.REACT_APP_API_URL || 'http://localhost:5001').trim().replace(/\/+$/, '');
  if (raw && !raw.startsWith('http://') && !raw.startsWith('https://')) {
    raw = 'https://' + raw;
  }
  return raw;
};

const API_BASE_URL = getApiBaseUrl();

export const AppContextProvider = ({children}) => {
     const [showCart,setShowCart] = useState(false);
  const [showAddProduct,setShowAddProduct] = useState(false);
  const [cartItems,setCartItem] = useState([]);
  const [products,setProducts] =useState({});
  const [loading,isLoading]= useState(false);
      function openCart(){
          setShowCart(true);
      }
      const sendProductData = async(product) => {
        const response = await fetch(
          `${API_BASE_URL}/products`,
          {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(product),
          }
        );
        await response.json();
      };
      function closeCart(){
          setShowCart(false);
      }
         function openAddProduct(){
          setShowAddProduct(true);
      }
      
      function closeAddProduct(){
          setShowAddProduct(false);
      }
      const handleAddProduct = (productName) => {
        const newId = Object.keys(products).length + 1;
        const product = {
          id: newId,
          name: productName,
          image: "default.jpg"
        };
        sendProductData(product);
        setProducts((state) => ({ ...state, [newId]: product }));
        setShowAddProduct(false);
      };

      // Firebase alternative (commented out in favor of local backend):
      // const sendProductDataFirebase = async(product) => {
      //   const response = await fetch(
      //     "https://ecommerce-demo-3893a-default-rtdb.firebaseio.com/products.json",
      //     {
      //       method: "POST",
      //       headers: {"Content-Type": "application/json" },
      //       body: JSON.stringify(product),
      //     }
      //   );
      //   await response.json();
      // };
      const handleAddToCart = (productId,productName,productImage) => {
       const  productItemIndex= cartItems.findIndex((item) => item.id === productId);
        if(productItemIndex === -1){
        const cartItem = {
          id: productId ,
          name: productName, 
          image: productImage,
          quantity: 1
        }
        setCartItem((state) => [...state,cartItem])
      }else{
        const updatedCartItems = [...cartItems];
        updatedCartItems[productItemIndex].quantity +=1;
        setCartItem(updatedCartItems);
      }
        
      }
   const handleIncreaseItem = (id) => {
     const  productItemIndex= cartItems.findIndex((item) => item.id === id);
     const updatedCartItems = [...cartItems];
        updatedCartItems[productItemIndex].quantity +=1;
        setCartItem(updatedCartItems);

   }

    const handleDecreaseItem = (id) => {
     const  productItemIndex= cartItems.findIndex((item) => item.id === id);
     const qty = cartItems[productItemIndex].quantity;
      let updatedCartItems = [...cartItems];
     if(qty===1){
        updatedCartItems =
        updatedCartItems.filter((item,index) => index!==productItemIndex);
         
     }else{
        updatedCartItems[productItemIndex].quantity -=1;
     }
     setCartItem(updatedCartItems);
   }

   const handleCheckout = async () => {
     try {
       const response = await fetch(`${API_BASE_URL}/checkout`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ cartItems })
       });
       const data = await response.json();
       if (response.ok) {
         alert(`Order placed successfully!\nOrder ID: ${data.orderId}`);
         setCartItem([]);
         closeCart();
       } else {
         alert("Checkout failed: " + (data.message || "Unknown error"));
       }
     } catch (err) {
       console.error("Checkout failed", err);
       alert("Checkout error: Could not reach backend server.");
     }
   };
  
   useEffect(() => {
    const fetchProducts = async() => {
     try{
      isLoading(true);
       const response = await fetch(
        `${API_BASE_URL}/products`
      );
      const data = await response.json();
      setProducts(data || {});
      isLoading(false);
    }catch(err){
      console.log(err);
      isLoading(false);
    }
     
     };
     fetchProducts();
   },[]);
   const AppContextValue = {
    showCart,
    showAddProduct,
    products,
    cartItems,
    loading,
    openCart,
    closeCart,
    openAddProduct,
    closeAddProduct,
    handleAddProduct,
    handleAddToCart,
    handleIncreaseItem,
    handleDecreaseItem,
    handleCheckout
   };
  return (
    <AppContext.Provider value={AppContextValue}>{children}</AppContext.Provider>
  )
}
export default AppContextProvider;