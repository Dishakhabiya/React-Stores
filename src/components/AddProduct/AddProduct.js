import {useRef} from "react";
import { useContext } from "react";
import Modal from '../UI/Modal.js';
import './AddProduct.css';
import AppContext from "../../store/app-context.js";

function AddProduct( ){
  const nameRef = useRef();
   const {showAddProduct,closeAddProduct,handleAddProduct} = useContext(AppContext);
    function handleSubmit(event){
            event.preventDefault();
             const nameValue= nameRef.current.value;
            handleAddProduct(nameValue);
    }
    
    return(
       <Modal show={showAddProduct} onClose={closeAddProduct}>
        <div className="add-product-container">
            <div className="add-product-heading"> Add Product</div> 
            <form onSubmit={handleSubmit}className="add-product-form">
                <div className="form-label"> Enter Product Name</div>
                <input className="form-input" name="product name" ref={nameRef}/>
                <button type="submit" className="yellow-button submitButton">Add Product </button>
            </form>
            
            </div>
        </Modal>
        );

}
export default AddProduct;