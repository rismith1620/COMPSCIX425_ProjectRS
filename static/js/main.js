
async function loadBuoyData44025() {
  const url = "https://corsproxy.io/?https://www.ndbc.noaa.gov/data/realtime2/44025.txt";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const text = await response.text();
    const lines = text.trim().split("\n");

    const dataLine = lines.find(line => !line.startsWith("#"));
    if (!dataLine) throw new Error("No data found");

    const parts = dataLine.trim().split(/\s+/);

    

    const data = {
        year: parts[0],
        month: parts[1],
        day: parts[2],
        hour: parts[3],
        minute: parts[4],
        wavePeriod: parts[10],
        waveHeight: (parts[8]* 3.28084),
        temp: ((9/5) *(parts[14]) + 32),
        swellDir: parts[11],
    };

    console.log(data);    
    document.getElementById("statusA").innerText = "Live buoy data:";
    document.getElementById("waveA").innerText = `Wave Height: ${data.waveHeight.toFixed(2)} ft`;
    document.getElementById("periodA").innerText = `Period: ${data.wavePeriod} s`;
    document.getElementById("tempA").innerText = `Water Temp: ${data.temp.toFixed(1) ?? "N/A"} °F`;
    document.getElementById("swellDirA").innerText = `Swell Direction: ${degToCompass(data.swellDir)}`;
    

  } catch (err) {
    console.error(err);
    document.getElementById("statusA").innerText = "Failed to load buoy data";
  }
}


async function loadBuoyData44097() {
  const url = "https://corsproxy.io/?https://www.ndbc.noaa.gov/data/realtime2/44097.txt";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    const text = await response.text();
    const lines = text.trim().split("\n");

    const dataLine = lines.find(line => !line.startsWith("#"));
    if (!dataLine) throw new Error("No data found");

    const parts = dataLine.trim().split(/\s+/);

    const data = {
        year: parts[0],
        month: parts[1],
        day: parts[2],
        hour: parts[3],
        minute: parts[4],
        wavePeriod: parts[10],
        waveHeight: (parts[8]* 3.28084),
        temp: ((9/5) *(parts[14]) + 32),
        swellDir: parts[11],
    };

    console.log(data);

    document.getElementById("statusB").innerText = "Live buoy data:";
    document.getElementById("waveB").innerText = `Wave Height: ${data.waveHeight.toFixed(2)} ft`;
    document.getElementById("periodB").innerText = `Period: ${data.wavePeriod} s`;
    document.getElementById("tempB").innerText = `Water Temp: ${data.temp.toFixed(1) ?? "N/A"} °F`;
    document.getElementById("swellDirB").innerText = `Swell Direction: ${degToCompass(data.swellDir)}`;
    

  } catch (err) {
    console.error(err);
    document.getElementById("statusB").innerText = "Failed to load buoy data";
  }
}


function degToCompass(deg) {
  const directions = [
    "N","NNE","NE","ENE",
    "E","ESE","SE","SSE",
    "S","SSW","SW","WSW",
    "W","WNW","NW","NNW"
  ];

  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}


async function loadWeather(){
  try {

    const pointRes = await fetch(
      "https://api.weather.gov/points/41.0359,-71.9545"
    );
    const pointData = await pointRes.json();

  
    const forecastUrl = pointData.properties.forecast;

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const current = forecastData.properties.periods[0];

    document.getElementById("weatherText").innerText =
      `${current.name}: ${current.temperature}°F — ${current.shortForecast}`;

    document.getElementById("wind").innerText =
      `Wind: ${current.windSpeed} ${current.windDirection}`;

  } catch (err) {
    console.error(err);
    document.getElementById("weatherText").innerText =
      "Failed to load weather";
  }
}

async function loadTideChart() {

    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const dateStr = `${yyyy}${mm}${dd}`;

    const url =
        `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
        `?product=predictions` +
        `&application=surfapp` +
        `&begin_date=${dateStr}` +
        `&end_date=${dateStr}` +
        `&datum=MLLW` +
        `&station=8510560` +
        `&time_zone=lst_ldt` +
        `&units=english` +
        `&interval=30` +
        `&format=json`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        const predictions = data.predictions;

        const labels = predictions.map(p => {

            const date = new Date(p.t);

            return date.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit'
            });
        });

        const tideValues = predictions.map(p => parseFloat(p.v));

        const ctx = document
            .querySelector('#tideChart')
            .getContext('2d');

        new Chart(ctx, {

            type: 'line',

            data: {
                labels: labels,
                datasets: [{
                    label: 'Tide Height (ft)',
                    data: tideValues,
                    tension: 0.4,
                    fill: true
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                },

                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
}
                    }
                }
            }
        });

    } catch (err) {

        console.error(err);
    }
}