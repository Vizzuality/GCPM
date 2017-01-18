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
        minimumInputLength: 3,
        ajax: {
          url: '/api/organizations?funding_source=true',
          delay: 150,
          cache: false,
          data: function (params) {
            var query = {
              funding_source: true,
              q: params.term,
              page: params.page || 1
            }
            // Query paramters will be ?q=[term]&page=[page]
            return query;
          },

          processResults: function (organizations) {
            return {
              results: _.sortBy(_.map(organizations, function(org){
                return {
                  text: org.name,
                  id: org.id
                };
              }), 'text')
            }
          }
        }
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

      this.select.on('setValues', function(values){
        this.setValues(values);
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
      return true;
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

    setValues: function(values) {
      _.each(values, function(v){
        if (v) {
          this.organizationModel = new App.Model.Organization({
            id: v
          });
          this.organizationModel.fetch().done(function(model){
            $(this.select.select.selector).select2("trigger", "select", {
              data: {
                id: model.id,
                text: model.name
              }
            });
          }.bind(this));
        }
        // var current = _.findWhere(this.options.options, { id: parseInt(v) }) || _.findWhere(this.options.options, { value: parseInt(v) });
      }.bind(this));
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
