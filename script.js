document.getElementById('search').addEventListener('click', () => getWeather(document.getElementById('city').value));
document.getElementById('geolocation').addEventListener('click', getWeatherByGeolocation);

const apiKey = '8f381da88b7180ba9de71ea83abc7a49';

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            showError(data.message);
            return;
        }

        updateWeatherUI(data);
    } catch (error) {
        showError('Failed to fetch weather data.');
        console.error('Error fetching weather data:', error);
    }
}

async function getWeatherByGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async position => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.cod !== 200) {
                    showError(data.message);
                    return;
                }

                updateWeatherUI(data);
            } catch (error) {
                showError('Failed to fetch weather data.');
                console.error('Error fetching weather data:', error);
            }
        },
        () => showError('Unable to retrieve your location.')
    );
}

function updateWeatherUI(data) {
    document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind').textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
    
    document.getElementById('weather').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
}

function showError(message) {
    document.getElementById('error').textContent = message;
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('weather').classList.add('hidden');
}
