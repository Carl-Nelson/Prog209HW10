let userArray = [];
let gameArray = [];
let reviewArray = [];
let gameCollection = [];
let currentUser = "You are not logged in";

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

// define a constructor to create user objects
//not really being used for anything worthwhile yet
var userObject = function (Name) {
  this.name = Name;
}

function createList()
{
  var divUserlist = $("#divUserlist");
  divUserlist.html("");// remove old data, the jquery way

  gameArray.forEach(function (element) {
    
    let content = `<div data-role='collapsible' data-theme='b' data-content-theme='a' class='oneGame'><h3>${element.name}</h3>
                  <p>Year:${element.year}<br>Genre:${element.genre}<br>
                  <button data-role='button' class="addButton" gameName=${element.name}>Add to library</button>&nbsp
                  <button data-role='button' data-parm='${element.name}' class="detailButton">View Details</button></p></div>`;
                  //the button styles worked, and now they don't. Why? Who knows!
      divUserlist.append(content).collapsibleset("refresh");//add the new collapsible widget to the set, then refresh the set
    });

  //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
  var classname = document.getElementsByClassName("detailButton");
  Array.from(classname).forEach(function (element) {
    element.addEventListener('click', function(){
      var parm = this.getAttribute("data-parm");  // passing in the record.Id
      console.log(parm);
      //do something here with parameter on pickbet page
      document.getElementById("IDparmHere").innerHTML = parm;
      $.mobile.navigate("#details");
    });
  });
  var classname = document.getElementsByClassName("addButton");
  Array.from(classname).forEach(function (element) {
    element.addEventListener('click', function(){
      let gameName = this.getAttribute("gameName");
      //make sure the game isn't already in the collection
      for (let i = 0; i < gameCollection.length; i++) {
        if (gameCollection[i].name === gameName) {
          this.innerHTML = "Already in library";
          return;
        }
      }
      //find the proper game object to add to the collection
      for (let i = 0; i < gameArray.length; i++) {
        if (gameName === gameArray[i].name) {
          gameCollection.push(gameArray[i]);
          this.innerHTML = "Game added";
          addGame(gameArray[i]);
        }
      }
    });
  });
  console.log(gameArray);
}

function compareTitle(a, b) {
  // Use toUpperCase() to ignore character casing
  const gameA = a.name.toUpperCase();
  const gameB = b.name.toUpperCase();

  let comparison = 0;
  if (gameA > gameB) {
    comparison = 1;
  } else if (gameA < gameB) {
    comparison = -1;
  }
  return comparison;
}


function compareGenre(a, b) {
  // Use toUpperCase() to ignore character casing
  const gameA = a.genre.toUpperCase();
  const gameB = b.genre.toUpperCase();

  let comparison = 0;
  if (gameA > gameB) {
    comparison = 1;
  } else if (gameA < gameB) {
    comparison = -1;
  }
  return comparison;
}
//this... might be unnecessary
function compareYear(a, b) {
  const gameA = a.year;
  const gameB = b.year;

  if (gameA > gameB) {
    return 1;
  } else if (gameA < gameB) {
    return -1;
  } else {
    return 0;
  }
}

