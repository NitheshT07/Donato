import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  label?: string;
}

interface MapViewProps {
  donorLocation?: Location;
  destinationLocation?: Location;
  route?: { lat: number; lng: number }[];
  height?: string;
}

export default function MapView({ 
  donorLocation, 
  destinationLocation, 
  route,
  height = '400px'
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // This is a placeholder for map integration
    // In production, integrate with Google Maps or Mapbox
    setMapLoaded(true);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900">Delivery Route</h3>
          <Navigation className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ height }}
        className="relative bg-gradient-to-br from-blue-50 to-green-50"
      >
        {!mapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-800 mb-2">Map Integration Ready</p>
                <p className="text-gray-600">
                  Connect to Google Maps API or Mapbox for live route visualization
                </p>
                
                {donorLocation && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-left">
                    <p className="text-gray-700">
                      <span className="text-blue-600">Pickup:</span> {donorLocation.label || `${donorLocation.lat.toFixed(4)}, ${donorLocation.lng.toFixed(4)}`}
                    </p>
                  </div>
                )}
                
                {destinationLocation && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg text-left">
                    <p className="text-gray-700">
                      <span className="text-green-600">Destination:</span> {destinationLocation.label || `${destinationLocation.lat.toFixed(4)}, ${destinationLocation.lng.toFixed(4)}`}
                    </p>
                  </div>
                )}

                {route && route.length > 0 && (
                  <div className="mt-2 p-3 bg-amber-50 rounded-lg">
                    <p className="text-gray-700">
                      Route points: {route.length}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-gray-500 px-4">
                API Configuration: Set GOOGLE_MAPS_API_KEY or MAPBOX_TOKEN in environment
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Route Info Footer */}
      {route && route.length > 0 && (
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-gray-600">
            <span>Optimized route loaded</span>
            <span>{route.length} waypoints</span>
          </div>
        </div>
      )}
    </div>
  );
}
