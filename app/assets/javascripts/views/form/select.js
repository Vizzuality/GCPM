(function(App) {

  'use strict';

  App.View.Select = Backbone.View.extend({

    defaults: {
    },

    template: HandlebarsTemplates['select'],

    initialize: function(settings) {
      this.el = settings.el;
      this.options = _.extend({}, this.defaults, settings.options || {});

      this.render();
      this.setEvents();
    },

    render: function() {
      this.$el.html(this.template(this.options));
    },

    renderOptions: function(options) {
      this.$el.find('select').empty();
      options.map(function(option) {
        this.$el.find('select')
          .append($('<option value="' + option.value + '">' + option.name +'</option>'));
      }.bind(this));
    },

    setEvents: function() {
      this.$el.find('select').on('change', this.triggerChange.bind(this));
      // this.$el.find('.add-new').on('click', this.triggerAddNewClick.bind(this));
    },

    triggerChange: function(e) {
      this.trigger('change', this);
    },

    // triggerAddNewClick: function() {
    //   this.trigger('add-new-funding-click', this);
    // }

  });

})(this.App);
