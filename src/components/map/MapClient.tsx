"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { useMapStore } from "@/store/map.store";
import {
  TILE_URL,
  TILE_ATTRIBUTION,
  MAP_MIN_ZOOM,
  MAP_MAX_ZOOM,
  MUSCAT_CENTER,
  MUSCAT_DEFAULT_ZOOM,
} from "@/lib/constants/map-constants";
import {
  formatPriceBubble,
  getMarkerState,
  getMarkerColors,
} from "@/lib/helpers/map-utils";
import { isBelowMarket } from "@/lib/helpers/listing-filters";
import type { Listing } from "@/types/listing";

// ── Price bubble DivIcon ───────────────────────────────────────────────────────

function createPriceMarker(
  listing: Listing,
  isSelected: boolean,
  isBelowMkt: boolean
): L.DivIcon {
  const state = getMarkerState(listing, isSelected, isBelowMkt);
  const c = getMarkerColors(state);
  const label = formatPriceBubble(listing.price, listing.purpose);
  const scale = isSelected ? "scale(1.14)" : "scale(1)";

  // Verified dot color inside bubble
  const dotColor = state === "normal" ? "#0A3C36" : state === "featured" ? "#D4A017" : "#FFFFFF";

  const html = `
    <div style="
      display:inline-flex;
      align-items:center;
      gap:4px;
      background:${c.bg};
      color:${c.text};
      border:1.5px solid ${c.border};
      padding:5px 10px;
      border-radius:20px;
      font-size:12px;
      font-weight:700;
      white-space:nowrap;
      box-shadow:${c.shadow};
      font-family:system-ui,sans-serif;
      transform:translate(-50%,-50%) ${scale};
      transition:transform 0.15s ease,box-shadow 0.15s ease;
      letter-spacing:0.01em;
      cursor:pointer;
    ">
      ${label}
      ${listing.isVerified
        ? `<span style="width:6px;height:6px;background:${dotColor};border-radius:50%;display:inline-block;flex-shrink:0;"></span>`
        : ""}
    </div>`;

  return L.divIcon({
    html,
    className: "maqar-marker",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// ── Map event handlers (inside MapContainer) ───────────────────────────────────

function MapEventHandlers({
  onSelectListing,
}: {
  onSelectListing: (id: string | null) => void;
}) {
  const { setCenter, setZoom } = useMapStore();

  useMapEvents({
    click: () => onSelectListing(null),
    moveend: (e) => {
      const map = e.target as L.Map;
      const c = map.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
      setZoom(map.getZoom());
    },
  });

  return null;
}

// ── Current location button ────────────────────────────────────────────────────

function CurrentLocationControl() {
  const map = useMap();
  const { setUserLocation, setUserLocationStatus, userLocationStatus } =
    useMapStore();

  function handleClick() {
    if (!navigator.geolocation) {
      setUserLocationStatus("unavailable");
      return;
    }
    setUserLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const center = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(center);
        setUserLocationStatus("granted");
        map.setView([center.lat, center.lng], 15, { animate: true });
      },
      () => {
        setUserLocationStatus("denied");
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }

  const isRequesting = userLocationStatus === "requesting";

  return (
    <div
      style={{
        position: "absolute",
        right: "12px",
        bottom: "88px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleClick}
        disabled={isRequesting}
        aria-label="موقعي الحالي"
        style={{
          width: "44px",
          height: "44px",
          background: "white",
          border: "1.5px solid #E2E8F0",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: isRequesting ? "wait" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          transition: "box-shadow 0.15s ease",
        }}
      >
        {isRequesting ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A3C36"
            strokeWidth="2.5"
            style={{ animation: "spin-slow 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0A3C36"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        )}
      </button>
    </div>
  );
}

// ── Reset map button ───────────────────────────────────────────────────────────

function ResetMapControl() {
  const map = useMap();
  const { selectListing } = useMapStore();

  function handleReset() {
    map.setView(
      [MUSCAT_CENTER.lat, MUSCAT_CENTER.lng],
      MUSCAT_DEFAULT_ZOOM,
      { animate: true }
    );
    selectListing(null);
  }

  return (
    <div
      style={{
        position: "absolute",
        right: "12px",
        bottom: "144px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleReset}
        aria-label="إعادة تعيين الخريطة"
        title="إعادة تعيين"
        style={{
          width: "44px",
          height: "44px",
          background: "white",
          border: "1.5px solid #E2E8F0",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#627D98"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </div>
  );
}

// ── User location dot ──────────────────────────────────────────────────────────

function UserLocationMarker() {
  const { userLocation } = useMapStore();
  if (!userLocation) return null;

  const icon = L.divIcon({
    html: `<div style="width:16px;height:16px;background:#2471A3;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(36,113,163,0.5);"></div>`,
    className: "maqar-user-location",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return <Marker position={[userLocation.lat, userLocation.lng]} icon={icon} />;
}

// ── Main MapClient export ──────────────────────────────────────────────────────

interface MapClientProps {
  listings: Listing[];
  selectedListingId: string | null;
  onSelectListing: (id: string | null) => void;
}

export function MapClient({
  listings,
  selectedListingId,
  onSelectListing,
}: MapClientProps) {
  const { center, zoom } = useMapStore();

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      minZoom={MAP_MIN_ZOOM}
      maxZoom={MAP_MAX_ZOOM}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

      <MapEventHandlers onSelectListing={onSelectListing} />
      <CurrentLocationControl />
      <ResetMapControl />
      <UserLocationMarker />

      {listings.map((listing) => {
        const coords = listing.location.coordinates;
        if (!coords) return null;

        const isSelected = listing.id === selectedListingId;
        const isBelowMkt = isBelowMarket(listing);

        return (
          <Marker
            key={listing.id}
            position={[coords.lat, coords.lng]}
            icon={createPriceMarker(listing, isSelected, isBelowMkt)}
            zIndexOffset={isSelected ? 1000 : listing.isFeatured ? 500 : 0}
            eventHandlers={{
              click: (e) => {
                e.originalEvent.stopPropagation();
                onSelectListing(listing.id);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}
