const express = require("express");
const app = express();
const port = 3000;
const https = require("https");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// on listening to the port, the webpage calls a get method on '/' and we pass it
// using app.get on path '/'. Here we're sending a index.html file as response.
app.get('/', function (req, res) { //root page will get the response from here.
  res.sendFile(__dirname + "/index.html");
});
// on submitting a button on '/', we're using below post method to post the data using https.
app.post('/', function (req, res) {
  const query = req.body.cityName;
  const appKey = "597f7049b3faf34ce37820ccee348395";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit + "&lang=en#downloadJSON=";
  //above url is from openweather site and from postman by passing parameters like q,units etc.
  https.get(url, function (httpsRes) {
    console.log(httpsRes.statusCode);
    // https statusCode can be logged here.
    httpsRes.on("data", function (data) { // this is the data that we get on https Response.
      console.log(data); //data in hex bytes format
      const weatherData = JSON.parse(data); //parsing data to js object from json format so we can access the objects like temp,pressure etc.
      console.log(weatherData); // JS object data
      // Below we used the json objects like name,icon etc to write the data on the web page.
      const temp = weatherData.main.temp;
      const place = weatherData.name;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"; // this image url present in openweathermap website.
      //below write methods are used to post data on the web page.
      res.write("<h1>The temperature in " + place + " is " + temp + " degrees Celsius</h1>");
      res.write("<h2>Current weather is " + description + "</h2>");
      res.write("<img src=" + imageURL + ">"); // we can use mutliple writes but only one send method.
      res.send(); // we need to use send() or else the page will wait for it...
    });
  });
})


app.listen(port, function (error) { //app or server listens at given port and we have to pass a get method to send something to the root web page.
  if (error) {
    console.log("Something is wrong", error);
  } else {
    console.log("Server is listening."); //if everything is good this will log on our console.
  }
});
