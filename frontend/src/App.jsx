import React, { useState, useEffect, useMemo } from 'react';
import {
  MapContainer, TileLayer, Circle, Marker,
  useMapEvents,
} from 'react-leaflet';
import './App.css';
import AddIncidentTypeForm from './Forms/AddIncidentTypeForm';
import AddResourceTypeForm from './Forms/AddResourceTypeForm';

function App() {
  const [data, setData] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(4);
  const [showIncidentForm, setShowIncidentForm] = useState(false); // State for incident type form visibility
  const [showResourceForm, setShowResourceForm] = useState(false); // State for resource type form visibility

  useEffect(() => {
    fetch('http://localhost:2000/get-data')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error(error));
  }, []);

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

  const handleAddIncidentType = (newIncidentType) => {
    console.log('New Incident Type Created:', newIncidentType);
    // TODO: Send new incident_type to database.
  };

  const handleAddResourceType = (newResourceType) => {
    console.log('New Resource Type Created:', newResourceType);
    // TODO: Send new resource_type to database.
  };

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        // Handle other click events if necessary
      }
    })
  }

  const displayMap = useMemo(
    () => (
      <MapContainer center={[39.1, -101.3]} zoom={zoomLevel} scrollWheelZoom={false}
        style={{ width: '1000px', height: '800px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data ? data.incidents.map((incident) => (
          <Circle
            key={incident.id} // Add a key prop if incidents have an ID
            center={[incident.location.x, incident.location.y]}
            radius={incident.radius}
            color={incident.color}
          >
            <Marker position={[incident.location.x, incident.location.y]} />
          </Circle>
        )) : "Loading"}

        {data ? data.resources.map((resource) => (
          <Marker key={resource.id} position={[resource.location.x, resource.location.y]} />
        )) : "Loading"}

        <MapClickHandler />
      </MapContainer>
    ),
    [data],
  )

  // Some code below temporarily commented out as it clashes with the new forms.
  return (
    <div>
      {displayMap}
{/*       {showIncidentForm && ( */}
{/*         <AddIncidentForm */}
{/*           location={incidentLocation} */}
{/*           onSubmit={(newIncident) => { */}
{/*             setData(prevData => ({ */}
{/*               ...prevData, */}
{/*               incidents: [...prevData.incidents, newIncident] */}
{/*             })); */}
{/*             setShowIncidentForm(false); */}
{/*           }} */}
{/*           onCancel={() => setShowIncidentForm(false)} */}
{/*         /> */}
{/*       )} */}
      <button onClick={() => setShowIncidentForm(!showIncidentForm)}>
        {showIncidentForm ? 'Hide' : 'Add New Incident Type'}
      </button>
      {showIncidentForm && <AddIncidentTypeForm onAddIncidentType={handleAddIncidentType} />}

      <button onClick={() => setShowResourceForm(!showResourceForm)}>
        {showResourceForm ? 'Hide' : 'Add New Resource Type'}
      </button>
      {showResourceForm && <AddResourceTypeForm onAddResourceType={handleAddResourceType} />}
    </div>
  )
}

export default App;
