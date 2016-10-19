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
      var policy = new App.Presenter.Policy();

      this.investigatorOrganization = new App.Presenter.InvestigatorOrganization();
      this.fundingSourcesForm = new App.Presenter.FundingSourcesForm();

      this.children = [titleInput, descTextarea, startPickadate, endPickadate,
         websiteInput, projectTypes, cancerTypes, fundingSources, policy, this.investigatorOrganization];

      this.projectForm = new App.View.ProjectForm({
        children: this.children,
        el: '#project_form'
      });

      this.request = {};
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

      this.projectForm.on('newInvestigator', function() {
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
      //console.log(this.state.attributes);

      // @TODO request (validate response)
      new Promise(function(resolve, reject){
        var url = "/api/projects?token="+AUTH_TOKEN;
        var q = new XMLHttpRequest();
        q.open('POST', url, true);
        q.setRequestHeader('Content-Type', 'application/json');
        q.onreadystatechange = function(){
          if(this.readyState === 4){
            if(this.status.toString()[0] == "2"){
              resolve(this.response);
            }
            else if(this.status.toString()[0] == "4" || this.status.toString()[0] == "5"){
              reject(this.response);
            }
            else{
              // foo
            }
          }
        }
        q.send(JSON.stringify(this.request));
      }.bind(this)).then(function(response){
        var pId = JSON.parse(response).id;
        window.location.href = "/projects/"+pId;
      }.bind(this)).catch(function(response){
        var messages = JSON.parse(response).messages;
        console.log(messages);
      });
    },

    buildRequest: function(){
      this.request.project = {
        title: this.state.attributes["title"],
        summary: this.state.attributes["summary"],
        start_date: this.state.attributes["start_date"],
        end_date: this.state.attributes["end_date"],
        project_website: this.state.attributes["project_website"],
        project_type_ids: this.state.attributes["project_types[]"],
        cancer_type_ids: this.state.attributes["cancer_types[]"]
      };
      this.buildFundingSources();
      this.buildInvestigators();
    },

    buildFundingSources: function(){
      this.request.project["funding_source_ids"] = [];
      _.each(this.state.attributes["funding_sources[]"], function(element) {
        if(!isNaN(parseInt(element))){
          this.request.project["funding_source_ids"].push(element);
        }
        else{
          this.request.project["new_funders"] = [];
          element = JSON.parse(element);
          var funder = {
            name: element["organizationName"],
            organization_type_id: element["organizationType"],
            addresses_attributes: []
          };
          var funderAdd = {
            country_id: element["organizationCountry"],
            latitude: element["organizationLatitude"],
            longitude: element["organizationLongitude"],
            primary: true,
          };
          funder["addresses_attributes"].push(funderAdd);
          this.request.project["new_funders"].push(funder);
        }
      }, this);
    },

    buildInvestigators: function(){
      if(this.investigatorOrganization.elements.length > 0){
        var firstId = this.investigatorOrganization.elements[0].id;
        var firstInvestigator = JSON.parse(this.state.attributes["investigator-"+firstId]);
        var firstOrganization = JSON.parse(this.state.attributes["organization-"+firstId]);
        if(firstInvestigator !== null && firstOrganization !== null){
          this.request.project["memberships"] = [];
          _.each(this.investigatorOrganization.elements, function(element) {
            var id = element.id;
            var investigator = JSON.parse(this.state.attributes["investigator-"+id]);
            var organization = JSON.parse(this.state.attributes["organization-"+id]);
            var address = this.state.attributes["address-"+id];
            var lead = this.state.attributes["lead"];
            var obj = {};

            // LEAD
            if(lead.split("-")[1] == id){
              obj.membership_type = "main";
            }
            else{
              obj.membership_type = "secondary";
            }

            // EE
            if(!isNaN(parseInt(investigator)) && !isNaN(parseInt(organization))){
              obj.research_unit_attributes = {
                investigator_id: investigator,
                address_id: address
              };
            } // EN
            else if(!isNaN(parseInt(investigator)) && isNaN(parseInt(organization))){
              obj.research_unit_attributes = {
                investigator_id: investigator,
                addresses_attributes: {
                  country_id: organization.organizationCountry,
                  organization_attributes: {
                    name: organization.organizationName,
                    organization_type_id: organization.organizationType
                  }
                }
              };
            } // NE
            else if(isNaN(parseInt(investigator)) && !isNaN(parseInt(organization))){
              obj.research_unit_attributes = {
                address_id: address,
                investigator_attributes: {
                  name: investigator.investigatorName,
                  email: investigator.investigatorName,
                  website: investigator.investigatorWebsite
                }
              };
            } // NN
            else{
              obj.research_unit_attributes = {
                investigator_attributes: {
                  name: investigator.investigatorName,
                  email: investigator.investigatorName,
                  website: investigator.investigatorWebsite,
                  addresses_attributes: [
                    {
                      country_id: organization.organizationCountry,
                      organization_attributes: {
                        name: organization.organizationName,
                        organization_type_id: organization.organizationType
                      }
                    }
                  ]
                }
              };
            }
            this.request.project["memberships"].push(obj);
          }, this);
        }
      }
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
