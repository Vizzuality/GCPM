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
          label: 'Funding sources',
          inputClass: 'c-section-title -one-line',
          placeholder: 'Funding sources'
        }
      });

      this.render();
      this.setSubscriptions();
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
    },

    setSubscriptions: function() {
      this.fundingSourcesSelect.on('change', this.setSelectMultipleValues, this);
      // this.fundingSourcesSelect.on('add-new-funding-click', this.renderModal, this);
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

    setState: function(state, options) {
      this.state.set(state, options);
    }

  });

})(this.App);
