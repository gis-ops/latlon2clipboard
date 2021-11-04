import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { render } from "react-dom";
import MapGL, {
  Marker,
  NavigationControl,
  FlyToInterpolator,
} from "react-map-gl";
import Geocoder from "react-mapbox-gl-geocoder";

import ControlPanel from "./control-panel";
import Pin from "./pin";

const TOKEN =
  "pk.eyJ1IjoidGltbWNjYXVsZXkiLCJhIjoiY2t2Zm45bGoyMXVhYTJwcGdxYjlndmRsMyJ9.Yi9qMPkTXfFsUvR8xz1QrA";

const styles = `
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,300,400,700);
  @import url(https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css);
  @import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css);

  body {
    margin: 0;
    background: #000;
    font-family: 'Open Sans', sans-serif;
  }

  input, select, textarea, button{font-family:inherit;}

  .control-panel {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 320px;
    background: #fff;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 10%);
    padding: 10px 10px;
    margin: 20px;
    font-size: 13px;
    color: #6b6b76;
    outline: none;
  }

  .react-geocoder {
    position: absolute;
    max-width: 300px;
    background: #fff;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 10%);
    border-radius: 4px;
    padding: 4px 4px;
    font-size: 13px;
    color: #6b6b76;
    width: 300px;
    left: 50px;
    top: 10px;
  }

  .react-geocoder input {
      width: 100%;
  }

  .react-geocoder-results {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    background-color: white;
    box-shadow: 0 0 0 2px rgb(0 0 0 / 10%);
    width: 100%;
  }

  .react-geocoder-item {
    line-height: 2;
    padding: 3px;
    cursor: pointer;
    border-bottom: 1px solid #8a8a8a;
  }

  .badge.even-larger-badge {
    font-size: 1.1em;
  }
`

const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px",
};

function Root() {
  const [viewport, setViewport] = useState({
    latitude: 48.85446,
    longitude: 2.34771,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const [marker, setMarker] = useState({
    latitude: 48.85446,
    longitude: 2.34771,
  });

  const handleClick = ({ lngLat: [longitude, latitude] }) => {
    setMarker({ longitude, latitude });
    logEvents((_events) => ({ ..._events, onDrag: [longitude, latitude] }));
  };

  const [events, logEvents] = useState({});

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }));
  }, []);

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }));
  }, []);

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1],
    });
  }, []);

  useEffect(() => {
    logEvents((_events) => ({
      ..._events,
      onDrag: [marker.longitude, marker.latitude],
    }));
  }, []);

  const onSelected = (viewport, item) => {
    const coords = item.geometry.coordinates;
    setViewport({
      ...viewport,
      longitude: coords[0],
      latitude: coords[1],
      zoom: 13,
    });

    logEvents((_events) => ({ ..._events, onDragEnd: coords }));
    setMarker({
      longitude: coords[0],
      latitude: coords[1],
    });
  };

  return (
    <>
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        onViewportChange={setViewport}
        mapboxApiAccessToken={TOKEN}
        onClick={handleClick}
      >
        <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        >
          <Pin size={35} />
        </Marker>
        <div className="nav" style={navStyle}>
          <NavigationControl />
        </div>
      </MapGL>
      <ControlPanel events={events} />
      <Geocoder
        mapboxApiAccessToken={TOKEN}
        onSelected={onSelected}
        updateInputOnSelect={true}
        limit={15}
        viewport={viewport}
        hideOnSelect={true} 
      />
    </>
  );
}

const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
document.body.style.margin = 0;
render(<Root />, document.body.appendChild(document.createElement('div')));
const input = document.getElementsByClassName('react-geocoder')[0].querySelector('input');
input.setAttribute("placeholder", "Enter an address...");

