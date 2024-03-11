const 
container = document.querySelector('.container'),
search = document.querySelector('.search-box button'),
weatherBox = document.querySelector('.weather-box'),
weatherDetails = document.querySelector('.weather-details'),
error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const APIKey = '1f55115a51a0b3a28dc17cb0fea877ee';
    const location = document.querySelector('.search-box input').value;

    if(location === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIKey}`)
        .then(response => {
            //if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(json => {
            console.log(json);
            if(json.cod === '404') {
                container.style.height = '550px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fade-in');
                return;
            }
            
            error404.style.display = 'none';
            error404.classList.remove('fade-in');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch(json.weather[0].main) {
                case 'Clear':
                    image.src = 'res/clear.png';
                    break;
                case 'Rain':
                    image.src = 'res/rain.png';
                    break;
                case 'Snow':
                    image.src = 'res/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'res/clouds.png';
                    break;
                case 'Haze':
                    image.src = 'res/haze.png';
                    break;
                default:
                    image.src = '';
                    break;
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${json.wind.speed}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fade-in');
            weatherDetails.classList.add('fade-in');
            container.style.height = '600px';

        });
});