/************************************************
**************** INITIAL PAGE *******************
************************************************/

function showLogin() {
    document.getElementById('initial-screen').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('password-input').querySelector('input').focus();
}


/************************************************
**************** LOGIN PASSWORD *****************
************************************************/

function moveToNextInput(currentInput) {
    var nextInput = currentInput.nextElementSibling;

    if (nextInput && currentInput.value !== '') {
        nextInput.focus();
    }
}

function moveToPreviousInput(currentInput) {
    var previousInput = currentInput.previousElementSibling;

    if (previousInput && currentInput.value === '') {
        previousInput.focus();
    }
}

function displayErrorMessage() {
    var passwordInput = document.getElementById('password-input');
    var errorMessageContainer = document.getElementById('error-message');
    errorMessageContainer.textContent = 'Senha incorreta';

    passwordInput.classList.add('error');

    var passwordInputs = document.querySelectorAll('#password-input input');
    passwordInputs.forEach(function(input) {
        input.value = '';
    });

    document.getElementById('password-input').querySelector('input').focus();
}

function clearErrorMessage() {
    var passwordInput = document.getElementById('password-input');
    
    var errorMessageContainer = document.getElementById('error-message');
    errorMessageContainer.textContent = '';
    
    passwordInput.classList.remove('error');
}

function showAppContainer() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'block';
}

function checkLogin() {
    var passwordInputs = document.querySelectorAll('#password-input input');
    var password = Array.from(passwordInputs).map(input => input.value).join('');

    if (password === '1234') {
        showAppContainer();
        return false; 
    } else {
        displayErrorMessage();
        return false;
    }
}

document.getElementById('password-input').addEventListener('keydown', function(event) {
    var currentInput = event.target;

    if (event.key === 'Backspace') {
        moveToPreviousInput(currentInput);
        clearErrorMessage();
    }
});


/************************************************
**************** LOGOUT BUTTON ******************
************************************************/

function logout() {
    var appContainer = document.getElementById('app-container');
    var loginContainer = document.getElementById('login-container');

    appContainer.style.opacity = 0;
    loginContainer.style.opacity = 0;

    setTimeout(function () {
        appContainer.style.display = 'none';
        loginContainer.style.display = 'none';
        var passwordInputs = document.querySelectorAll('#password-input input');
        passwordInputs.forEach(function(input) {
            input.value = '';
        });

        document.getElementById('initial-screen').style.display = 'flex';

        setTimeout(function () {
            appContainer.style.opacity = 1;
            loginContainer.style.opacity = 1;
        }, 0);
    }, 500); 
}

/************************************************
**************** OPEN WEATHER  ******************
*** identifica a cidade atual e o clima atual ***
************************************************/

document.addEventListener('DOMContentLoaded', async function () {
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
    const currentDayElement = document.getElementById('current-day');
    const currentDateElement = document.getElementById('current-date');
    const currentCityElement = document.getElementById('current-city');
    const currentWeatherElement = document.getElementById('current-weather');
    const weatherInfoContainer = document.getElementById('weather-info-container');
    const infoContainer = document.getElementById('infoContainer');


    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        const weatherData = await fetchData(weatherApiUrl);
        const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        const forecastData = await fetchData(forecastApiUrl);
        displayWeatherInfo(weatherData, forecastData.list);
    } catch (error) {
        console.error('Erro ao obter dados do clima:', error);
    }


    function getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }


    function fetchData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => {
                console.error('Erro ao obter dados:', error);
                throw error;
            });
    }

    function displayWeatherInfo(weatherData, forecastList) {
        const temperatureCelsius = Math.floor(weatherData.main.temp - 273.15);
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        document.getElementById('weather-icon').style.backgroundImage = `url(${iconUrl})`;


        weatherInfoContainer.innerHTML = `
        ${displayForecast(forecastList)}
        `;

        const currentDayIndex = new Date().getDay();
        currentDayElement.textContent = `${getDayOfWeek(currentDayIndex)},  ${getCurrentDate()}`;
        currentCityElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
        currentWeatherElement.textContent = `${temperatureCelsius}°C`;

    }

    function displayForecast(forecastList) {
        let forecastHtml = '<div class="carousel-wrap"><br>';
        const uniqueDates = new Set();


        forecastList.forEach((data) => {
            const date = new Date(data.dt * 1000);
            const dateString = date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
            const temperatureMax = Math.ceil(data.main.temp_max - 273.15);
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;


            if (!uniqueDates.has(dateString)) {
                forecastHtml += `
                    <div class="weatherInf">
                        <div class="item">
                            <div class="temperature-container">
                                ${temperatureMax}°C
                            </div>
                            <div class="icon-container">
                                <img src="${iconUrl}" alt="Weather Icon">
                            </div>
                            <strong>${dateString}:</strong>
                        </div>
                    </div>
                `;
                uniqueDates.add(dateString);
            }
        });

        forecastHtml += '</div>';
        return forecastHtml;
    }

    function getDayOfWeek(dayIndex) {
        const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        return daysOfWeek[dayIndex];
    }

    function getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        document.getElementById('clock').textContent = currentTime;
    }

    setInterval(updateClock, 1000);
    updateClock();

    function updateClockLogin() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        document.getElementById('clockLogin').textContent = currentTime;
    }

    
    setInterval(updateClockLogin, 1000);
    updateClockLogin();

    /************************************************
    ********************** SCROLL  ******************
    ************************************************/

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);

            const targetElement = document.getElementById(targetId);

            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});


/************************************************
**************** FILMS SECTION  *****************
************************************************/

const list = document.querySelector('.movie-list');
let isDown = false;
let StartX, scrollLeft;

list.addEventListener('mousedown', (e) => {
    isDown = true;
    StartX = e.pageX - list.offsetLeft;
    scrollLeft = list.scrollLeft;
});
list.addEventListener('mouseleave', () => {
    isDown = false;
});
list.addEventListener('mouseup', () => {
    isDown = false;
});
list.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - list.offsetLeft;
    const walk = x - StartX;
    list.scrollLeft = scrollLeft - walk;
});