function displayCollection() {
    //oddly enough the jquery mobile collapsible set stuff below doesn't work unless I use jquery to get the div
    var collection = $("#collection");
    //and this next line doesn't work unless I use plain ole html to grab the div
    if (gameCollection.length === 0) {
      collection.html("");
      collection.append("<p>Your library is empty. Add some games!</p>");
    }
    else {
      document.getElementById("collection").innerHTML = "";// remove old data
  
      gameCollection.forEach(function (element) {
        
        let content = `<div data-role='collapsible' data-theme='b' data-content-theme='a' class='oneGame'><h3>${element.name}</h3>
                      <p>Year:${element.year}<br>Genre:${element.genre}<br>
                      <button data-role='button' class="removeButton" gameName=${element.name}>Remove from library</button>&nbsp
                      <button data-role='button' data-parm='${element.name}' class="detailButton">View Details</button></p></div>`;
                      //the button styles worked, and now they don't. Why? Who knows!
          collection.append(content).collapsibleset("refresh");//add the new collapsible widget to the set, then refresh the set
        });
    
      //set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
      var classname = document.getElementsByClassName("detailButton");
      Array.from(classname).forEach(function (element) {
        element.addEventListener('click', function(){
          var parm = this.getAttribute("data-parm");  // passing in the record.Id
          console.log(parm);
          //do something here with parameter on pickbet page
          document.getElementById("IDparmHere").innerHTML = parm;
          $.mobile.navigate("#details");
        });
      });
      console.log(gameCollection);

      var classname = document.getElementsByClassName("removeButton");
      Array.from(classname).forEach(function (element) {
        element.addEventListener('click', function(){
          let gameName = this.getAttribute("gameName");
          //find the game to remove
            // doing the call to the server right here
            fetch('users/deleteGame/' + gameName , {
            //fetch('users/deleteMovie/Moonstruck' , {  for example, this is what the URL looks like
                method: 'DELETE'
            })
            .then(res => res.text()) // or res.json()
            .then(res => displayCollection())  // wait for data on server to be valid
            // force jump off of same page to refresh the data after delete
            .catch(function (err) {
                console.log(err);
                alert(err);
               });
        
          for (let i = 0; i < gameCollection.length; i++) {
            if (gameCollection[i].name === gameName) {
              this.innerHTML = "Game removed";
              //this removes the element and changes the length of the array
              gameCollection.splice(i,1);
              displayCollection();
            }
          }
        });
      });
    }
}

function FillArrayFromServer(){
  // using fetch call to communicate with node server to get all data
  fetch('/users/gameList')
  .then(function (response) {  // wait for reply
      return response.json();
  })
  .then(function (serverData) {     // now wait for data to be complete
  // use our server data    
  gameArray = serverData; //why clear the array when it's being reassigned anyways?
  createList();
  })
  .catch(function (err) {
   console.log(err);
  });
};

function FillLibraryFromServer(){
  // using fetch call to communicate with node server to get all data
  fetch('/users/gameLibrary')
  .then(function (response) {  // wait for reply
      return response.json();
  })
  .then(function (serverData) {     // now wait for data to be complete
  // use our server data    
  gameCollection = serverData; //why clear the array when it's being reassigned anyways?
  displayCollection();
  })
  .catch(function (err) {
   console.log(err);
  });
};

function FillReviewsFromServer(){
  // using fetch call to communicate with node server to get all data
  fetch('/users/reviewList')
  .then(function (response) {  // wait for reply
      return response.json();
  })
  .then(function (serverData) {     // now wait for data to be complete
  // use our server data    
  reviewArray = serverData; //why clear the array when it's being reassigned anyways?
  })
  .catch(function (err) {
   console.log(err);
  });
};

// using fetch to push an object up to server
function addGame(game){
  
  // create request object
  const request = new Request('/users/addGame', {
      method: 'POST',
      body: JSON.stringify(game),
      headers: new Headers({
          'Content-Type': 'application/json'
      })
  });
  
  // pass that request object we just created into the fetch()
  fetch(request)
      // wait for initial server response of "200" success
      .then(resPromise1 => resPromise1.json())    // the .json sets up 2nd promise
      // wait for the .json promise, which is when the data is back
      .then(resPromise2 => $.mobile.navigate("#page1") )
      .catch(function (err) {
          console.log(err);
      });
  
}; // end of addGame

// using fetch to push an object up to server
function addReview(review){
  
  // create request object
  const request = new Request('/users/addReview', {
      method: 'POST',
      body: JSON.stringify(game),
      headers: new Headers({
          'Content-Type': 'application/json'
      })
  });
  
  // pass that request object we just created into the fetch()
  fetch(request)
      // wait for initial server response of "200" success
      .then(resPromise1 => resPromise1.json())    // the .json sets up 2nd promise
      // wait for the .json promise, which is when the data is back
      .then(resPromise2 => $.mobile.navigate("#page3") )
      .catch(function (err) {
          console.log(err);
      });
  
}; // end of addGame

