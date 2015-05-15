express = require 'express'
bodyParser = (require 'body-parser').json()
createRouter = (Model)->
  router = express.Router()
  router.use bodyParser
  router.route '/'
  
  .get (req, res) ->
    Model.find {}, (err, models) ->
      res.json models

  .post (req, res, next) ->
    model = new Model req.body
    model.save (err) ->
      if err
        next err
      else
        res.json model

  router.route '/:id'
  .get (req, res, next) ->
    Model.findOne
      _id: req.params.id
      (err, model) ->
        if err
          next err
        else
          res.json model
  .delete (req, res, next) ->
    Model.remove
      _id: req.params.id
      (err) ->
        if err
          next err
        else
          res.json message: 'success'

  .post (req, res, next) ->
    data = JSON.parse JSON.stringify req.body
    delete data._id
    Model.findOneAndUpdate
      _id: req.params.id
    , data
    , (err, model)->
      if err
        next err
      else
      res.json req.body
  router

module.exports = createRouter