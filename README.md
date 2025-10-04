# SkyRisk – Weather Risk Predictor

🚀 **NASA Space Apps Challenge – Team Jurassic World**

SkyRisk is a **frontend web app** that helps users predict the likelihood of extreme weather conditions at a specific location and date. It combines **historical climatology data** with **short-term weather forecasts** to provide actionable insights for outdoor events like hikes, vacations, or fishing trips.

---

## Features

* **Date Selection** – Choose the day for which you want to check weather risks.
* **Location Options**

  * Use **current location** via geolocation.
  * Search for any **city worldwide**.
* **Weather Risk Types**

  * 🔥 Very Hot
  * ❄️ Very Cold
  * 💧 Very Wet
  * 💨 Very Windy
* **Climatology vs Forecast** – Compare historical trends with short-term predictions.
* **Skeleton Loading** – Smooth user experience while fetching data.
* **Responsive & Modern UI** – NASA-style dark gradient with Tailwind CSS.

---

## How It Works

1. **Climatology Chance** – Calculated from historical weather data for that location and date.
2. **Forecast Risk** – Calculated from the latest weather forecast for the selected location and date (up to 16 days ahead).
3. **Visual Risk Bars** – Users see percentage-based risk bars for each weather type.

---

## Demo

![./Screenshot 2025-10-04 204733.png]

*(Optional: Add a live demo link if deployed.)*

---

## Technologies Used

* **Frontend:** React.js, Tailwind CSS
* **APIs:** [Open-Meteo Forecast API](https://open-meteo.com/), [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
* **No Backend Required** – Fully frontend app, easy to deploy.

---

## Installation

```bash
git clone https://github.com/Abhishek-Krishna-A-M/SkyRisk
cd SkyRisk
npm install
npm run dev
```

* Open `http://localhost:5173` (if using Vite) to view the app.

---

## Usage

1. Pick a **date**.
2. Select your **location** (geolocation or city search).
3. Click **Check My Location Risk** or **Search**.
4. View **risk percentages** for hot, cold, wet, and windy conditions.

---

## Contributing

SkyRisk is **open-source**. Contributions are welcome!

* Fork the repository
* Create a branch (`git checkout -b feature/new-feature`)
* Commit your changes (`git commit -m 'Add new feature'`)
* Push to branch (`git push origin feature/new-feature`)
* Open a Pull Request

---

## License

This project is licensed under the **MIT License**.

---

## Acknowledgements

* NASA Space Apps Challenge – inspiration and dataset ideas
* [Open-Meteo](https://open-meteo.com/) – free weather and geocoding API

---

