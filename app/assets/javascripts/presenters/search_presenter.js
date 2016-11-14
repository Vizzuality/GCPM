(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Search = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Search.prototype, {

    default: {
      options: [
        {
          name: 'All sections',
          value: 'All sections'
        },
        {
          name: 'Project',
          value: 'Project'
        },
        {
          name: 'Investigator',
          value: 'Investigator'
        },
        {
          name: 'Organization',
          value: 'Organization'
        },
        {
          name: 'Cancer type',
          value: 'CancerType'
        },
        {
          name: 'Event',
          value: 'Event'
        }
      ]
    },

    initialize: function(params) {
      this.state = new StateModel({ value: gon.type });

      this.searchTypes = new App.View.Select({
        el: '#search-type',
        state: this.state,
        options: {
          multiple: false,
          name: 'search[type]',
          label: null,
          placeholder: '',
          blank: null,
          addNew: false,
          select2Options: {
            // closeOnSelect: false
            // It solves the closing of the dropdown menu
            // It adds a lot of UX issues
            // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
            // - Click: On each click dropdown will appear and dissapear
          }
        }
      });

      this.searchTypes.setOptions(this.default.options);
      this.searchTypes.render();
    }

  });

})(this.App);
