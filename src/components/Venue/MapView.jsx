import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

export default function MapView({ coordinates, address }) {
    const mapPosition = useMemo(
        () => (Array.isArray(coordinates) && coordinates.length === 2 ? coordinates : null),
        [coordinates]
    );

    if (!mapPosition) {
        return <p className="text-danger">📍 Location not available</p>;
    }

    return (
        <div className="mt-4">
            <MapContainer
                center={mapPosition}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "300px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={mapPosition}>
                    <Popup>{address || "No address provided"}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

MapView.propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number),
    address: PropTypes.string,
};

MapView.defaultProps = {
    coordinates: null,
    address: "No address provided",
};
