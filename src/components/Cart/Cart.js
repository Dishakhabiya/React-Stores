import { useContext } from 'react';
import AppContext from '../../store/app-context.js';
import Modal from '../UI/Modal.js';
import './Cart.css';
const getProductImage = (imageName) => {
  try {
    return require(`../../assests/${imageName}`);
  } catch (err) {
    return require('../../assests/default.jpg');
  }
};

function CartItem({ id, name, image, quantity}) {
   const {handleIncreaseItem,handleDecreaseItem} = useContext(AppContext);
    return (
        <div className="cart-item">
            <div className="item-img">
                <img src={getProductImage(image)} alt={name} />
            </div>

            <div className="item-name">{name}</div>

            <div className="quantity-controls">
                <button className="yellow-button qty-button" onClick={()=>handleDecreaseItem(id)} >-</button>

                <span className="quantity">{quantity}</span>

                <button className="yellow-button qty-button" onClick={()=>handleIncreaseItem(id)}>+</button>
            </div>
        </div>
    );
}
function Cart(){
    const { showCart, closeCart, cartItems, handleCheckout } = useContext(AppContext);
    return (
         <Modal show={showCart} onClose={closeCart}>
            <div className="cart-container">
                <div className="cart-heading"> cart</div>
                {cartItems.length>0 ? cartItems.map(
                    (item) =>(<CartItem key={item.id} 
                    id={item.id} 
                    name={item.name} 
                    image={item.image} 
                    quantity={item.quantity}
                   />)) : "Cart is Empty"
                }
                <div className="cart-buttons">
                    <button className="black-button close-cart" onClick={closeCart}>close</button>
                   {cartItems.length>0 && <button className="yellow-button" onClick={handleCheckout}>checkout</button>} 
                </div>

            </div>

         </Modal>
    );


}

export default Cart;