(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      var titleInput = new App.Presenter.Input();
      var descTextarea = new App.Presenter.Textarea();
      var startPickadate = new App.Presenter.PickadateStart({
        label: null,
      });
      var endPickadate = new App.Presenter.PickadateEnd({
        label: null,
      });
      var websiteInput = new App.Presenter.WebsiteInput();
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
        addNew: true
      });
      var investigatorOrganization = new App.Presenter.InvestigatorOrganization();

      this.fundingSourcesForm = new App.Presenter.FundingSourcesForm();

      this.children = [titleInput, descTextarea, startPickadate, endPickadate,
         websiteInput, projectTypes, cancerTypes, fundingSources, investigatorOrganization];

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

      this.projectForm.on('newInvestigator', function(newState) {
        App.trigger('ProjectForm:newInvestigator');
      }, this);
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {
      App.on('FundingSources:new', function(){
        this.fundingSourcesForm.openForm();
      }, this);
    },

    setState: function(newState) {
      this.state.set(newState);
    },

    /**
     * Subscribing to global events
     */
    handleSubmit: function() {
      console.log(this.state.attributes);

      // title OK, summary OK, start_date OK, end_date OK, project_website OK
      // @TODO project_types[] change to project_type_ids
      // @TODO cancer_types[] change to cancer_tpye_ids
      // @TODO funding_sources -> if string -> funding_source_ids
      // @TODO funding_sources -> if object -> new_funders

      // @TODO request (validate response)
      /*var url = "/api/projects?token=AUTH_TOKEN";
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
      req.send(this.state.attributes);*/
    },

    renderForm: function(){

      var promises = _.compact(_.map(this.children, function(child) {
        if (!!child.fetchData) {
          return child.fetchData();
        }
        return null;
      }));

      $.when.apply($, promises).done(function() {
        this.renderFormElements();
      }.bind(this));

    },

    renderFormElements: function() {
      this.projectForm.render();
      _.each(this.children, function(child){

        // Render the child
        child.render();
      }.bind(this));
    }

  });

})(this.App);
