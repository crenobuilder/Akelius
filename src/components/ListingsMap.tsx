"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

interface Props {
  listings: Listing[];
  center: [number, number];
  zoom: number;
  highlightedId?: string | null;
  onPinHover?: (id: string | null) => void;
  /** notifié à chaque déplacement/zoom de la carte */
  onBoundsChange?: (b: MapBounds) => void;
  /** recadre la carte quand cette clé change (critères de recherche) */
  fitKey?: string;
  className?: string;
}

function pinIcon(listing: Listing, active: boolean) {
  return L.divIcon({
    className: `price-pin${active ? " is-active" : ""}`,
    html: `<span>${formatPrice(listing.price, listing.currency)}</span>`,
    iconSize: [0, 0],
  });
}

function FitBounds({ listings, fitKey }: { listings: Listing[]; fitKey?: string }) {
  const map = useMap();
  const listingsRef = useRef(listings);
  listingsRef.current = listings;

  useEffect(() => {
    const current = listingsRef.current;
    if (current.length === 0) return;
    const bounds = L.latLngBounds(current.map((l) => [l.lat, l.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fitKey]);
  return null;
}

function BoundsReporter({ onChange }: { onChange?: (b: MapBounds) => void }) {
  const map = useMapEvents({
    moveend: () => report(),
    zoomend: () => report(),
  });
  function report() {
    if (!onChange) return;
    const b = map.getBounds();
    onChange({
      south: b.getSouth(),
      west: b.getWest(),
      north: b.getNorth(),
      east: b.getEast(),
    });
  }
  return null;
}

export default function ListingsMap({
  listings,
  center,
  zoom,
  highlightedId,
  onPinHover,
  onBoundsChange,
  fitKey,
  className,
}: Props) {
  const router = useRouter();

  const markers = useMemo(
    () =>
      listings.map((l) => (
        <Marker
          key={`${l.id}-${highlightedId === l.id ? "on" : "off"}`}
          position={[l.lat, l.lng]}
          icon={pinIcon(l, highlightedId === l.id)}
          eventHandlers={{
            mouseover: () => onPinHover?.(l.id),
            mouseout: () => onPinHover?.(null),
            click: () => router.push(`/bien/${l.slug}`),
          }}
        />
      )),
    [listings, highlightedId, onPinHover, router]
  );

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png" />
        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png" />
        <FitBounds listings={listings} fitKey={fitKey} />
        <BoundsReporter onChange={onBoundsChange} />
        {markers}
      </MapContainer>
    </div>
  );
}
