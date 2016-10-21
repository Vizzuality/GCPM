(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Investigator = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Investigator.prototype, {

    defaults: {
      multiple: false,
      name: 'investigator',
      label: 'Investigator',
      placeholder: 'All investigators',
      blank: null,
      addNew: true,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.investigators = new App.Collection.Investigators();

      // Creating view
      this.select = new App.View.Select({
        el: viewSettings.DOMelement,
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('new', function(){
        App.trigger('Investigator:new');
      }, this);

      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('Investigator:change', this.state.attributes);
      }, this);

    },

    setSubscriptions: function(){
      App.on('InvestigatorForm:submit', function(newInvestigator){
        var newOption = {
          value: JSON.stringify(newInvestigator)
        };
        newOption.name = newInvestigator.investigatorName;
        this.select.options.options.unshift(newOption);
        this.select.render();
        this.select.$el.find("select").val(newOption.value).trigger("change");
      }, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      if(this.investigators.length > 0){
        return this.investigators;
      }
      else{
        return this.investigators.fetch({add: true}).done(function() {
          var options = this.investigators.map(function(type) {
            return {
              name: type.attributes.name,
              value: type.attributes.id
            };
          });
          this.select.setOptions(options);
        }.bind(this));
      }
    },

    render: function() {
      this.select.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);
