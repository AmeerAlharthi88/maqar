import { create } from "zustand";

// ── Types ──────────────────────────────────────────────────────────────────────

export type MapViewMode = "map" | "list";

export type UserLocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable";

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface MapLayerState {
  schools: boolean;
  mosques: boolean;
  hospitals: boolean;
  beaches: boolean;
  malls: boolean;
  fuelStations: boolean;
  wadiRisk: boolean;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const MUSCAT_CENTER: MapCenter = { lat: 23.588, lng: 58.3829 };
const MUSCAT_ZOOM = 12;

const DEFAULT_LAYERS: MapLayerState = {
  schools: false,
  mosques: false,
  hospitals: false,
  beaches: false,
  malls: false,
  fuelStations: false,
  wadiRisk: false,
};

// ── Store interface ────────────────────────────────────────────────────────────

interface MapState {
  center: MapCenter;
  zoom: number;
  selectedListingId: string | null;
  viewMode: MapViewMode;
  userLocation: MapCenter | null;
  userLocationStatus: UserLocationStatus;
  layers: MapLayerState;

  setCenter: (center: MapCenter) => void;
  setZoom: (zoom: number) => void;
  selectListing: (id: string | null) => void;
  setViewMode: (mode: MapViewMode) => void;
  setUserLocation: (loc: MapCenter | null) => void;
  setUserLocationStatus: (status: UserLocationStatus) => void;
  toggleLayer: (layer: keyof MapLayerState) => void;
  resetMap: () => void;
}

// ── Store ──────────────────────────────────────────────────────────────────────

export const useMapStore = create<MapState>()((set) => ({
  center: MUSCAT_CENTER,
  zoom: MUSCAT_ZOOM,
  selectedListingId: null,
  viewMode: "map",
  userLocation: null,
  userLocationStatus: "idle",
  layers: { ...DEFAULT_LAYERS },

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  selectListing: (id) => set({ selectedListingId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setUserLocation: (loc) => set({ userLocation: loc }),
  setUserLocationStatus: (status) => set({ userLocationStatus: status }),

  toggleLayer: (layer) =>
    set((s) => ({ layers: { ...s.layers, [layer]: !s.layers[layer] } })),

  resetMap: () =>
    set({
      center: MUSCAT_CENTER,
      zoom: MUSCAT_ZOOM,
      selectedListingId: null,
    }),
}));
