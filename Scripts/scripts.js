let url_pt1 = "https://api.openweathermap.org/data/2.5/forecast?q=";
let city = "Roanoke";
let apikey = "&appid=a91a48b0aad8f376c03c5f0b1b9fb6f5";
let units = "&units=imperial";
let degSymbol = `&deg;F`;

let temp = document.getElementById("temp");
let temp_min = document.getElementById("temp_min");
let temp_max = document.getElementById("temp_max");
let speed = document.getElementById("speed");
let deg = document.getElementById("deg");
// let climate = document.getElementById("climate");
let feels_like = document.getElementById("feels_like");
let place = document.getElementById("place");
let favBtn = document.getElementById("favBtn");
let delBtn = document.getElementById("delBtn");
let inject = document.getElementById("inject");
let inject2 = document.getElementById("inject2");
let search = document.getElementById("search");
let btn = document.getElementById("btn");

let favArr = [];
let weatherArr = [];
// let searchedCity = "";

let favData = JSON.parse(localStorage.getItem("favWeather"));
// console.log(favData);
if(favData && favData != null) {
  favArr = favData;
  for (let i = 0; i < favData.length; i++) {
    if (i === 0) {
      fetchForecast(favData[i].url);
      // let colDiv = document.createElement("div");
      // colDiv.classList = "col";
      // colDiv.setAttribute = "id"

      let liTag = document.createElement("li");
      liTag.innerText = favData[i].name;
      liTag.addEventListener("click", (e) => {
        fetchForecast(`${url_pt1}${favData[i].name}${apikey}${units}`)
          .then(response => response.json())
          .then(data => {
              getForecast(data);
        })
      });

      // colDiv.appendChild(liTag);
      inject2.appendChild(liTag);
      inject2.style.maxHeight = '130px';
      inject2.style.overflowY = 'auto';
      inject2.style.listStyle = 'none'; // Remove the list style
      inject2.style.scrollbarColor = "#63C1F6 #93D8FF";
      
    } else {
      // let colDiv = document.createElement("div");
      // colDiv.classList = "col";

      let liTag = document.createElement("li");
      liTag.innerText = favData[i].name;
      liTag.addEventListener("click", (e) => {
        fetchForecast(`${url_pt1}${favData[i].name}${apikey}${units}`)
          .then(response => response.json())
          .then(data => {
              getForecast(data);
        })
      });

      // colDiv.appendChild(liTag);
      inject2.appendChild(liTag);
      inject2.style.maxHeight = '130px';
      inject2.style.overflowY = 'auto';
      inject2.style.listStyle = 'none';
      inject2.style.scrollbarColor = "#63C1F6 #93D8FF";
    }
  }
}

btn.addEventListener("click", () => {
  fetchForecast(`${url_pt1}${search.value}${apikey}${units}`);
});

search.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    fetchForecast(`${url_pt1}${search.value}${apikey}${units}`);
  }
});

favBtn.addEventListener("click", (e) => {
  let obj = {
    name: weatherArr[weatherArr.length - 1].city.name,
    // weatherData: weatherArr[weatherArr.length - 1]
    // url: `${url_pt1}${searchedCity}${apikey}${units}`,
  };
  addFavoriteCity(obj);
  favArr.push(obj);
  // let colDiv = document.createElement("div");
  // colDiv.classList = "col";
  // let liTag = document.createElement("p");
  // liTag.innerText = place.innerText;
  // liTag.addEventListener("click", (e) => {
  //   fetchForecast(obj.url);
  // });

  // colDiv.appendChild(liTag);
  // inject2.appendChild(colDiv);

  localStorage.setItem("favWeather", JSON.stringify(favArr));
});

delBtn.addEventListener("click", (e) => {
  let currentCity = place.innerText;
  let currentFav = inject2.getElementsByTagName('li');

  for(let i = 0; i < currentFav.length; i++){
    if(currentFav[i].innerText === currentCity){
      inject2.removeChild(currentFav[i]);
      favArr.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("favWeather", JSON.stringify(favArr));
});


function fetchForecast(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      getForecast(data);
    })
    .catch((error) => {
      console.log("Error fetching forecast:", error);
    });
}

