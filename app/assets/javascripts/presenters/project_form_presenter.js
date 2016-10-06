(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      var titleInput = new App.Presenter.Input({
        label: null
      });
      var descTextarea = new App.Presenter.Textarea({
        label: null
      });
      var startPickadate = new App.Presenter.PickadateStart({
        label: null
      });
      var endPickadate = new App.Presenter.PickadateEnd({
        label: null
      });
      var websiteInput = new App.Presenter.WebsiteInput({
        label: null
      });
      var projectTypes = new App.Presenter.ProjectTypes({
        label: null,
        addNew: false
      });
      var cancerTypes = new App.Presenter.CancerTypes({
        label: null,
        addNew: false
      });
      var fundingSources = new App.Presenter.FundingSources({
        label: null,
        addNew: false
      });
      var investigators  = new App.Presenter.Investigators({
        label: null,
        addNew: false
      });
      var organizations = new App.Presenter.Organizations({
        label: null,
        addNew: false
      });

      this.children = [titleInput, descTextarea, startPickadate, endPickadate,
         websiteInput, projectTypes, cancerTypes, fundingSources, investigators,
         organizations];

      this.modal = new App.View.Modal();
      this.projectForm = new App.View.ProjectForm({
        children: this.children,
        el: '#project_form'
      });

      this.setEvents();
      this.setSubscriptions();
      this.renderForm();
    },

    /**
     * Setting internal events
     */
    setEvents: function(){
      this.state.on('change', function(){
        App.trigger('ProjectForm:change', this.state.attributes);
      }, this);

      this.projectForm.on('submit', function(newState) {
        this.setState(newState);
        this.handleSubmit();
      }, this);
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {

    },

    setState: function(newState) {
      this.state.set(newState);
    },

    /**
     * Subscribing to global events
     */
    handleSubmit: function() {
      console.log(this.state.attributes);
      var url = "";
      var req = new XMLHttpRequest();
      req.onload = function(){
        if(this.status = 200){
          console.log("success");
        }
        else{
          console.log("error");
        }
      };
      req.open("POST", url, true);
      req.send(this.state.attributes);
    },

    renderForm: function(){
      this.projectForm.render();
      this.renderFormElements();
    },

    renderFormElements: function() {
      _.each(this.children, function(child){
        // Get && set the value from the state thanks to the name
        // I need to pass the rest of the params because there are some presenters that need other params
        // Then, inside of each presenter, they will handle its state
        var state = _.extend({}, this.state.toJSON(), {
          value: this.state.get(child.defaults.name),
        });

        child.setState(state, { silent: true });

        // Render the child
        child.render();
      }.bind(this));
    }

  });

})(this.App);