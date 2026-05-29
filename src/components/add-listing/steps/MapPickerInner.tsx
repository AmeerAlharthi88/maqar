"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import {
  TILE_URL,
  TILE_ATTRIBUTION,
  MUSCAT_CENTER,
  MUSCAT_DEFAULT_ZOOM,
} from "@/lib/constants/map-constants";

// ── Custom pin icon — SVG avoids broken default marker URL in bundlers ──────────
function makePinIcon(): L.DivIcon {
  return L.divIcon({
    html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="#0A3C36" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`,
    className: "maqar-map-pin",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

// ── Click handler — lives inside MapContainer so it can access map events ───────
function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ── Props ────────────────────────────────────────────────────────────────────────
interface MapPickerInnerProps {
  lat: number | null;
  lng: number | null;
  onSelect: (lat: number, lng: number) => void;
}

// ── Component (default export for dynamic import) ────────────────────────────────
export default function MapPickerInner({ lat, lng, onSelect }: MapPickerInnerProps) {
  const center: [number, number] = [MUSCAT_CENTER.lat, MUSCAT_CENTER.lng];
  const pinIcon = makePinIcon();

  return (
    <MapContainer
      center={center}
      zoom={MUSCAT_DEFAULT_ZOOM}
      className="w-full h-full"
      scrollWheelZoom={false}
      zoomControl={true}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ClickHandler onSelect={onSelect} />
      {lat !== null && lng !== null && (
        <Marker position={[lat, lng]} icon={pinIcon} />
      )}
    </MapContainer>
  );
}
