import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, LayersControl, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// Sample shop data (replace with real data or props)
const shops = [
  { id: 1, name: "Eco Mart Central", lat: 28.6139, lng: 77.2090, products: ["T-Shirt"], type: "physical", city: "Delhi" },
  { id: 2, name: "Green Store South", lat: 28.5355, lng: 77.3910, products: ["Bag"], type: "physical", city: "Noida" },
  { id: 3, name: "Nature's Basket", lat: 28.4089, lng: 77.3178, products: ["Bottle"], type: "physical", city: "Gurgaon" },
  { id: 4, name: "Eco Plaza", lat: 28.7041, lng: 77.1025, products: ["T-Shirt", "Bag"], type: "physical", city: "Delhi" },
  { id: 5, name: "GreenLeaf", lat: 28.4595, lng: 77.0266, products: ["Bottle", "Bag"], type: "physical", city: "Gurgaon" },
  // Online stores
  { id: 6, name: "EcoShop India (Online)", lat: 22.9734, lng: 78.6569, products: [], type: "online", url: "https://ecoshopindia.in/", city: "Online" },
  { id: 7, name: "EcoKarma (Online)", lat: 23.2599, lng: 77.4126, products: [], type: "online", url: "https://www.ecokarma.co.in/", city: "Online" },
  // Physical store Mumbai
  { id: 8, name: "Adrish - Zero-waste Organic Store", lat: 19.0586, lng: 72.8305, products: [], type: "physical", url: "https://www.bing.com/maps?&ty=18&q=Adrish%20-%20Zero-waste%20Organic%20Store%20eco%20friendly%20product%20shop&ss=ypid.YN4070x9471061313540206345&mb=23.404947~68.138187~14.781882~77.516999&description=Shop%20No.2%2C%20New%20Silver%20Sands%20CHS%2C%2014-B%2C%20Pali%20Rd%2C%20Near%20Gold%27s%20Gym%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra%C2%B7Organic%20store&usebfpr=true&dt=1744972200000&tt=Adrish%20-%20Zero-waste%20Organic%20Store&tsts0=%2526ty%253D18%2526q%253DAdrish%252520-%252520Zero-waste%252520Organic%252520Store%252520eco%252520friendly%252520product%252520shop%2526ss%253Dypid.YN4070x9471061313540206345%2526mb%253D23.404947~68.138187~14.781882~77.516999%2526description%253DShop%252520No.2%25252C%252520New%252520Silver%252520Sands%252520CHS%25252C%25252014-B%25252C%252520Pali%252520Rd%25252C%252520Near%252520Gold%252527s%252520Gym%25252C%252520Bandra%252520West%25252C%252520Mumbai%25252C%252520Maharashtra%2525C2%2525B7Organic%252520store%2526usebfpr%253Dtrue%2526dt%253D1744972200000&tstt0=Adrish%20-%20Zero-waste%20Organic%20Store&cp=19.149711~66.536927&lvl=6.62&pi=0&ftst=0&ftics=False&v=2&sV=2&form=S00027", address: "Shop No.2, New Silver Sands CHS, 14-B, Pali Rd, Near Gold's Gym, Bandra West, Mumbai, Maharashtra", city: "Mumbai" },
  // The Eco Store (Bangalore, from Google link)
  { id: 9, name: "The Eco Store", lat: 12.9279235, lng: 77.6138938, products: [], type: "physical", url: "https://g.co/kgs/z65Doqt", city: "Bangalore" },
  // Green Mantra (Bangalore, from Google link)
  { id: 10, name: "Green Mantra", lat: 12.9718915, lng: 77.6411545, products: [], type: "physical", url: "https://g.co/kgs/hFiL5En", city: "Bangalore" },
  // Bare Necessities Zero Waste India (Bangalore)
  { id: 11, name: "Bare Necessities Zero Waste India", lat: 12.9352212, lng: 77.6146186, products: [], type: "physical", url: "https://g.co/kgs/X8XrTh5", city: "Bangalore" },
  // Ecoindian - Organic Store (Chennai)
  { id: 12, name: "Ecoindian - Organic Store", lat: 13.0612216, lng: 80.2452355, products: [], type: "physical", url: "https://maps.app.goo.gl/DpLafFfsZDjnthsz5", city: "Chennai" },
  // Eco Store (Bangalore)
  { id: 13, name: "Eco Store", lat: 12.9268929, lng: 77.6016277, products: [], type: "physical", url: "https://maps.app.goo.gl/LTicg4PqiGjAcBNB8", city: "Bangalore" },
];

