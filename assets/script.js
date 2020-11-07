// Initialize script file
$(document).ready(function() {

    // Set up functionality of search button
    $("#search-button").on("click", function() {
      let searchValue = $("#search-value").val();
  
      // Clear the input box of any values
      $("#search-value").val("");
  
      findWeather(searchValue);
    });
  
    $(".history").on("click", "li", function() {
      findWeather($(this).text());
    });
  
    function createRow(text) {
      let li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
      $(".history").append(li);
    }
  
    // Find the weather for the current day
    function findWeather(searchValue) {
      $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=5506a1bcca69c738f6e173b011143fee&units=imperial",
        dataType: "json",
        success: function(data) {

            // Create a link of previous searches
            if (history.indexOf(searchValue) === -1) {
                history.push(searchValue);
                window.localStorage.setItem("history", JSON.stringify(history));
        
                createRow(searchValue);
            }

            // Use this to clear any old content
            $("#current").empty();

            // Set up the contents that will be added to the HTML for the current weather
            let title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            let card = $("<div>").addClass("card");
            let cardBody = $("<div>").addClass("card-body");
            let temperature = $("<p>").addClass("card-text").text("Temperature: " + Math.floor(data.main.temp) + " °F");
            let humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            let wind = $("<p>").addClass("card-text").text("Wind Speed: " + Math.floor(data.wind.speed) + " MPH");
            let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

            // Append the content to the page
            title.append(img);
            cardBody.append(title, temperature, humid, wind);
            card.append(cardBody);
            $("#current").append(card);
    
            // Call the API endpoints
            getForecast(searchValue);
            getUVIndex(data.coord.lat, data.coord.lon);
        }
      });
    }

    // Find the extended forecast
    function getForecast(searchValue) {
        $.ajax({
          type: "GET",
          url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=5506a1bcca69c738f6e173b011143fee&units=imperial",
          dataType: "json",
          success: function(data) {
            
            // Use this to overwrite any content that is already present and add a title and empty row
            $("#extendedForecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
    
            // This loop is needed to go over all forecasts in 3-hour increments
            for (let i = 0; i < data.list.length; i++) {
              
                // Only looking at the forecasts around 15:00
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    
                    // Set up the contents that will be added to the HTML for the extended forecast
                    let col = $("<div>").addClass("col-md-2");
                    let card = $("<div>").addClass("card bg-success text-white");
                    let body = $("<div>").addClass("card-body p-2");
        
                    let title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
        
                    let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
        
                    let p1 = $("<p>").addClass("card-text").text("Temp: " + Math.floor(data.list[i].main.temp_max) + " °F");
                    let p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
        
                    // Append the content to the page
                    col.append(card.append(body.append(title, img, p1, p2)));
                    $("#extendedForecast .row").append(col);
                }
            }
          }
        });
    }
          
          
          