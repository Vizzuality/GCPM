/* global ga */
(function(App) {

  'use strict';

  App.View.SignUp = Backbone.View.extend({

    events: {
      'submit form': 'handleSubmit'
    },

    initialize: function() {
    },

    handleSubmit: function() {
      ga('send', 'event', 'Signup', 'Sign Up', 'sign_up');
    },

  });

})(this.App);
