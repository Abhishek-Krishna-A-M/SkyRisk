import { useState } from "react";

// ---------- Progress Bar ----------
function RiskBar({ label, value, icon }) {
  const colors = ["bg-green-500","bg-yellow-400","bg-orange-500","bg-red-600"];
  const idx = value > 75 ? 3 : value > 50 ? 2 : value > 25 ? 1 : 0;

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm font-medium mb-1">
        <span>{icon} {label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-3">
        <div className={`h-3 rounded ${colors[idx]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// ---------- Demo Historical Data (small dataset) ----------
const demoHistData = [
  // Simplified sample data for demonstration
  { month: 0, tmax: 28, tmin: 15, precip: 5, wind: 8 },
  { month: 1, tmax: 30, tmin: 16, precip: 3, wind: 10 },
  { month: 2, tmax: 33, tmin: 18, precip: 2, wind: 9 },
  { month: 3, tmax: 36, tmin: 20, precip: 0, wind: 12 },
  { month: 4, tmax: 38, tmin: 22, precip: 1, wind: 11 },
  { month: 5, tmax: 40, tmin: 25, precip: 0, wind: 13 },
  { month: 6, tmax: 39, tmin: 24, precip: 2, wind: 10 },
  { month: 7, tmax: 37, tmin: 23, precip: 5, wind: 12 },
  { month: 8, tmax: 35, tmin: 21, precip: 8, wind: 9 },
  { month: 9, tmax: 32, tmin: 19, precip: 10, wind: 8 },
  { month: 10, tmax: 30, tmin: 17, precip: 12, wind: 7 },
  { month: 11, tmax: 28, tmin: 15, precip: 15, wind: 6 },
];

// ---------- Main Component ----------
export default function WeatherRisk() {
  const [date, setDate] = useState("2025-10-10");
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");

  // ---------- Fetch Forecast + Compute Risk ----------
  const fetchRisk = async (lat, lon) => {
    setLoading(true);
    setRisk(null);

    try {
      // --- Forecast (Open-Meteo, 16-day max) ---
      const urlFc = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=auto`;
      const dataFc = await fetch(urlFc).then(r => r.json());

      if (!dataFc.daily || !dataFc.daily.time) throw new Error("Forecast data unavailable");

      // Find forecast for selected date
      const targetIdx = dataFc.daily.time.findIndex(d => d === date);
      const fc = targetIdx >= 0 ? {
        hot: dataFc.daily.temperature_2m_max[targetIdx] >= 35 ? 100 : 0,
        cold: dataFc.daily.temperature_2m_min[targetIdx] <= 0 ? 100 : 0,
        wet: dataFc.daily.precipitation_sum[targetIdx] >= 20 ? 100 : 0,
        windy: dataFc.daily.windspeed_10m_max[targetIdx] >= 12 ? 100 : 0,
      } : { hot: null, cold: null, wet: null, windy: null };

      // --- Climatology (demo dataset) ---
      const month = new Date(date).getMonth();
      const hist = demoHistData.find(d => d.month === month);
      const clim = {
        hot: Math.min(Math.floor((hist.tmax >= 35 ? 1 : 0)*100 + Math.random()*10),100),
        cold: Math.min(Math.floor((hist.tmin <= 0 ? 1 : 0)*100 + Math.random()*10),100),
        wet: Math.min(Math.floor((hist.precip >= 20 ? 1 : 0)*100 + Math.random()*10),100),
        windy: Math.min(Math.floor((hist.wind >= 12 ? 1 : 0)*100 + Math.random()*10),100),
      };

      setRisk({
        hot: { clim: clim.hot, fc: fc.hot },
        cold: { clim: clim.cold, fc: fc.cold },
        wet: { clim: clim.wet, fc: fc.wet },
        windy: { clim: clim.windy, fc: fc.windy },
      });

    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather data. Try again later.");
    }

    setLoading(false);
  };

  // ---------- Geolocation ----------
  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(4);
      const lon = pos.coords.longitude.toFixed(4);
      setLocation({ lat, lon, name: "My Location" });
      fetchRisk(lat, lon);
    });
  };

  // ---------- City Search ----------
  const searchCity = async () => {
    if (!city) return;
    setLoading(true);
    setRisk(null);
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
      const res = await fetch(url).then(r => r.json());
      if (res.results && res.results.length > 0) {
        const { latitude, longitude, name, country } = res.results[0];
        setLocation({ lat: latitude, lon: longitude, name: `${name}, ${country}` });
        fetchRisk(latitude, longitude);
      } else {
        alert("City not found");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("City search failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">🚀 NASA Space Apps - Team Jurassic World</h1>
        <p className="text-lg font-semibold text-center">SkyRisk - Weather Predictor</p>
        <p className="text-center mb-10">Explore the weather risks in your area with our advanced analysis tools.</p>

        {/* Date + Location Inputs */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-6">
          <label className="block text-sm mb-1">Choose Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white mb-3"/>
          
          {/* Location options */}
          <button onClick={getMyLocation} className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded mb-3" disabled={loading}>
            {loading ? "Analyzing..." : "📍 Use My Location"}
          </button>

          <div className="flex gap-2">
            <input type="text" placeholder="Enter city name" value={city} onChange={e => setCity(e.target.value)} className="flex-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"/>
            <button onClick={searchCity} className="bg-green-600 hover:bg-green-700 p-2 rounded">🔎</button>
          </div>
        </div>

        {location && (
          <p className="text-center text-sm text-gray-400 mb-4">
            Location: {location.name || `${location.lat}, ${location.lon}`}
          </p>
        )}

        {/* Skeleton Loader */}
        {loading && (
          <div className="grid gap-6">
            {["hot","cold","wet","windy"].map((key) => (
              <div key={key} className="bg-gray-700 p-4 rounded-xl shadow-lg animate-pulse">
                <div className="h-5 bg-gray-500 rounded mb-3 w-3/4"></div>
                <div className="h-3 bg-gray-500 rounded mb-2 w-full"></div>
                <div className="h-3 bg-gray-500 rounded mb-2 w-5/6"></div>
              </div>
            ))}
          </div>
        )}

        {/* Actual Risk Results */}
        {!loading && risk && (
          <div className="grid gap-6">
            {["hot","cold","wet","windy"].map(key => (
              <div key={key} className="bg-gray-800 p-4 rounded-xl shadow-lg">
                <h2 className="font-semibold capitalize mb-2">
                  {key === "hot" && "🔥 Very Hot"}
                  {key === "cold" && "❄️ Very Cold"}
                  {key === "wet" && "💧 Very Wet"}
                  {key === "windy" && "💨 Very Windy"}
                </h2>
                <RiskBar label="Climatology Chance" value={risk[key].clim} icon="📊"/>
                {risk[key].fc !== null && (
                  <RiskBar label="Forecast Risk" value={risk[key].fc} icon="🔮"/>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
