"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/types/listing";
import { formatOMR } from "@/lib/formatters";

interface MapPreviewInnerProps {
  listing: Listing;
}

function PriceMarker({ listing }: { listing: Listing }) {
  const map = useMap();

  useEffect(() => {
    const coords = listing.location.coordinates;
    if (!coords) return;
    const { lat, lng } = coords;

    const priceLabel = formatOMR(listing.price, { compact: true });
    const html = `
      <div style="
        background: #C65D3B;
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        padding: 4px 8px;
        border-radius: 20px;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        border: 2px solid #fff;
        transform: translate(-50%, -50%);
        font-family: inherit;
      ">${priceLabel}</div>
    `;

    const icon = L.divIcon({
      html,
      className: "maqar-marker",
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    const marker = L.marker([lat, lng], { icon }).addTo(map);
    map.setView([lat, lng], 15, { animate: false });

    return () => {
      marker.remove();
    };
  }, [map, listing]);

  return null;
}

export default function MapPreviewInner({ listing }: MapPreviewInnerProps) {
  const coords = listing.location.coordinates;
  if (!coords) return null;

  const { lat, lng } = coords;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <PriceMarker listing={listing} />
    </MapContainer>
  );
}
