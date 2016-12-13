(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.FundingSources = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FundingSources.prototype, {

    defaults: {
      multiple: true,
      name: 'funding_sources[]',
      label: 'Funding Source',
      placeholder: 'Funding Sources',
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
      this.fundingSources = new App.Collection.FundingSources();

      // Creating view
      this.select = new App.View.Select({
        el: '#funding-sources',
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
        App.trigger('FundingSources:new');
      }, this);

      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('FundingSources:change', this.state.attributes);
      }, this);

    },

    setSubscriptions: function(){
      App.on('FundingSourcesForm:submit', function(newFunding){
        var newOption = {
          value: JSON.stringify(newFunding)
        };
        newOption.name = newFunding.organizationName;
        this.select.options.options.unshift(newOption);
        this.select.render();
        this.setValue(newOption.value);
        // var data = this.select.$el.find("select").select2("data");
        // data.push(newOption.value);
        // this.select.$el.find("select").select2("data", data, true);
      }, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.fundingSources.fetch({add: true}).done(function() {
        var options = this.fundingSources.map(function(type) {
          return {
            name: type.attributes.name,
            value: type.attributes.id
          };
        });
        this.select.setOptions(options);
      }.bind(this));
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

    setValue: function(values){
      this.select.$el.find("select").val(values).trigger("change");
    },

    setFetchedValues: function(values){
      var vals = values.map(function(elem){
        return elem.id;
      });
      this.select.$el.find("select").val(vals).trigger("change");
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
