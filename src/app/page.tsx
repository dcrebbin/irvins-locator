"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import LocationIcon from "./_components/icons/location";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGNyZWJiaW4iLCJhIjoiY20wZzQwYndzMTBhbDJucTMzeDBxMWZpbSJ9.y42ThEhP-QmE7f5_ClUW6g";

interface SearchResult {
  price: number;
  store: string;
  url: string;
  address: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const lng = -70.9;
  const lat = 42.35;
  const zoom = 9;
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  function requestLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.current?.setCenter([longitude, latitude]);
      map.current?.setZoom(12);

      setLocation({ latitude, longitude });
      void fetch("/api/location/reverse", {
        method: "POST",
        body: JSON.stringify({ latitude, longitude }),
      })
        .then((response: Response) => response.json())
        .then((data: { cityName: string; countryName: string }) => {
          setCity(data.cityName);
          setCountry(data.countryName);
        });
    });
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    addPlace(lng, lat, {
      price: 0,
      store: "Irvins",
      url: "https://irvins.com",
      address: "123 Main St, Boston, MA 02118",
      description: "Irvins is a bakery that sells cookies.",
      coordinates: {
        latitude: lat,
        longitude: lng,
      },
    });
    requestLocation();
  }, [lng, lat]);

  function addPlace(longitude: number, latitude: number, data: SearchResult) {
    map.current?._addPopup(
      new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        closeOnMove: false,
      })
        .setLngLat([longitude, latitude])
        .setHTML(
          `<div class="max-w-[200px] min-w-[150px] rounded-md bg-white p-2">
            <h1 class="text-sm font-bold text-gray-800 truncate">${data.store}</h1>
            <p class="text-xs font-semibold text-green-600">${data.price}</p>
            <p class="text-xs text-gray-600 truncate">${data.address}</p>
            <a href="${data.url}" target="_blank" class="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors block text-center">View</a>
           </div>`,
        )
        .addTo(map.current),
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="z-[1000] w-screen rounded-m  text-black flex flex-col items-center justify-center text-center">
        <Image src="/images/top-bar.png" alt="Irvins" className="w-full h-auto object-fit" width={1920} height={30} />
        <div className="flex items-center justify-center">
          <h1 className="text-6xl text-center font-[Irvins] pb-4 flex items-center justify-center w-full leading-none">
            Irvins Locator
          </h1>
          <button onClick={requestLocation} className="bg-black rounded-full p-3 mx-2">
            <Image src="/images/location.png" alt="Location" width={24} height={24} />
          </button>
        </div>
      </div>
      <Image src="/images/crisps.png" width={100} height={100} alt="Irvins" className="z-[1000] fixed right-0 bottom-0 mx-20 mb-10" />
      <div className="relative w-[100vw] flex h-fit bg-red-300 overflow-hidden">

        <div ref={mapContainer} className="map-container relative" />
        <style jsx>{`
        .map-container {
          height: 90vh;
          width: 100vw;
          }
          `}</style>
        <Image src="/images/side-1.png" alt="Irvins" className="w-full h-auto object-fit absolute bottom-0 z-[1000]" width={1920} height={20} />
        <Image src="/images/side-3.png" alt="Irvins" className="w-auto h-full object-fit absolute right-0 bottom-0 z-[1000]" width={103} height={1000} />
        <Image src="/images/side-3.png" alt="Irvins" className="w-auto h-screen object-fit absolute left-0 rotate-180 bottom-0 z-[1000]" width={103} height={1000} />
        <Image src="/images/side-1.png" alt="Irvins" className="w-full -mt-2 h-auto object-fit absolute rotate-180 top-0 left-0 z-[1000]" width={1920} height={20} />
      </div>

    </div>
  );
}
