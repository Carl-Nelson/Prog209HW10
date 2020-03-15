
var express = require('express');
var router = express.Router();

let serverGameArray = []; // our "permanent storage" on the web server
let serverReviewArray = [];
let serverGameLibrary = [];

// define a constructor to create movie objects
var GameObject = function(name, year, genre) {
  this.name = name;
  this.year = year;
  this.genre = genre;
}

var ReviewObject = function(gameName, review, rating, user) {
  this.gameName = gameName; //gonna associate games n' reviews via the name
  this.review = review;
  this.rating = rating;
  this.user = user;
}

// for testing purposes, its nice to preload some data
serverGameArray.push(new GameObject("game1", 2000, "Real Time Strategy"));
serverGameArray.push(new GameObject("game2", 2001, "First Person Shooter"));
serverGameArray.push(new GameObject("game3", 2002, "Turn Based Strategy"));
serverGameArray.push(new GameObject("game4", 2000, "Action Adventure"));
serverGameArray.push(new GameObject("game5", 2001, "Real Time Strategy"));
serverGameArray.push(new GameObject("game6", 2002, "First Person Shooter"));

serverReviewArray.push(new ReviewObject("game1","This game sucks.", 2, "firstPerson"));
serverReviewArray.push(new ReviewObject("game1","Worst game ever.", 1, "SomeGuy"));
serverReviewArray.push(new ReviewObject("game2","Game of the year, every year.", 5, "secondPerson"));

/* POST to addMovie */
router.post('/addGame', function(req, res) {
  console.log(req.body);
  serverGameLibrary.push(req.body);
  console.log(serverGameLibrary);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});

router.post('/addReview', function(req, res) {
  console.log(req.body);
  serverReviewArray.push(req.body);
  console.log(serverReviewArray);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});


/* GET game list. */
router.get('/gameList', function(req, res) {
  res.json(serverGameArray);
 });

 router.get('/gameLibrary', function(req,res) {
   res.json(serverGameLibrary);
 })

 router.get('/reviewList', function(req,res) {
  res.json(serverReviewArray);
})

 /* DELETE game from library. */
 router.delete('/deleteGame/:ID', function(req, res) {
  let id = req.params.ID;
  console.log('deleting ID: ' + id);
   for(let i=0; i < serverGameLibrary.length; i++) {
     if(id === (serverGameLibrary[i].name)) {
     serverGameLibrary.splice(i,1);
     }
   }
   res.status(200).send(JSON.stringify('success'));
});


//  router.???('/userlist', function(req, res) {
//  users.update({name: 'foo'}, {name: 'bar'})



module.exports = router;

