
import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapFocus({ selectedDonation }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedDonation) return;

    const latitude = Number(selectedDonation.latitude);
    const longitude = Number(selectedDonation.longitude);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    ) {
      map.flyTo([latitude, longitude], 15, {
        duration: 1.2,
      });
    }
  }, [map, selectedDonation]);

  return null;
}

export default function DonationMap({
  donations = [],
  selectedDonation = null,
}) {
  // This is only a fallback viewing centre for the current
  // test records whose pickup locations mention Bhopal.
  // It is NOT an exact donor pickup location.
  const defaultCenter = [23.2599, 77.4126];

  const validDonations = donations.filter((donation) => {
    const lat = Number(donation.latitude);
    const lng = Number(donation.longitude);

    return (
      donation.latitude !== null &&
      donation.latitude !== undefined &&
      donation.latitude !== "" &&
      donation.longitude !== null &&
      donation.longitude !== undefined &&
      donation.longitude !== "" &&
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  });

  return (
    <div className="donation-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="ann-leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocus selectedDonation={selectedDonation} />

        {validDonations.map((donation) => (
          <Marker
            key={donation.id}
            position={[
              Number(donation.latitude),
              Number(donation.longitude),
            ]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="ann-map-popup">
                {donation.food_image_url && (
                  <img
                    src={donation.food_image_url}
                    alt={donation.food_name || "Food donation"}
                  />
                )}

                <strong>
                  {donation.food_name || "Food Donation"}
                </strong>

                <p>
                  Quantity: {donation.quantity}{" "}
                  {donation.quantity_unit}
                </p>

                <p>
                  Location: {donation.pickup_location}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
