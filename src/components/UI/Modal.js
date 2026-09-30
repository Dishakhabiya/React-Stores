import  './Modal.css';
function Modal({show, onClose, children}){
    if(!show){
        return null;
    }
    return(
    <div className="backDrop" onClick={onClose}> 
            <div className="modal" onClick={event => event.stopPropagation()} > {children}</div>
    </div>
    );

}
export default Modal;