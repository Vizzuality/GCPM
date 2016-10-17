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

      this.investigatorOrganization = new App.Presenter.InvestigatorOrganization();
      this.fundingSourcesForm = new App.Presenter.FundingSourcesForm();

      this.children = [titleInput, descTextarea, startPickadate, endPickadate,
         websiteInput, projectTypes, cancerTypes, fundingSources, this.investigatorOrganization];

      this.projectForm = new App.View.ProjectForm({
        children: this.children,
        el: '#project_form'
      });

      this.request = {};
      this.request.project = {};
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
      this.buildRequest();
      console.log(this.request);

      // @TODO I have the elements and the Ids in this.investigatorOrganization.elements
      // for each one -> get the data from attributes and make a proper request
      // then just spend 1 hour to focus in other bugs like input.

      // @TODO request (validate response)
      var p = new Promise(function(resolve, reject){
        var url = "/api/projects?token="+AUTH_TOKEN;
        var q = new XMLHttpRequest();
        q.open('POST', url, true);
        q.setRequestHeader('Content-Type', 'application/json');
        q.onreadystatechange = function(){
          if(this.readyState == 4 && this.status == 200){
            if(this.response !== undefined && this.response !== ""){
              resolve(this.response);
            }
          }
          // else if(ERROR){
          //   reject(q.response);
          // }
        }
        q.send(JSON.stringify(this.request));
      }.bind(this)).then(function(response){
        var response = JSON.parse(response);
        console.log(response);
      }.bind(this)).catch(function(response){
        throw Error(response);
      });
    },

    buildRequest: function(){
      this.request.project["title"] = this.state.attributes["title"];
      this.request.project["summary"] = this.state.attributes["summary"];
      this.request.project["start_date"] = this.state.attributes["start_date"];
      this.request.project["end_date"] = this.state.attributes["end_date"];
      this.request.project["project_website"] = this.state.attributes["project_website"];
      this.request.project["project_type_ids"] = this.state.attributes["project_types[]"];
      this.request.project["cancer_tpye_ids"] = this.state.attributes["cancer_types[]"];
      this.buildFundingSources();
      this.buildInvestigators();
    },

    buildFundingSources(){
      this.request.project["funding_source_ids"] = [];
      this.request.project["new_funders"] = [];
      _.each(this.state.attributes["funding_sources[]"], function(element) {
        if(!isNaN(parseInt(element))){
          this.request.project["funding_source_ids"].push(element);
        }
        else{
          element = JSON.parse(element);
          var funder = {};
          funder["name"] = element["organizationName"];
          funder["organization_type_id"] = element["organizationType"];
          funder["addresses_attributes"] = [];
          var funderAdd = {};
          funderAdd["country_id"] = element["organizationCountry"];
          funderAdd["latitude"] = element["organizationLatitude"];
          funderAdd["longitude"] = element["organizationLongitude"];
          funderAdd["primary"] = true;
          funder["addresses_attributes"].push(funderAdd);
          this.request.project["new_funders"].push(funder);
        }
      }, this);
    },

    buildInvestigators(){

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
