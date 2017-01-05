(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.PostFormPresenter = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.PostFormPresenter.prototype, {

    defaults: {
      'post[countries][]': undefined,
      'post[cancer_types][]': undefined,
      'post[organizations][]': undefined,
      'post[projects][]': undefined,
      'post[specialities][]': undefined
    },

    initialize: function(params) {
      this.state = new StateModel(params);
      var countries = new App.Presenter.Countries({
        multiple: true,
        select2Options: {},
        label: 'Countries',
        blank: null,
        addNew: false,
        name: 'post[countries][]',
        valueName: 'id'
      });
      var organizations = new App.Presenter.Organizations({
        label: 'Organizations',
        addNew: false,
        name: 'post[organizations][]'
      });
      var cancerTypes = new App.Presenter.CancerTypes({
        label: 'Cancer types',
        addNew: false,
        name: 'post[cancer_types][]',
        required: false
      });
      var projects = new App.Presenter.Projects({
        label: 'Projects',
        addNew: false,
        name: 'post[projects][]'
      });
      var specialities = new App.Presenter.Specialities({
        label: 'Specialities',
        addNew: false,
        name: 'post[specialities][]'
      });

      this.children = [countries, organizations, cancerTypes, projects, specialities];

      this.countries = new App.Collection.Countries();
      this.countries.fetch();

      this.postForm = new App.View.PostForm({
        el: '#postForm',
        children: this.children
      });

      this.setEvents();
      this.setSubscriptions();
      this.renderForm();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.postForm.on('cancel', this.closeForm, this);
      this.postForm.on('submit', function(newState) {
        console.info(newState);
      }, this);

      this.state.on('change', function() {
        App.trigger('PostFormPresenter:change', this.getState());
      }, this);
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {
    },

    /**
     * Setting form state
     * @param {Object} newState
     */
    setState: function(newState, options) {
      this.state
        .clear({ silent: true })
        .set(newState, options);
    },

    getState: function() {
      return this.state.attributes
    },

    /**
     * Fetch all presenters and render all children
     */
    renderForm: function() {
      if (!this.loaded) {
        var promises = _.compact(_.map(this.children, function(child) {
          if (child.fetchData) {
            return child.fetchData();
          }
          return null;
        }));

        $.when.apply($, promises).done(function() {
          this.loaded = true;
          this.renderFormElements();
        }.bind(this));
      } else {
        this.renderFormElements();
      }
    },

    renderFormElements: function() {
      this.postForm.render();

      _.each(this.children, function(child){
        // Get && set the value from the state thanks to the name
        // I need to pass the rest of the params because there are some presenters that need other params
        // Then, inside of each presenter, they will handle its state
        var state = _.extend({}, this.state.toJSON(), {
          value: this.state.get(child.options.name)
        });
        child.setState(state, { silent: true });

        // Render the child
        child.render();
      }.bind(this));
    }
  });

})(this.App);
