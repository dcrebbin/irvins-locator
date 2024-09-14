"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { LOCATIONS } from "./common/locations";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZGNyZWJiaW4iLCJhIjoiY20wZzQwYndzMTBhbDJucTMzeDBxMWZpbSJ9.y42ThEhP-QmE7f5_ClUW6g";

interface SearchResult {
  price: string;
  address: string;
}

export default function Home() {

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const zoom = 3;
  const center = [103.98641487138919, 1.3559609211311883];

  function requestLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.current?.setCenter([longitude, latitude]);
      map.current?.setZoom(9);
    });
  }

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center as mapboxgl.LngLatLike,
      zoom: zoom,
    });

    LOCATIONS.forEach((location) => {
      addPlace(location.coordinates[0]!, location.coordinates[1]!, location);
    });

    requestLocation();
  }, []);

  function addPlace(longitude: number, latitude: number, data: SearchResult) {
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
    });

    const marker = new mapboxgl.Marker({
      element: createCustomMarker(popup, data),
      anchor: 'bottom'
    })
      .setLngLat([longitude, latitude])
      .addTo(map.current!);

    popup.setLngLat([longitude, latitude]);
  }

  function createCustomMarker(popup: mapboxgl.Popup, data: SearchResult) {
    const markerElement = document.createElement('div');

    const duck = document.createElement('img');
    duck.src = '/images/duck.svg';
    duck.alt = 'Duck';
    duck.className = 'w-10 h-10 cursor-pointer mt-8 z-[1000]';
    duck.onclick = () => {
      const contentIsVisible = markerElement.classList.contains('visible');
      if (contentIsVisible) {
        popup.remove();
        markerElement.classList.remove('visible');
      } else {
        popup.setDOMContent(createPopupContent(data));
        popup.addTo(map.current!);
        markerElement.classList.add('visible');
      }
    };
    markerElement.style.marginTop = '40px';
    markerElement.appendChild(duck);
    return markerElement;
  }

  function createPopupContent(data: SearchResult) {
    const container = document.createElement('div');
    container.className = 'max-w-[150px] min-w-[100px] h-fit rounded-md bg-white p-2 flex flex-col items-center justify-center top-24';

    const address = document.createElement('p');
    address.className = 'text-xs text-gray-600 font-bold';
    address.style.wordWrap = 'break-word';
    address.style.maxWidth = '100%';
    address.textContent = data.address;
    container.appendChild(address);

    const price = document.createElement('p');
    price.className = 'text-xs font-semibold text-green-600';
    price.textContent = data.price.toString();
    container.appendChild(price);

    return container;
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
      <div className="relative w-[100vw] flex h-fit overflow-hidden">

        <div ref={mapContainer} className="map-container relative" />
        <style jsx>{`
        .map-container {
          height: 90vh;
          width: 100vw;
          }
          `}</style>
        <Image src="/images/side-1.png" alt="Irvins" className="w-full h-auto object-fit absolute bottom-0 z-[1000]" width={1920} height={20} />
        <Image src="/images/side-3.png" alt="Irvins" className="w-[25px] md:w-[40px] lg:w-[60px] xl:w-auto h-full object-fit absolute right-0 bottom-0 z-[1000]" width={103} height={1000} />
        <Image src="/images/side-3.png" alt="Irvins" className="w-[25px] md:w-[40px] lg:w-[60px] xl:w-auto h-screen object-fit absolute left-0 rotate-180 bottom-0 z-[1000]" width={103} height={1000} />
        <Image src="/images/side-1.png" alt="Irvins" className="w-full -mt-2 h-auto object-fit absolute rotate-180 top-0 left-0 z-[1000]" width={1920} height={20} />
      </div>

    </div>
  );
}
