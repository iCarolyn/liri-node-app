require("dotenv").config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('spotify');
var fs = require('fs');

//argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("The Sign");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var client = new Twitter(keys.twitter);
  var params = {screen_name: 'ux_carolyn'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@ux_carolyn: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
      }
    }else{
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
    var spotify = new Spotify(keys.spotify);
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){

      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function omdbData(movieTitle){
  var omdbURL = 'http://www.omdbapi.com/?apikey=trilogy' + movieTitle + '&y=&plot=short&tomatoes=true&r=json';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

    } else{
      console.log('Error occurred.')
    }
    if(movieTitle === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

    }
  });

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}