function getForecast(forecastData) {
    weatherArr = [];
    weatherArr.push(forecastData);

    console.log(forecastData);
    place.innerText = forecastData.city.name; // changes the place id to the city name
    temp.innerText = parseInt(forecastData.list[0].main.temp);
    // `${parseInt(forecast.main.temp)}${degSymbol}`
    temp_min.innerText = parseInt(forecastData.list[0].main.temp_min); // grabs the min temp and displays it
    temp_max.innerText = parseInt(forecastData.list[0].main.temp_max); // grabs the max temp and displays it
    speed.innerText = parseInt(forecastData.list[0].wind.speed);
    deg.innerText = parseInt(forecastData.list[0].wind.deg);

    // climate.innerText = forecastData.list[0].weather[0].description;
  
    inject.innerHTML = ""; // Makes it so whenever you search for a different city it'll wipe the old search and shows the new one
  
    let dailyForecasts = {}; // empty object to store the objects with the different days in it. 
    console.log(dailyForecasts);
    for (let i = 0; i < forecastData.list.length; i++) {
      let forecast = forecastData.list[i];
      let forecastDate = new Date(forecast.dt * 1000); // instead of every milisecond it'll be every second
      forecastDate.setDate(forecastDate.getDate() + 1); // shift the date by one day
      let forecastDay = forecastDate.toLocaleDateString("en-US", { day: "numeric" }); // shows the day only. example: May 15th 2023 = 15
    //   console.log(forecastDay);
  
      if (!dailyForecasts[forecastDay]) { // checks if there is no forecast stored for the current day 
        dailyForecasts[forecastDay] = forecast; // assigns the current forecast to the dailyForecasts object using the day as the key
      }
    }
  
    // Display one forecast per day
    let count = 0;
    for (let forecastDay in dailyForecasts) { // using a for in loop to iterate through the dailyForecasts object that stores the 5 days and injecting them
      if (count >= 5) break; // thank you zac for constantly using breaks in katas so I understand what's going on with them
      let forecast = dailyForecasts[forecastDay];
  
      let forecastItem = document.createElement("div");
      forecastItem.classList.add("col");
      forecastItem.classList.add("forecastItem");
      forecastItem.classList.add("text-center");
      forecastItem.classList.add("backgroundWhite");
      forecastItem.classList.add("pixelFont");
  
      let date = document.createElement("p");
      date.classList.add("date");
  
      let forecastDate = new Date(forecast.dt * 1000);
      let dateOptions = { weekday: "short", month: "short", day: "numeric" };
      date.innerText = forecastDate.toLocaleDateString("en-US", dateOptions);
      forecastItem.appendChild(date);
  
      let temperature = document.createElement("p");
      temperature.classList.add("temperature");
  
      temperature.innerHTML = `${parseInt(forecast.main.temp)}${degSymbol}`;
      forecastItem.appendChild(temperature);

      let minTemp = document.createElement("p");
      minTemp.classList.add("minTemp");

      minTemp.innerText = `Min: ${parseInt(forecast.main.temp_min)}`;
      forecastItem.appendChild(minTemp);

      let maxTemp = document.createElement("p");
      maxTemp.classList.add("maxTemp");

      maxTemp.innerText = `Max: ${parseInt(forecast.main.temp_max)}`;
      forecastItem.appendChild(maxTemp);
  
      // let description = document.createElement("p");
      // description.classList.add("description");
      // description.innerText = forecast.weather[0].description;
      // forecastItem.appendChild(description);

      let weatherIcon = document.createElement('img');
      weatherIcon.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
      weatherIcon.alt = forecast.weather[0].description;
      weatherIcon.classList.add('weatherIcon');
      forecastItem.appendChild(weatherIcon);


      forecastItem.style.marginLeft = "15px";
      forecastItem.style.marginRight = "15px";
      forecastItem.style.paddingTop = "15px";
  
      inject.appendChild(forecastItem);

      count++; // adds to the count so it'll stop at the if statement above
    }
  }
  
function addFavoriteCity(city){ // brought to you by zac. Thank you zac!
  let newFav = document.createElement('li');
  newFav.className = 'list-group-item';
  newFav.innerText = city.name;
  // newFav.weatherData = city.weatherData;

  inject2.appendChild(newFav);

  
  inject2.style.maxHeight = '130px';
  inject2.style.overflowY = 'auto';
  inject2.style.scrollbarColor = "#63C1F6 #93D8FF";

  newFav.addEventListener('click', e => {
    fetchForecast(`${url_pt1}${newFav.innerText}${apikey}${units}`)
    .then(response => response.json())
      .then(data => getForecast(data));
    // getForecast(newFav.weatherData);
  })
}


fetchForecast(`${url_pt1}${city}${apikey}${units}`);