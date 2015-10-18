var weatherObject ;
var position=0;

(function(){
    getWeatherData("//api.openweathermap.org/data/2.5/forecast/daily?id=702550&APPID=cbb88e2e05e3fbd2117efcb076e1b3a4&units=metric&cnt=15");
})();


function getWeatherData(url){
    function resultFunction(data){
        weatherObject = data;
        populateData(data,position);
    }

    $.ajax({
        url:url
    }).done(resultFunction)
}

function populateData(weatherData,fromElemt){
    $("#city_name").text(weatherData.city.name);
    //populating temperature data for each day
    for (var i = 1; i <= 15; i++) {
        $("#day_"+i+"_temp").text(Math.round(weatherData.list[fromElemt+i-1].temp.day )+ '\xB0');

        //populating data
        $("#day_"+i+"_data").text(moment.unix(weatherData.list[fromElemt+i-1].dt).format("DD.MM"));
        $("#day_"+i).text(moment.unix(weatherData.list[fromElemt+i-1].dt).format("dddd"));

        //description
        $("#day_"+i+"_descr").text(weatherData.list[fromElemt+i-1].weather[0].main);

        //degree in the morning
        $("#day_"+i+"_morning").text(Math.round(weatherData.list[fromElemt+i-1].temp.morn) + '\xB0' + 'in the morning');

        //degree at night
        $("#day_"+i+"_night").text(Math.round(weatherData.list[fromElemt+i-1].temp.night) + '\xB0' + 'at night');

        //humidity
        $("#day_"+i+"_humidity").text(weatherData.list[fromElemt+i-1].humidity + '% (humidity)');

        //image
        $("#day_"+i+"_img").attr("src","../img/" + weatherData.list[fromElemt+i-1].weather[0].icon + ".png");
    }

}

function nextThreeDays(){
    if(position <7){
        populateData(weatherObject,position +=3);
    }

}

function previousThreeDays(){
    if(position > 0){
        populateData(weatherObject,position -=3);
    }
}

$(document).ready(function(){
    $('.ps_next').click(nextThreeDays);

    $('.ps_prev').click(previousThreeDays);

    $('#city_list').change(function(){
        getWeatherData("//api.openweathermap.org/data/2.5/forecast/daily?id=" + this.value + "&APPID=cbb88e2e05e3fbd2117efcb076e1b3a4&units=metric&cnt=15");
        position = 0;
    });
});