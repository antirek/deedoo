gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
uglify = require 'gulp-uglify'
gulp.task 'default', ['client'], ->
  gulp.src ['**/*.coffee', '!node_modules', '!bower_components', '!gulpfile.coffee', '!client/**/*.coffee']
  .pipe coffee()
  .pipe gulp.dest './'

gulp.task 'client', ->
  gulp.src ['client/**/*.coffee']
  .pipe coffee bare: true
  .pipe concat 'bedo.min.js'
  .pipe uglify()
  .pipe gulp.dest 'public/js/'

gulp.task 'watch', ()->
  gulp.watch '**/*.coffee', ['default']
