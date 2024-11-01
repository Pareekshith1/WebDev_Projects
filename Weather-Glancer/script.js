// Setting up the API keys and URLs
const apiKey = '1ac4db679fdd7a9aa47b9e155995af38';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const timeApiUrl = 'https://worldtimeapi.org/api/timezone';

// Getting HTML elements
const title = document.getElementById('right-head');
const inputField = document.getElementById('input');
const inputPlace = document.getElementById('place');
const temperatureElement = document.getElementById('temperature');
const description = document.getElementById('weather');
const dateElement = document.getElementById('date'); // Element for date
const dayElement = document.getElementById('day');   // Element for day
const iconContainer = document.getElementById('icon-container'); // Container for the icon

// Function to move title
function titleMover() {
    title.style.top = "0px";
    title.style.fontSize = "30px";

    setTimeout(() => {
        // Add the active class to inner details for fade-in
        const innerDetails = document.getElementById('inner-details'); // Change this to your actual inner details element ID
        innerDetails.classList.add('active'); // Add the active class for fade-in
    }, 500);
}

// Function to check if input is empty
function emptyInput() {
    if (inputField.value.trim() === "") {
        alert("The field cannot be left empty");
        return false;
    } else {
        console.log(inputField.value);
        return true;
    }
}

// Function to display the place
function displayPlace() {
    inputPlace.innerHTML = inputField.value.trim();
}

// Function to add location and fetch weather data
function locationAdder() {
    const location = inputField.value;
    if (location) {
        fetchWeather(location);
    }
}

// Function to fetch weather data
function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) { // Check for successful response
                // Display location, temperature, and description
                inputPlace.textContent = data.name;
                temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
                description.textContent = data.weather[0].description;

                // Extract the icon code and construct the icon URL
                const weatherIconCode = data.weather[0].icon; // e.g., '01d'
                const iconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}.png`;

                // Log the icon URL for debugging
                console.log("Weather icon URL:", iconUrl);

                // Display the weather icon
                iconContainer.innerHTML = ''; // Clear previous icon
                const weatherIcon = document.createElement('img');
                weatherIcon.src = iconUrl;
                weatherIcon.alt = data.weather[0].description; // e.g., 'clear sky'
                weatherIcon.id = 'weather-icon'; // Optional: Add an ID for styling

                iconContainer.appendChild(weatherIcon); // Add to the container

                // Calculate timezone offset in hours and round to the nearest whole number
                const timezoneOffsetHours = Math.round(data.timezone / 3600);
                
                // Create the timezone string
                const timezoneString = `Etc/GMT${timezoneOffsetHours >= 0 ? '-' : '+'}${Math.abs(timezoneOffsetHours)}`;
                
                // Fetch date and day based on the adjusted timezone
                fetchDateAndDay(timezoneString);
            } else {
                console.error('Location not found:', data.message);
                alert('Location not found. Please try again.'); // Alert the user
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please check your connection or the entered location.'); // User-friendly message
        });
}

// Function to fetch date and day based on timezone string
function fetchDateAndDay(timezone) {
    console.log(`Fetching date and day from URL: ${timeApiUrl}/${timezone}`);
    
    fetch(`${timeApiUrl}/${timezone}`)
        .then(response => {
            // Check if the response is OK (status code 200)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the entire response to check its structure
            if (data.datetime) {
                // Extract date and day from the datetime string
                const date = new Date(data.datetime);
                
                // Formatting options
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                const day = date.toLocaleDateString('en-US', { weekday: 'long' });

                // Display date and day
                dateElement.textContent = `${formattedDate}`;
                dayElement.textContent = `${day}`;
            } else {
                console.error('Datetime not found in response:', data);
                dateElement.textContent = "Date: Unable to retrieve date";
                dayElement.textContent = "Day: Unable to retrieve day";
            }
        })
        .catch(error => {
            console.error('Error fetching date and day:', error);
            dateElement.textContent = "Date: Error";
            dayElement.textContent = "Day: Error";
        });
}

// Main function to manage actions
function function_manager() {
    if (emptyInput()) {
        titleMover();
        displayPlace();
        locationAdder();
        console.log("No errors");
    } else {
        console.log("Error");
    }
}
