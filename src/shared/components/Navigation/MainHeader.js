import React from 'react';

import './MainHeader.css';

const MainHeader = props => {
  return <header className="main-header">{props.children}</header>;      // props.children is a special prop. makes this a wrapper and gives the children. Means the component exists but the details of it will be written in the parent. Ie MainNavigation.
};

export default MainHeader;