function LocateUser() {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
    function onLocationFound(e) {
      L.circle(e.latlng, { radius: e.accuracy }).addTo(map);
      L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();
    }
    map.on("locationfound", onLocationFound);
    return () => {
      map.off("locationfound", onLocationFound);
    };
  }, [map]);
  return null;
}

const LeafletShopLocator: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState("All Cities");
  const [activeMarker, setActiveMarker] = React.useState<number|null>(null);
  const [userPosition, setUserPosition] = React.useState<[number, number]|null>(null);
  const [userAddress, setUserAddress] = React.useState<string>("");

  // Get unique cities for dropdown
  const cities = Array.from(new Set(["All Cities", ...shops.map(s => s.city)]));
  const filteredShops = shops.filter(shop =>
    (selectedCity === "All Cities" || shop.city === selectedCity) &&
    (shop.name.toLowerCase().includes(search.toLowerCase()) ||
     shop.products.some(p => p.toLowerCase().includes(search.toLowerCase())))
  );

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        // Reverse geocode for address (using Nominatim)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
          .then(res => res.json())
          .then(data => setUserAddress(data.display_name || ""));
      });
    }
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          className="border p-2 rounded md:w-48 w-full"
          aria-label="Filter by city"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search shops or products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
          aria-label="Search shops or products"
        />
      </div>
      <MapContainer center={[28.6139, 77.2090]} zoom={11} style={{ height: "400px", width: "100%" }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <LocateUser />
        <MarkerClusterGroup>
          {filteredShops.map(shop => {
            // Custom icon for online vs physical
            const icon = L.icon({
              iconUrl: shop.type === "online"
                ? "https://cdn-icons-png.flaticon.com/512/1042/1042330.png"
                : "https://cdn-icons-png.flaticon.com/512/854/854878.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });
            const isActive = activeMarker === shop.id;
            return (
              <Marker
                key={shop.id}
                position={[shop.lat, shop.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => setActiveMarker(shop.id),
                  popupclose: () => setActiveMarker(null),
                }}
              >
                <Popup>
                  <div style={{minWidth: 180}}>
                    <div style={{fontWeight: 700, fontSize: 18, marginBottom: 4}}>{shop.name}</div>
                    {shop.type === "online" && (
                      <span style={{background: '#38bdf8', color: 'white', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginBottom: 4, display: 'inline-block'}}>Online Store</span>
                    )}
                    {shop.type === "physical" && shop.address && (
                      <div style={{fontSize: 13, color: '#444', margin: '6px 0'}}>{shop.address}</div>
                    )}
                    {shop.url && (
                      <a href={shop.url} target="_blank" rel="noopener noreferrer" style={{display: 'inline-block', marginTop: 8, background: '#16a34a', color: 'white', padding: '6px 16px', borderRadius: 8, fontWeight: 600, textDecoration: 'none'}}>Visit Store</a>
                    )}
                    {shop.type === "physical" && userPosition && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${userPosition[0]},${userPosition[1]}&destination=${shop.lat},${shop.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{display: 'inline-block', marginTop: 8, background: '#2563eb', color: 'white', padding: '4px 12px', borderRadius: 8, fontWeight: 500, textDecoration: 'none'}}>
                        Get Directions
                      </a>
                    )}
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={!isActive}>
                  {shop.name}
                </Tooltip>
              </Marker>
            );
          })}
          {/* User marker */}
          {userPosition && (
            <Marker position={userPosition} icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}>
              <Popup>
                <div style={{fontWeight: 700, fontSize: 16, marginBottom: 4}}>You are here</div>
                {userAddress && <div style={{fontSize: 13, color: '#444'}}>{userAddress}</div>}
              </Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
        <div style={{position: 'absolute', bottom: 0, left: 0, padding: 10, backgroundColor: 'white', border: '1px solid #ddd', borderRadius: 5}}>
          <h6>Legend</h6>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 4}}>
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" style={{width: 20, height: 20, marginRight: 8}} />
            <span>Physical Store</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img src="https://cdn-icons-png.flaticon.com/512/1042/1042330.png" style={{width: 20, height: 20, marginRight: 8}} />
            <span>Online Store</span>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default LeafletShopLocator;
