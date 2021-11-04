import * as React from "react";
import { useState, useEffect } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

//const eventNames = ['onDragStart', 'onDrag', 'onDragEnd'];
const eventNames = ["onDrag"];

function round6(value) {
  return (Math.round(value * 1e6) / 1e6).toFixed(6);
}

function ControlPanel(props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => {
      clearTimeout(timeId);
    };
  });

  return (
    <div className="control-panel">
      <strong>Copy your coordinates!</strong>
      <p>
        You can either enter an address, drag the marker across the screen or
        click anywhere on the map.
      </p>
      <div>
        {eventNames.map((eventName) => {
          const { events = {} } = props;
          const lngLat = events[eventName];

          let lngLatDisplay = "";
          let latLngDisplay = "";
          if (lngLat !== undefined) {
            lngLatDisplay = lngLat.map(round6).join(", ");
            latLngDisplay = lngLat.slice().reverse().map(round6).join(", ");
          }

          return (
            <div key={eventName}>
              <span>
                <strong>Lon, Lat </strong>
              </span>
              <span class="badge badge-pill badge-info even-larger-badge">
                {lngLat ? lngLatDisplay : <em>null</em>}
              </span>
              <CopyToClipboard
                text={lngLatDisplay}
                onCopy={() => setCopied(true)}
              >
                <span style={{ marginLeft: "5px" }}>
                  <i className="fa fa-copy fa-lg"></i>
                </span>
              </CopyToClipboard>
              <div style={{ marginTop: "10px" }}></div>
              <strong>Lat, Lon </strong>
              <span class="badge badge-pill badge-info even-larger-badge">
                {lngLat ? latLngDisplay : <em>null</em>}
              </span>
              <CopyToClipboard
                text={latLngDisplay}
                onCopy={() => setCopied(true)}
              >
                <span style={{ marginLeft: "5px" }}>
                  <i className="fa fa-copy fa-lg"></i>
                </span>
              </CopyToClipboard>
              <div style={{ marginTop: "5px" }}></div>
              {copied ? <span class="badge badge-success">copied!</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
