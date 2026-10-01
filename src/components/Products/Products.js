
import { useContext } from 'react';
import './products.css';
import AppContext from '../../store/app-context';
const getProductImage = (imageName) => {
  if (!imageName) return require('../../assests/default.jpg');
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }
  try {
    return require(`../../assests/${imageName}`);
  } catch (err) {
    return require('../../assests/default.jpg');
  }
};

function Product({id, name, image, price, currency, merchant}) {
    const {handleAddToCart} = useContext(AppContext);
    const curr = currency || '$';
    const numPrice = Number(price) || 0;
    const formattedPrice = numPrice.toFixed(2);

    return (
         <div className="product">
            <img src={getProductImage(image)} alt={name} />
            <div className="product-merchant">🏬 {merchant || 'Official Merchant'}</div>
            <div className="product-name">{name}</div>
            <div className="product-price">{curr}{formattedPrice}</div>
            <button onClick={() => handleAddToCart(id, name, image, price, merchant, curr)}> Add to Cart </button>
         </div>
    );
}

function Products() {
    const {products, loading} = useContext(AppContext);
    if(loading){
        return <p className="loading-text">Loading products...</p>;
    }
    return (
        <div className="products-container">
            {Object.keys(products).map(k => (
                <Product 
                    key={k} 
                    id={products[k].id} 
                    name={products[k].name} 
                    image={products[k].image} 
                    price={products[k].price}
                    currency={products[k].currency}
                    merchant={products[k].merchant}
                />
            ))}
        </div>
    );
}

export default Products;