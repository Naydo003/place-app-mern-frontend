import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const Backdrop = props => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,          // so can take function from parent component
    document.getElementById('backdrop-hook')
  );
};

export default Backdrop;
