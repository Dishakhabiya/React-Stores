import AppContext from '../../store/app-context';
import './Header.css';
import { useContext } from 'react';

function Header() {
    const {openCart,openAddProduct} = useContext(AppContext);
    return (
    <div className="header">
        <h1>My React Store</h1>
        <div className="header-buttons">
            <button className="yellow-button" onClick={openCart}>cart</button>
            <button className="yellow-button" onClick={openAddProduct}>Add Product</button>
        </div>
       
    </div>
    );
}

export default Header;