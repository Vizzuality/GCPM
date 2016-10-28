(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.DatesTimeline = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.DatesTimeline.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.timeline = new App.View.DatesTimeline({
        el: '#datesTimeline'
      });

      this.setEvents();
      this.setSubscriptions();


      this.setState(params);
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    setEvents: function() {
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
      App.on('Remote:load', this.updateTimeline, this);
    },

    updateTimeline: function() {
      if (this.state.get('data') === 'info') {
        this.timeline.setElement('#datesTimeline');
        this.timeline.setTimelineLineWidth();
      }
    }

  });

})(this.App);
