// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

var booksSearch = require('google-books-search');
var booksSearch1 = require('google-books-catalogue-search');


// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the Kiosk locations
  app.get("/api/location", function(req, res) {
    console.log("Calling get in location");
    db.Kiosk.findAll({})
      .then(function(dbKiosk) {
        res.json(dbKiosk);
      });
  });

  //GET route for getting all genre
  app.get("/api/genre", function(req, res){
      console.log("Calling get in genre");
      db.Genre.findAll({})
      .then(function(dbGenre){
        res.json(dbGenre);
      });
  });

  //GET route for getting available books where location=req.body.location and genre = req.body.genre
  app.get("/api/catalog/books", function(req, res){
      //console.log(req);
      //console.log("Location" + req.query.kioskid);
      //console.log("Genre" + req.query.genre);
    db.Book.findAll({
      where : {
        kioskid: req.query.kioskid,
        genreid: req.query.genre
      }
    }).then(function (data){
        console.log(data);
        res.status(200).json(data)
      })
      .catch(function (error) {
        res.status(500).json(error)
      });
    }); //end of get method
  
  var titleBook = "";
  //POST route to add a book that a user wants to drop at a kiosk
  app.post("/api/addBook", function(req, res) {

    titleBook = req.body.title;
    var imageURL = "";
    booksSearch1.search(titleBook, function(error, results){
      imageURL = results[0].imageLinks.smallThumbnail;
      console.log(imageURL);
      if(error){
        console.error(error);
      }
      else{
        db.Book.create({
          KioskId: req.body.KioskId,
          title: req.body.title,
          author: req.body.author,
          GenreId: req.body.genre,
          imgurl: imageURL
        })
          .then(function(dbBook) {
            res.json(dbBook);
          });
      } //end of else
    });
  });

  //delete route to delete the book when a user picks up the book
  app.delete("/api/pickBooks/:id", function(req, res){
    console.log("Deleting book from our table");
    db.Book.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(function(dbBook){
        res.json(dbBook);
    });
  });
} 
  //end of app function
