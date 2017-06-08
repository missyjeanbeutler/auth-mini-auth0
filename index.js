const express = require('express'),
      session = require('express-session'),
      passport = require('passport'),
      Auth0Strategy = require('passport-auth0'),
      bodyParser = require('body-parser'),
      config = require('./config')

const app = express(),
      port = 3005

app.use(bodyParser.json())
app.use(session({
  secret: config.SESSION_SECRET,
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

// console.log(passport, ' PASSPORT') //object
// console.log(Auth0Strategy.toString(), ' AUTH0') //constructor function

passport.use(new Auth0Strategy({
  domain: config.auth0.DOMAIN,
  clientID: config.auth0.CLIENTID,
  clientSecret: config.auth0.CLIENTSECRET,
  callbackURL: '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile)
}))

app.get('/auth', passport.authenticate('auth0'))

app.get('/auth/callback', passport.authenticate({successRedirect: '/', failureRedirect: '/login'}))



app.listen(port, () => {
  console.log(`listening on port ${port}`)
})