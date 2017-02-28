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
        minimumInputLength: 3,
        ajax: {
          url: '/api/investigators',
          delay: 150,
          cache: false,
          data: function (params) {
            var query = {
              q: params.term,
              page: params.page || 1,
              token: window.AUTH_TOKEN
            }
            // Query paramters will be ?q=[term]&page=[page]
            return query;
          },

          processResults: function (investigators) {
            return {
              results: _.sortBy(_.map(investigators, function(inv){
                return {
                  text: inv.name,
                  id: inv.id
                };
              }), 'text')
            }
          }
        }
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.investigators = new App.Collection.Investigators();

      // Creating view
      this.select = new App.View.Select({
        el: viewSettings.DOMelement,
        options: _.extend({
          options: []
        }, this.defaults, viewSettings || {}),
        state: this.state
      });
      this.DOMelementId = viewSettings.DOMelement.split("-")[1];

      this.investigatorForm = new App.Presenter.InvestigatorForm({
        DOMelementId: this.DOMelementId
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('new', function(){
        this.investigatorForm.openForm();
      }, this);

      this.select.on('setValues', function(values){
        this.setValues(values);
      }, this);

      this.select.on('change', function(newState){
        if (this.state.get('value') && newState.value && (this.state.get('value')[0] != newState.value[0])) {
          this.new = false;
        }

        App.trigger('Investigator:change', this.state.attributes);
        this.setState(newState);
      }, this);

    },

    setSubscriptions: function(){
      App.on('InvestigatorForm:submit-'+this.DOMelementId, function(newInvestigator){
        var newOption = {
          value: JSON.stringify(newInvestigator)
        };
        newOption.name = newInvestigator.investigatorName;
        this.select.options.options.unshift(newOption);
        this.select.render();
        this.setValue(newOption.value);
        this.new = true;
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

    setValue: function(value){
      this.select.$el.find("select").val(value).trigger("change");
    },

    setValues: function(values) {
      if (this.new) {
        var model = this.select.options.options[0];
        $(this.select.select.selector).select2("trigger", "select", {
          data: {
            id: model.value,
            text: model.name
          }
        });

      } else {
        _.each(values, function(v){
          if (v) {
            this.investigatorModel = new App.Model.Investigator({
              id: v
            });
            this.investigatorModel.fetch().done(function(model){
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
      }
    },


    setFetchedValues: function(value){
      this.select.$el.find("select").val(value).trigger("change");
      this.select.$el.find("select").attr("disabled", true);
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
