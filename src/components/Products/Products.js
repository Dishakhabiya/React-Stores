
import { useContext } from 'react';
import './products.css';
import AppContext from '../../store/app-context';
const getProductImage = (imageName) => {
  try {
    return require(`../../assests/${imageName}`);
  } catch (err) {
    return require('../../assests/default.jpg');
  }
};

function Product({id,name,image}) {
    const {handleAddToCart} =useContext(AppContext)
    return (
         <div className="product">
            <img src={getProductImage(image)} alt={name} />
                <div className="product-name">{name}</div>
                <button onClick={() => handleAddToCart(id,name,image)}> Add to Cart </button>
                </div>
    );
}
function Products() {
    const {products,loading} =useContext(AppContext);
    if(loading){
        return <p> is loading</p> ;
    }
    return (
        <div className="products-container">{
            Object.keys(products).map(k => (
                <Product key={k} id={products[k].id} 
                name={products[k].name} image={products[k].image} 
                />
            ))
                    
        }

            
        </div>
    );
}

export default Products;