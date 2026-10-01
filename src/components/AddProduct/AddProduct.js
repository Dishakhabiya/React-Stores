import {useRef} from "react";
import { useContext } from "react";
import Modal from '../UI/Modal.js';
import './AddProduct.css';
import AppContext from "../../store/app-context.js";

function AddProduct( ){
  const nameRef = useRef();
  const priceRef = useRef();
  const merchantRef = useRef();
  const {showAddProduct,closeAddProduct,handleAddProduct} = useContext(AppContext);

  function handleSubmit(event){
    event.preventDefault();
    const nameValue = nameRef.current.value;
    const priceValue = priceRef.current.value;
    const merchantValue = merchantRef.current.value;
    handleAddProduct(nameValue, priceValue, merchantValue);
  }
  
  return(
     <Modal show={showAddProduct} onClose={closeAddProduct}>
      <div className="add-product-container">
          <div className="add-product-heading">Add New Product</div> 
          <form onSubmit={handleSubmit} className="add-product-form">
              <div className="form-group">
                <div className="form-label">Product Name</div>
                <input className="form-input" required name="productName" ref={nameRef} placeholder="e.g. Wireless Headphones" />
              </div>

              <div className="form-group">
                <div className="form-label">Price ($)</div>
                <input className="form-input" type="number" step="0.01" min="0" required name="productPrice" ref={priceRef} placeholder="e.g. 29.99" />
              </div>

              <div className="form-group">
                <div className="form-label">Merchant / Store Name</div>
                <input className="form-input" name="productMerchant" ref={merchantRef} placeholder="e.g. Tech Store" />
              </div>

              <button type="submit" className="yellow-button submitButton">Add Product</button>
          </form>
          </div>
      </Modal>
  );
}
export default AddProduct;