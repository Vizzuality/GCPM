(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.FundingSources = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FundingSources.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.fundingSources = new App.Collection.FundingSources();
      this.fundingSourcesSelect = new App.View.Select({
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

    render: function() {
      this.fundingSources
        .fetch()
        .done(function() {
          var options = this.fundingSources.toJSON().map(function(type) {
            return { name: type.name, value: type.id };
          });
          this.fundingSourcesSelect.setOptions(options);
        }.bind(this));
        this.fundingSourcesSelect.render();
    },

    setEvents: function() {
      this.state.on('change', this.setSelectMultipleValues, this);
      this.fundingSourcesSelect.on('change', this.setState, this);
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
      this.fundingSourcesSelect.setElement(el);
    },

    getElement: function() {
      return this.fundingSourcesSelect.$el;
    }

  });

})(this.App);
