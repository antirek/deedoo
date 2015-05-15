express = require 'express'
bodyParser = require 'body-parser'
models = require './models'
app = express()
createModelRouter = require './model'

app.set 'views', "#{__dirname}/views"
app.set 'view engine', 'jade'

app.use '/bower_components', express.static "#{__dirname}/bower_components"
app.use '/public', express.static "#{__dirname}/public"

app.get '/', (req, res)->
  res.render 'index'
app.get '/partials/:folder/:view', (req, res)->
  res.render "partials/#{req.params.folder}/#{req.params.view}"
app.use '/hosts', createModelRouter models.Host
app.use '/services', createModelRouter models.Service

app.listen 3000