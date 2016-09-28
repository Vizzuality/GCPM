(function(App) {

  'use strict';

  App.View.SubmitButton = Backbone.View.extend({

    initialize: function(settings) {
      this.el = settings.el;
      this.options = _.extend({}, this.defaults, settings.options);
      this.render();
      this.setEvents();
    },

    render: function() {
      this.$el.append('<button class="submit c-button -filled -color-3">Submit</button');
    },

    setEvents: function() {
      this.$el.find('.submit').on('click', this.triggerClick.bind(this));
    },

    triggerClick: function() {
      this.trigger('click', this);
    }

  });

})(this.App);
