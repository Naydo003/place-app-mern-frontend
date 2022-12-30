import React, { useRef, useEffect } from 'react';

import './Map.css';

// Need to update the API key in index.html
// the google maps SDK is downloaded in index.html script. this adds the google object to the window for use.
const Map = props => {
  const mapRef = useRef();     // useRef is really simple in this use case. // could have used getElementById and assign an id to the div
  
  const { center, zoom } = props;

  // useEffect required because mapRef has not been set until a line below.
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {          
      center: center,
      zoom: zoom
    });
    
    // creates a marker showing location of place
    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
