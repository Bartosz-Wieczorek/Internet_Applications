const API_KEY = 'ddcd55ad7e800bf28b4985ba980a99c9';
const BASE = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const output = document.getElementById('output');

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        showMessage('Wpisz nazwę miasta.');
        return;
    }

    output.innerHTML = '<p class="muted">Ładowanie danych...</p>';

    fetchCurrentWeather(city);
    fetchForecast(city);
});

function showMessage(msg, isError = false) {
    output.innerHTML = `<div class="card"><p style="color:${isError ? 'crimson' : 'inherit'}">${escapeHtml(msg)}</p></div>`;
}

function fetchCurrentWeather(city) {
    const xhr = new XMLHttpRequest();
    const url = `${BASE}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                console.log('XMLHttpRequest:', data);
                renderCurrentWeather(data);
            } catch (e) {
                showMessage('Blad', true);
            }
        } else if (xhr.status === 404) {
            showMessage('Nie znaleziono miasta', true);
        }
    };

    xhr.onerror = function () {
        showMessage('Blad polaczenia', true);
    };

    xhr.send();
}

function renderCurrentWeather(data) {
    const html = `
    <div class="card">
      <h2>Pogoda dla ${escapeHtml(data.name || '—')}</h2>
      <p><strong>${escapeHtml((data.weather?.[0]?.description) || '—')}</strong></p>
      <p>Temperatura: <strong>${formatNumber(data.main?.temp)}°C</strong></p>
      <p class="muted">Wilgotność: ${formatNumber(data.main?.humidity)}% · Wiatr: ${formatNumber(data.wind?.speed)} m/s</p>
    </div>
  `;

    const existingForecast = document.getElementById('forecastContainer');
    if (existingForecast) {
        output.innerHTML = html + existingForecast.outerHTML;
    } else {
        output.innerHTML = html;
    }
}

async function fetchForecast(city) {
    const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            if (res.status === 404) {
                showMessage('Nie znaleziono miasta', true);
            } else {
                showMessage(`Blad: ${res.status}`, true);
            }
            return;
        }

        const data = await res.json();
        console.log('Odpowiedź forecast (Fetch):', data);
        renderForecast(data);
    } catch (e) {
        showMessage('Blad polaczenia', true);
    }
}

function renderForecast(data) {
    if (!data || !Array.isArray(data.list)) {
        showMessage('Nieprawidłowa odpowiedź z forecast API.', true);
        return;
    }

    const groups = {};
    data.list.forEach(item => {
        const day = item.dt_txt.slice(0, 10);
        if (!groups[day]) groups[day] = [];
        groups[day].push(item);
    });

    let html = `<div id="forecastContainer" class="card"><h3>Prognoza 5-dniowa (co 3h)</h3>`;
    html += '<div class="forecast-grid">';

    Object.keys(groups).slice(0, 5).forEach(day => {
        let block = `<div><strong>${escapeHtml(day)}</strong><ul style="padding-left:16px; margin:6px 0; list-style:disc">`;

        groups[day].forEach(it => {
            const time = it.dt_txt.slice(11, 16);
            const desc = it.weather?.[0]?.description || '-';
            block += `<li>${escapeHtml(time)} — ${escapeHtml(desc)}, ${formatNumber(it.main?.temp)}°C</li>`;
        });

        block += '</ul></div>';
        html += block;
    });

    html += '</div></div>';

    const existingCurrent = output.querySelector('.card');
    if (existingCurrent) {
        const currentHtml = existingCurrent.outerHTML;
        output.innerHTML = currentHtml + html;
    } else {
        output.innerHTML = html;
    }
}

function formatNumber(v) {
    if (v === undefined || v === null) return '—';
    return Math.round(v * 10) / 10;
}

function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') getWeatherBtn.click();
});
