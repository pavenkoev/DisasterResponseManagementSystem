import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, CircleMarker } from 'react-leaflet'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:2000/test')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
    <div >
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} 
    style={{width:'1000px',height:'800px'}}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

    {data ? data.map((incident) => {
      return <CircleMarker 
      center={[incident.location.x, incident.location.y]} 
      radius={incident.radius}
      color={incident.color}></CircleMarker> 
    }) : "Loading"}

</MapContainer>
    </div>
    
    </>
  )
}

export default App