document.addEventListener("DOMContentLoaded", function () {

    player0 = new userObject("firstPerson");
    player1 = new userObject("secondPerson");
    player2 = new userObject("thirdPerson");

    userArray.push(player0);
    userArray.push(player1);
    userArray.push(player2);

    FillArrayFromServer();
    FillLibraryFromServer();
    FillReviewsFromServer();

    console.log("gameArray:"+gameArray);
    console.log("libraryArray:"+gameCollection);
    console.log("reviewArray"+reviewArray);

    $(document).on("pagebeforeshow","#home", function(event){
      displayCollection();
    });

    $(document).on("pagebeforeshow", "#page1", function (event) {   // have to use jQuery 
      document.getElementById("IDparmHere").innerHTML = "";
      createList();
    });

    $(document).on("pagebeforeshow", "#details", function (event) {   // have to use jQuery 
      let localTitle = document.getElementById("IDparmHere").innerHTML;
      for(let i=0; i < gameArray.length; i++) {   
        if(gameArray[i].name === localTitle){
          //document.getElementById("oneName").innerHTML = gameArray[i].name;
          document.getElementById("oneYear").innerHTML = "Year released: " + gameArray[i].year;
          document.getElementById("oneGenre").innerHTML = "Genre: " + gameArray[i].genre;
        }
      }
      let reviewDiv = document.getElementById("reviewDiv");
      reviewDiv.innerHTML = "";//clear existing data
      for(let i=0; i < reviewArray.length; i++) {
        if(reviewArray[i].gameName === localTitle) {
          let review = `<div class='oneReview'><h3>Review by ${reviewArray[i].user}</h3><h3>Rating: ${reviewArray[i].rating}/5</h3>
                        <p>${reviewArray[i].review}</p></div>`;
          reviewDiv.innerHTML+=review;
        }
      }
   });

   $(document).on("pagebeforeshow", "#page3", function(event){
     let gameNameSelector = document.getElementById("formName");
     gameNameSelector.innerHTML = "<option value='invalid'>Select a game</option>";
     for (let i = 0; i < gameArray.length; i++) {
       gameNameSelector.innerHTML += `<option value="${gameArray[i].name}">${gameArray[i].name}</option>`;
     }
   });

   $("#page3").on("click", "#formSubmit", function(event){
     //whole buncha jquery
     let gameName = $("#formName").val();
     if (gameName === "invalid") {
      $("#reviewConfirmation").html("Please select a game");
     }
     else {
      let gameRating = $("#formRating").val();
      let gameReview = $("#formReview").val();
      let gameUser = $("#formUser").val();
      reviewArray.push(new ReviewObject(gameName,gameReview,gameRating,gameUser));
      $("#reviewConfirmation").html("Review submitted!");
      addReview(new ReviewObject(gameName,gameReview,gameRating,gameUser));
     }
   });

   document.getElementById("buttonSortTitle").addEventListener("click", function () {
    gameCollection = gameCollection.sort(compareTitle);
    displayCollection();
  });

  document.getElementById("buttonSortGenre").addEventListener("click", function () {
    gameCollection = gameCollection.sort(compareGenre);
    displayCollection();
  });

  document.getElementById("buttonSortYear").addEventListener("click", function() {
    gameCollection = gameCollection.sort(compareYear);
    displayCollection();
  })
  document.getElementById("buttonSortAllTitle").addEventListener("click", function () {
    gameArray = gameArray.sort(compareTitle);
    createList();
  });

  document.getElementById("buttonSortAllGenre").addEventListener("click", function () {
    gameArray = gameArray.sort(compareGenre);
    createList();
  });

  document.getElementById("buttonSortAllYear").addEventListener("click", function() {
    gameArray = gameArray.sort(compareYear);
    createList();
  })
});