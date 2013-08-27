/**
 * Controller for user login/logout & authenticate sessions
 *
 * Example from Turbo87/locomotive-passport-boilerplate
 * https://raw.github.com/Turbo87/locomotive-passport-boilerplate/master/app/controllers/account_controller.js
 * But I change the name of the controller from account to user
 * 
 * @use: locomotive & passport
 */
var locomotive = require('locomotive');
var passport = require('passport');
var Controller = locomotive.Controller;

var User = require('../models/userModel');

var UserController = new Controller();

UserController.show = function() {
  if (!this.req.isAuthenticated())
    return this.res.redirect(this.urlFor({ action: 'login' }));

  this.user = this.req.user;
  this.render();
};

UserController.new = function() {
  this.render();
};

UserController.loginForm = function() {
  this.render();
};

UserController.create = function() {
  var user = new User();

  user.email = this.param('email');
  user.password = this.param('password');
  user.name.first = this.param('name.first');
  user.name.last = this.param('name.last');

  var self = this;
  user.save(function (err) {
    if (err)
      return self.redirect(self.urlFor({ action: 'new' }));

    return self.redirect(self.urlFor({ action: 'login' }));
  });
};

UserController.login = function() {
  passport.authenticate('local', {
    successRedirect: this.urlFor({ action: 'show' }),
    failureRedirect: this.urlFor({ action: 'login' }) }
  )(this.__req, this.__res, this.__next);
};

UserController.logout = function() {
  this.req.logout();
  this.redirect('/');
};

module.exports = UserController;