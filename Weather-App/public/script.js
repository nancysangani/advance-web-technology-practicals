const weatherContainer = document.getElementById("weather-container");
const city = document.getElementById("city");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const cityName = searchInput.value.trim();

  if (cityName === "") {
    alert("Please enter a city name");
    return;
  }

  searchBtn.disabled = true;
  searchBtn.textContent = "Loading...";

  fetch(
    `/api/weather?city=${encodeURIComponent(cityName)}`
  )
    .then((res) => res.json())
    .then((data) => {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";

      if (data.error) {
        weatherContainer.innerHTML = `<p class="error-msg">${data.error}</p>`;
        return;
      }

      const lastUpdated = new Date(data.current.last_updated);
      const now = new Date();
      const diffMs = now - lastUpdated;
      let diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 0) diffMins = 0;

      weatherContainer.innerHTML = `
      <div id="current-weather">
        <div class="weather-main">
          <div id="city">${data.location.name}, ${data.location.country}</div>

          <div id="date-time">
            <i class="far fa-calendar-alt"></i>
            <span>${data.location.localtime}</span>
          </div>

          <div id="temp-container">
            <div class="temp">${data.current.temp_c}°</div>
            <div class="temp-unit">C</div>
          </div>

          <div class="description">${data.current.condition.text}</div>
        </div>

        <div id="weather-icon-container">
          <img class="weather-icon" src="${data.current.condition.icon}" alt="Weather Icon">
          <div id="feels-like">Feels like ${data.current.feelslike_c}°C</div>
        </div>
      </div>

      <div class="weather-details">
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-temperature-high"></i></div>
          <h4>Feels Like</h4>
          <p>${data.current.feelslike_c}°C</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-tint"></i></div>
          <h4>Humidity</h4>
          <p>${data.current.humidity}%</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-wind"></i></div>
          <h4>Wind Speed</h4>
          <p>${data.current.wind_kph} km/h</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-tachometer-alt"></i></div>
          <h4>Pressure</h4>
          <p>${data.current.pressure_mb} hPa</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-eye"></i></div>
          <h4>Visibility</h4>
          <p>${data.current.vis_km} km</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-cloud"></i></div>
          <h4>Cloudiness</h4>
          <p>${data.current.cloud}%</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-sun"></i></div>
          <h4>Sunrise</h4>
          <p>${data.forecast.forecastday[0].astro.sunrise}</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-moon"></i></div>
          <h4>Sunset</h4>
          <p>${data.forecast.forecastday[0].astro.sunset}</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-sun"></i></div>
          <h4>UV Index</h4>
          <p>${data.current.uv}</p>
        </div>
        <div class="detail">
          <div class="detail-icon"><i class="fas fa-dewpoint"></i></div>
          <h4>Dew Point</h4>
          <p>${data.current.dewpoint_c}°C</p>
        </div>
      </div>

      <div class="app-footer">
        <p>Weather data updated ${diffMins} minutes ago • Last updated: ${data.current.last_updated}</p>
      </div>
      `;
    })
    .catch((err) => {
      weatherContainer.innerHTML =
        '<p class="error-msg">There was an error loading the weather data</p>';

      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    });
});
