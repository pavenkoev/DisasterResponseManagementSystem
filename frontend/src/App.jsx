import React, { useState, useEffect, useMemo } from 'react'
import {
  MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker, Circle,
  useMapEvents, ImageOverlay
} from 'react-leaflet'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(4);

  useEffect(() => {
    fetch('http://localhost:2000/get-data')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);


  const [map, setMap] = useState(null)

  function handleAddIncident(e) {
    let latlng = e.latlng;
    let radius = parseInt(prompt('Enter radius:'));
    let type = parseInt(prompt('Enter type:'));

    fetch('http://localhost:2000/add-incident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          x: latlng.lat,
          y: latlng.lng
        },
        radius: radius,
        type: type
      })
    }).then(response => response.json())
    .then(json => {
      let newData = {
        incidents: [...data.incidents, json[0]],
        resources: data.resources
      };
      setData(newData);
    });
  }

  function handleAddResource(e) {
    let latlng = e.latlng;
    let quantity = parseInt(prompt('Enter quantity:'));
    let type = parseInt(prompt('Enter type:'));

    fetch('http://localhost:2000/add-resource', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: {
          x: latlng.lat,
          y: latlng.lng
        },
        quantity: quantity,
        type: type
      })
    }).then(response => response.json())
    .then(json => {
      let newData = {
        incidents: data.incidents,
        resources: [...data.resources, json[0]]
      };
      setData(newData);
    });
  }


  function MapClickHandler() {
    useMapEvents({
      click(e) {
        handleAddIncident(e);
        //handleAddResource(e);
      }
    })
  }

  function createIcon(url) {
    var myIcon = L.icon({
      iconUrl: url,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [-3, -76],
    });
    return myIcon;
  }

  const displayMap = useMemo(
    () => (
      <>
        <div >
          <MapContainer center={[39.1, -101.3]} zoom={zoomLevel} scrollWheelZoom={false}
            style={{ width: '1000px', height: '800px' }}
            ref={setMap}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data ? data.incidents.map((incident) => {
              return <Circle
                center={[incident.location.x, incident.location.y]}
                radius={incident.radius}
                color={incident.color}>
                <Marker position={[incident.location.x, incident.location.y]}
                  icon={createIcon('http://localhost:5173/images/icons/' + incident.icon)}></Marker>
              </Circle>
            }) : "Loading"}

            {data ? data.resources.map((resource) => {
              return <Marker position={[resource.location.x, resource.location.y]}
                  icon={createIcon('http://localhost:5173/images/icons/' + resource.icon)}></Marker>
            }) : "Loading"}

            <MapClickHandler />

          </MapContainer>
        </div>

      </>
    ),
    [data],
  )

  return (<div>
    {displayMap}
  </div>

  )
}

export default App
