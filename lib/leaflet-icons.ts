import L from "leaflet"

export function pinIcon(color: string, size = 28) {
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <svg viewBox="0 0 24 24" width="${size}" height="${size}" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));">
        <path d="M12 0C7.03 0 3 4.03 3 9c0 6.5 7.5 14.5 8.4 15.4a.85.85 0 0 0 1.2 0C13.5 23.5 21 15.5 21 9c0-4.97-4.03-9-9-9z" fill="${color}"/>
        <circle cx="12" cy="9" r="3.4" fill="white"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  })
}

export function dotIcon(color: string, size = 14) {
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}
