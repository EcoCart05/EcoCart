import React from "react";
// If you want to use @react-google-maps/api, make sure it's installed and properly versioned for React 18
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyD0ysOLiDjQLhFB1aD6Sh1EMGvZGmy8PLE";

const containerStyle = {
  width: '100%',
  height: '400px',
};

const shops = [
  { id: 1, name: "Eco Mart Central", lat: 28.6139, lng: 77.2090 },
  { id: 2, name: "Green Store South", lat: 28.5355, lng: 77.3910 },
  { id: 3, name: "Nature's Basket", lat: 28.4089, lng: 77.3178 },
  // Online stores (central India marker)
  { id: 4, name: "EcoShop India (Online)", lat: 22.9734, lng: 78.6569, url: "https://ecoshopindia.in/" },
  { id: 5, name: "EcoKarma (Online)", lat: 23.2599, lng: 77.4126, url: "https://www.ecokarma.co.in/" },
  // Physical store Mumbai
  { id: 6, name: "Adrish - Zero-waste Organic Store", lat: 19.0586, lng: 72.8305, url: "https://www.bing.com/maps?&ty=18&q=Adrish%20-%20Zero-waste%20Organic%20Store%20eco%20friendly%20product%20shop&ss=ypid.YN4070x9471061313540206345&mb=23.404947~68.138187~14.781882~77.516999&description=Shop%20No.2%2C%20New%20Silver%20Sands%20CHS%2C%2014-B%2C%20Pali%20Rd%2C%20Near%20Gold%27s%20Gym%2C%20Bandra%20West%2C%20Mumbai%2C%20Maharashtra%C2%B7Organic%20store&usebfpr=true&dt=1744972200000&tt=Adrish%20-%20Zero-waste%20Organic%20Store&tsts0=%2526ty%253D18%2526q%253DAdrish%252520-%252520Zero-waste%252520Organic%252520Store%252520eco%252520friendly%252520product%252520shop%2526ss%253Dypid.YN4070x9471061313540206345%2526mb%253D23.404947~68.138187~14.781882~77.516999%2526description%253DShop%252520No.2%25252C%252520New%252520Silver%252520Sands%252520CHS%25252C%25252014-B%25252C%252520Pali%252520Rd%25252C%252520Near%252520Gold%252527s%252520Gym%25252C%252520Bandra%252520West%25252C%252520Mumbai%25252C%252520Maharashtra%2525C2%2525B7Organic%252520store%2526usebfpr%253Dtrue%2526dt%253D1744972200000&tstt0=Adrish%20-%20Zero-waste%20Organic%20Store&cp=19.149711~66.536927&lvl=6.62&pi=0&ftst=0&ftics=False&v=2&sV=2&form=S00027" },
  // The Eco Store (Bangalore, from Google link)
  { id: 7, name: "The Eco Store", lat: 12.9279235, lng: 77.6138938, url: "https://g.co/kgs/z65Doqt" },
  // Green Mantra (Bangalore, from Google link)
  { id: 8, name: "Green Mantra", lat: 12.9718915, lng: 77.6411545, url: "https://g.co/kgs/hFiL5En" },
  // Bare Necessities Zero Waste India (Bangalore)
  { id: 9, name: "Bare Necessities Zero Waste India", lat: 12.9352212, lng: 77.6146186, url: "https://g.co/kgs/X8XrTh5" },
  // Ecoindian - Organic Store (Chennai)
  { id: 10, name: "Ecoindian - Organic Store", lat: 13.0612216, lng: 80.2452355, url: "https://maps.app.goo.gl/DpLafFfsZDjnthsz5" },
  // Eco Store (Bangalore)
  { id: 11, name: "Eco Store", lat: 12.9268929, lng: 77.6016277, url: "https://maps.app.goo.gl/LTicg4PqiGjAcBNB8" },
];

const center = { lat: 28.6139, lng: 77.2090 };

const GoogleMapShopLocator: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading Google Map...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Shop Locator (Google Maps)</h2>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {shops.map((shop) => (
          <Marker key={shop.id} position={{ lat: shop.lat, lng: shop.lng }} label={shop.name}
            onClick={() => {
              // Optionally, you can handle marker clicks
            }}
          >
            {shop.url && (
              <div style={{ padding: 4 }}>
                <a href={shop.url} target="_blank" rel="noopener noreferrer" style={{ color: '#256029', fontWeight: 600 }}>
                  {shop.name}
                </a>
              </div>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapShopLocator;
