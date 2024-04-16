import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Map,
  Marker,
  GoogleApiWrapper,
  DirectionsService,
  DirectionsRenderer,
} from "google-maps-react";

const App = (props) => {
  const [tours, setTours] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState(null);

  useEffect(() => {
    axios
      .get("/tours")
      .then((response) => {
        setTours(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
      });
  }, []);

  const handleCurrentLocationChange = (event) => {
    setCurrentLocation(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (currentLocation && destination) {
      calculateRoute(currentLocation, destination);
    }
  };

  const calculateRoute = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          setRoute(response.routes[0]);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  return (
    <div style={{ width: "100%", height: "800px", position: "relative" }}>
      <h1>Google Maps Directions</h1>
      <br />
      <form onSubmit={handleFormSubmit}>
        <label>
          Current Location:
          <input
            type="text"
            value={currentLocation}
            onChange={handleCurrentLocationChange}
          />
        </label>
        <br />
        <label>
          Destination:
          <input
            type="text"
            value={destination}
            onChange={handleDestinationChange}
          />
        </label>
        <br />
        <button type="submit">Show Route</button>
      </form>
      <Map google={props.google} zoom={8} initialCenter={{ lat: 0, lng: 0 }}>
        {tours.map((tour) => (
          <Marker
            key={tour._id}
            position={{ lat: tour.coordinates[0], lng: tour.coordinates[1] }}
          />
        ))}
        {currentLocation && <Marker position={currentLocation} />}
        {destination && <Marker position={destination} />}
        {route && (
          <DirectionsRenderer
            directions={route}
            options={{
              suppressMarkers: true,
            }}
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyC-65lkr7QWjGTmpgF3kIt-WsRfLBtktR8",
})(App);
