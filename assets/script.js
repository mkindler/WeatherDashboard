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
          
          
          