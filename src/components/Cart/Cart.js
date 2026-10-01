import { useContext } from 'react';
import AppContext from '../../store/app-context.js';
import Modal from '../UI/Modal.js';
import './Cart.css';
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

function CartItem({ id, name, image, price, currency, merchant, quantity }) {
   const { handleIncreaseItem, handleDecreaseItem } = useContext(AppContext);
   const curr = currency || '$';
   const unitPrice = Number(price) || 0;
   const subtotal = (unitPrice * quantity).toFixed(2);

    return (
        <div className="cart-item">
            <div className="item-img">
                <img src={getProductImage(image)} alt={name} />
            </div>

            <div className="item-details">
                <div className="item-name">{name}</div>
                <div className="item-merchant">Merchant: {merchant || 'Official Store'}</div>
                <div className="item-price-row">
                    <span className="unit-price">Price: {curr}{unitPrice.toFixed(2)}</span>
                    <span className="subtotal">Subtotal: {curr}{subtotal}</span>
                </div>
            </div>

            <div className="quantity-controls">
                <button className="yellow-button qty-button" onClick={()=>handleDecreaseItem(id)}>-</button>
                <span className="quantity">{quantity}</span>
                <button className="yellow-button qty-button" onClick={()=>handleIncreaseItem(id)}>+</button>
            </div>
        </div>
    );
}

function Cart() {
    const { showCart, closeCart, cartItems, handleCheckout } = useContext(AppContext);

    const grandTotal = cartItems.reduce((acc, item) => {
        const itemPrice = Number(item.price) || 0;
        return acc + (itemPrice * item.quantity);
    }, 0);

    const currency = cartItems.length > 0 ? (cartItems[0].currency || '$') : '$';

    return (
         <Modal show={showCart} onClose={closeCart}>
            <div className="cart-container">
                <div className="cart-heading">Your Shopping Cart</div>
                
                <div className="cart-items-list">
                    {cartItems.length > 0 ? cartItems.map((item) => (
                        <CartItem 
                            key={item.id} 
                            id={item.id} 
                            name={item.name} 
                            image={item.image} 
                            price={item.price}
                            currency={item.currency}
                            merchant={item.merchant}
                            quantity={item.quantity}
                        />
                    )) : (
                        <div className="empty-cart-message">Your cart is currently empty.</div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-total-section">
                        <span className="cart-total-label">Total Price:</span>
                        <span className="cart-total-value">{currency}{grandTotal.toFixed(2)}</span>
                    </div>
                )}

                <div className="cart-buttons">
                    <button className="black-button close-cart" onClick={closeCart}>Close</button>
                    {cartItems.length > 0 && (
                        <button className="yellow-button checkout-btn" onClick={handleCheckout}>
                            Checkout ({currency}{grandTotal.toFixed(2)})
                        </button>
                    )} 
                </div>
            </div>
         </Modal>
    );
}

export default Cart;