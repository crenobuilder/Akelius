"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import SmartImage from "./SmartImage";

interface Props {
  listings: Listing[];
  center: [number, number];
  zoom: number;
  highlightedId?: string | null;
  onPinHover?: (id: string | null) => void;
  className?: string;
}

function pinIcon(listing: Listing, active: boolean) {
  return L.divIcon({
    className: `price-pin${active ? " is-active" : ""}`,
    html: `<span>${formatPrice(listing.price, listing.currency)}</span>`,
    iconSize: [0, 0],
  });
}

function FitBounds({ listings }: { listings: Listing[] }) {
  const map = useMap();
  useEffect(() => {
    if (listings.length === 0) return;
    const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
  }, [map, listings]);
  return null;
}

export default function ListingsMap({
  listings,
  center,
  zoom,
  highlightedId,
  onPinHover,
  className,
}: Props) {
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
          }}
        >
          <Popup closeButton={false} offset={[0, -34]}>
            <Link href={`/bien/${l.slug}`} className="block bg-white">
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#edebe6]">
                <SmartImage
                  src={l.photos[0]}
                  alt={l.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <p className="text-sm font-bold text-[#171717]">
                  {formatPrice(l.price, l.currency)}
                  <span className="ml-1 text-xs font-normal text-[#716c66]">/ mois</span>
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-[#3f3d3a]">{l.title}</p>
              </div>
            </Link>
          </Popup>
        </Marker>
      )),
    [listings, highlightedId, onPinHover]
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
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <FitBounds listings={listings} />
        {markers}
      </MapContainer>
    </div>
  );
}
