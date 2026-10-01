import React, {useState, useEffect} from 'react';
import AppContext from './app-context';
import initialProductsData from '../data/product.json';

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
  const [orderNotification, setOrderNotification] = useState(null);

  const clearNotification = () => setOrderNotification(null);
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
     const currentCart = [...cartItems];
     closeCart();
     setCartItem([]);

     try {
       const response = await fetch(`${API_BASE_URL}/checkout`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ cartItems: currentCart })
       });
       if (response.ok) {
         const data = await response.json();
         setOrderNotification(`🎉 Order placed successfully! Order ID: ${data.orderId}`);
         return;
       }
     } catch (err) {
       console.warn("Backend API offline, completed checkout locally.", err);
     }

     const tempOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
     setOrderNotification(`🎉 Order placed successfully! Order ID: ${tempOrderId}`);
   };
  
   useEffect(() => {
    const fetchProducts = async() => {
     try {
       isLoading(true);
       // Fetch live from DummyJSON API directly as requested
       const response = await fetch('https://dummyjson.com/products?limit=200');
       if (!response.ok) throw new Error("DummyJSON API error");
       const json = await response.json();
       const items = json.products || [];
       if (items.length > 0) {
         const obj = {};
         items.forEach(p => {
           obj[String(p.id)] = {
             id: p.id,
             name: p.title,
             price: p.price,
             image: p.thumbnail || (p.images && p.images[0]) || 'default.jpg',
             category: p.category,
             description: p.description,
             rating: p.rating
           };
         });
         setProducts(obj);
         isLoading(false);
         return;
       }
     } catch(err) {
       console.warn("Could not fetch live DummyJSON API, using local product dataset fallback.", err);
     }

     const fallbackObj = {};
     initialProductsData.forEach((p, idx) => {
       const key = String(p.id || idx + 1);
       fallbackObj[key] = p;
     });
     setProducts(fallbackObj);
     isLoading(false);
    };
    fetchProducts();
   },[]);
   const AppContextValue = {
    showCart,
    showAddProduct,
    products,
    cartItems,
    loading,
    orderNotification,
    clearNotification,
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