import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

/* Leaflet default icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Custom Icons */
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* Distance calculation */
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* Fit bounds component */
function FitBounds({ bounds, maxZoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.length > 1) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom });
    }
  }, [bounds, map, maxZoom]);
  return null;
}

/* Center map on user location */
function CenterOnUser({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);
  return null;
}

function UserPage({ theme = "dark" }) {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isNavigationActive, setIsNavigationActive] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(null);
  const [destinationReached, setDestinationReached] = useState(false);
  const [shouldCenterOnUser, setShouldCenterOnUser] = useState(false);
  const userMarkerRef = useRef(null);
  const mapRef = useRef(null);

  // Use refs to always have latest values inside watchPosition callback
  const isNavigationActiveRef = useRef(isNavigationActive);
  const selectedHospitalRef = useRef(selectedHospital);
  const destinationReachedRef = useRef(destinationReached);

  useEffect(() => { isNavigationActiveRef.current = isNavigationActive; }, [isNavigationActive]);
  useEffect(() => { selectedHospitalRef.current = selectedHospital; }, [selectedHospital]);
  useEffect(() => { destinationReachedRef.current = destinationReached; }, [destinationReached]);

  /* Theme Config */
  const themeConfig = {
    dark: {
