let userArray = [];
let gameArray = [];
let reviewArray = [];
let currentUser = "You are not logged in";

var GameObject = function(name, year, genre) {
  this.name = name;
  this.year = year;
  this.genre = genre;
}

gameArray.push(new GameObject("game1", 2000, "Real Time Strategy"));
gameArray.push(new GameObject("game2", 2001, "First Person Shooter"));
gameArray.push(new GameObject("game3", 2002, "Turn Based Strategy"));
gameArray.push(new GameObject("game4", 2000, "Action Adventure"));
gameArray.push(new GameObject("game5", 2001, "Real Time Strategy"));
gameArray.push(new GameObject("game6", 2002, "First Person Shooter"));

var ReviewObject = function(gameName, review, rating, user) {
  this.gameName = gameName; //gonna associate games n' reviews via the name
  this.review = review;
  this.rating = rating;
  this.user = user;
}

// define a constructor to create user objects
var userObject = function (Name) {
  this.name = Name;
}


function createList()
{
  /*
    Okay, this is weird. Clearing the div of children is only working if I use document.getElementByID instead of the variable.
    The variable is only working for adding children below if I use the jquery selector to set it. Why is this???
    I blame jquery mobile for being a pile of crap that was abandoned like 4 years ago.
  */
  var divUserlist = $("#divUserlist");
  // var divUserlist = document.getElementById("divUserlist");
  // while (divUserlist.firstChild) {
  //     divUserlist.removeChild(divUserlist.lastChild);
  // };
  // divUserlist.innerHTML = "";
  document.getElementById("divUserlist").innerHTML = "";// remove old data

  gameArray.forEach(function (element,) {   // use handy array forEach method
    let content = `<div data-role='collapsible' data-theme='b' data-content-theme='a'><h3>${element.name}</h3>
                  <p>Year:${element.year}<br>Genre:${element.genre}</p></div>`;
      //time to do things the jquery way
      divUserlist.append(content).collapsibleset("refresh");//add the new collapsible widget to the set, then refresh the set
    });

  // var ul = document.createElement('div');
  // ul.setAttribute("data-role","collapsible-set");
  // ul.setAttribute("data-theme","b");
  // ul.setAttribute("data-content-theme","a");
  // userArray.forEach(function (element,) {   // use handy array forEach method
  //   var li = document.createElement('div');
  //   ul.setAttribute("data-role","collapsible");
  //   ul.setAttribute("data-theme","b");
  //   ul.setAttribute("data-content-theme","a");
  //   li.innerHTML = "<a data-transition='pop' class='onePlayer' data-parm=" + element.name + "  href='#page3'>Jump </a> " + element.name;
  //   ul.append(li);
  // });
  // divUserlist.append(ul);

  // set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
  // var classname = document.getElementsByClassName("onePlayer");
  // Array.from(classname).forEach(function (element) {
  //       element.addEventListener('click', function(){
  //           var parm = this.getAttribute("data-parm");  // passing in the record.Id
  //           console.log(parm);
  //           //do something here with parameter on  pickbet page
  //           document.getElementById("IDparmHere").innerHTML = parm;
  //           document.location.href = "index.html#page3";
  //       });
  //   });
};

document.addEventListener("DOMContentLoaded", function () {

    player0 = new userObject("firstPerson");
    player1 = new userObject("secondPerson");
    player2 = new userObject("thirdPerson");

    userArray.push(player0);
    userArray.push(player1);
    userArray.push(player2);

    console.log(userArray);

    createList();//need to call it once so it'll happen on the first load

    $(document).on("pagebeforeshow", "#home", function (event) {
    // document.getElementById("IDparmHere").innerHTML = "";
      createList();
    });

});