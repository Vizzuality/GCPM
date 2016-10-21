/*(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.FundingSources = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FundingSources.prototype, {

    defaults: {
      name: 'funding_source_ids'
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.fundingSources = new App.Collection.FundingSources();

      this.select = new App.View.Select({
        el: '#funding-sources',
        options: {
          multiple: true,
          name: 'funding_source_ids',
          addNew: true,
          type: 'text',
          label: null,
          inputClass: 'c-section-title -one-line',
          placeholder: 'All Funding sources'
        }
      });

      this.setEvents();
    },

    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('FundingSources:change', this.state.attributes);
      }, this);
      this.select.on('change', this.setState, this);
    },


    fetchData: function() {
      return this.fundingSources.fetch().done(function() {
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

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setSelectMultipleValues: function(select) {
      var values = [];
      var options = select.$el.find('select :selected');

      options.map(function(index, option) {
        values.push(Number(option.value));
      }.bind(this));

      if (values) {
        var obj = {};
        obj[select.options.name] = values;

        this.state.set(obj);
        App.trigger('FundingSourcesSelect:change', this);
      }
    },

    setElement: function(el) {
      this.select.setElement(el);
      this.select.render();
    },

    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);*/
