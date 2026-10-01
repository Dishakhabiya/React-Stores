import AppContext from '../../store/app-context';
import './Header.css';
import { useContext } from 'react';

function Header() {
    const { openCart, openAddProduct, cartItems } = useContext(AppContext);
    const totalCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = (cartItems || []).reduce((sum, item) => sum + ((Number(item.price) || 0) * item.quantity), 0);
    const currency = cartItems && cartItems.length > 0 ? (cartItems[0].currency || '$') : '$';

    return (
    <div className="header">
        <h1>My React Store</h1>
        <div className="header-buttons">
            <button className="yellow-button" onClick={openCart}>
                🛒 Cart {totalCount > 0 ? `(${totalCount} • ${currency}${totalPrice.toFixed(2)})` : '(0)'}
            </button>
            <button className="yellow-button" onClick={openAddProduct}>+ Add Product</button>
        </div>
       
    </div>
    );
}

export default Header;