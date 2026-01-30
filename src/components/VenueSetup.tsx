import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Loader2, Check } from 'lucide-react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

// Fix for default marker icon in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface VenueSetupProps {
  onComplete: () => void;
}

// Component to update map view when position changes
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const VenueSetup: React.FC<VenueSetupProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [venueName, setVenueName] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressQuery.length > 3 && !selectedLocation) {
        handleSearch();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [addressQuery]);

  const handleSearch = async () => {
    if (!addressQuery) return;
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectLocation = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setSelectedLocation([lat, lon]);
    setAddressQuery(result.display_name);
    setSearchResults([]); // Clear results
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !venueName || !selectedLocation) return;

    setSubmitting(true);
    try {
      // 1. Create Venue Document
      // We use the user's ID as the venue ID for simplicity in this 1:1 model
      // or generate a new ID if we want multiple venues per user later.
      // For now, let's assume 1 venue per owner.
      const venueRef = doc(db, 'venues', user.id); 
      
      await setDoc(venueRef, {
        name: venueName,
        address: addressQuery,
        location: {
          lat: selectedLocation[0],
          lng: selectedLocation[1]
        },
        ownerId: user.id,
        createdAt: new Date().toISOString()
      });

      // 2. Update User Profile with venueId
      const userRef = doc(db, 'profiles', user.id);
      await updateDoc(userRef, {
        venueId: user.id,
        hasCompletedSetup: true
      });

      onComplete();
    } catch (error) {
      console.error("Error creating venue:", error);
      alert("Failed to create venue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Setup Your Venue</h2>
        <p className="text-white/60">Tell us about your business location.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Venue Name */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Venue Name</label>
          <input
            type="text"
            required
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all outline-none text-white placeholder-white/30"
            placeholder="e.g. Downtown Bar & Grill"
          />
        </div>

        {/* Address Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-white/80 mb-2">Venue Address</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              required
              value={addressQuery}
              onChange={(e) => {
                setAddressQuery(e.target.value);
                setSelectedLocation(null); // Reset selection on edit
              }}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all outline-none text-white placeholder-white/30"
              placeholder="Search address..."
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-cyan-400" size={20} />
              </div>
            )}
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && !selectedLocation && (
            <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {searchResults.map((result: any, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 text-white/80 text-sm border-b border-white/5 last:border-0 transition-colors"
                >
                  <div className="font-medium text-white">{result.display_name.split(',')[0]}</div>
                  <div className="text-xs text-white/50 truncate">{result.display_name}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
          <MapContainer 
            center={selectedLocation || [51.505, -0.09]} 
            zoom={selectedLocation ? 16 : 13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedLocation && (
              <>
                <Marker position={selectedLocation} />
                <ChangeView center={selectedLocation} zoom={16} />
              </>
            )}
          </MapContainer>
          
          {!selectedLocation && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center pointer-events-none z-[400]">
              <div className="text-center text-white/50">
                <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                <p>Search and select an address to view on map</p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedLocation || !venueName || submitting}
          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Check className="mr-2" />
          )}
          {submitting ? 'Setting up...' : 'Confirm Venue'}
        </button>
      </form>
    </div>
  );
};

export default VenueSetup;
