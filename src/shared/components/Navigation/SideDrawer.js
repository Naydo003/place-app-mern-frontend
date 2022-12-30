import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';    // Library for transitions as components.

import './SideDrawer.css';

const SideDrawer = props => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"       // classNames with sssssssssssss on end. Special to CSSTransition. slide-in-left must be defined in index.css
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>  
    </CSSTransition>
  );
  //  onClick function prop drilled here

  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));    // Portals*
};

export default SideDrawer;


// Create locations alternative to root in the index.js file (See index.js). This is so a significant section such as a side drawer can be semantically rendered along side the main components even though it is nested deep in your component tree.