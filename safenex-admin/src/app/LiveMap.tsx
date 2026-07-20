import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for default Leaflet icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
    id: string;
    user_id: string;
    latitude: number;
    longitude: number;
    source?: string;
    timestamp: string;
}

export default function LiveMap({ locations }: { locations: Location[] }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    const defaultCenter: [number, number] = [30.3753, 69.3451];

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '400px' }}>
            <MapContainer
                center={locations.length > 0 ? [locations[0].latitude, locations[0].longitude] : defaultCenter}
                zoom={locations.length > 0 ? 15 : 5}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc) => (
                    <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                        <Popup>
                            <strong>Source: {loc.source === 'hardware' ? '⌚ Wearable' : '📱 Mobile App'}</strong> <br />
                            User: {loc.user_id.slice(0, 8)}... <br />
                            Time: {new Date(loc.timestamp).toLocaleTimeString()}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
