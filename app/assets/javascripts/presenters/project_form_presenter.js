/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      this.titleInput = new App.Presenter.Input();
      this.descTextarea = new App.Presenter.Textarea();
      this.startPickadate = new App.Presenter.PickadateStart({
        label: null,
      });
      this.endPickadate = new App.Presenter.PickadateEnd({
        label: null,
      });
      this.websiteInput = new App.Presenter.WebsiteInput();
      this.projectTypes = new App.Presenter.ProjectTypes({
        label: null,
        addNew: false
      });
      this.cancerTypes = new App.Presenter.CancerTypes({
        label: null,
        addNew: false
      });
      this.specialities = new App.Presenter.Specialities({
        label: null,
        addNew: false
      });
      this.fundingSources = new App.Presenter.FundingSources({
        label: null,
        addNew: true
      });
      this.policy = new App.Presenter.Policy();
      this.messagesList = new App.Presenter.MessagesList();

      this.investigatorOrganization = new App.Presenter.InvestigatorOrganization();
      this.fundingSourcesForm = new App.Presenter.FundingSourcesForm();

      this.children = [this.titleInput, this.descTextarea, this.startPickadate,
         this.endPickadate, this.websiteInput, this.projectTypes, this.cancerTypes, this.specialities,
         this.fundingSources, this.policy, this.messagesList, this.investigatorOrganization];

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
        ga('send', 'event', 'Users', 'Add data', 'Add Project');
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
      new Promise(function(resolve, reject){
        var url = "/api/projects?token="+window.AUTH_TOKEN;
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
        var pSlug = JSON.parse(response).slug;
        window.location.href = "/projects/"+pSlug;
      }.bind(this)).catch(function(response){
        var messages = JSON.parse(response).message;
        App.trigger("ProjectForm:errors", messages);
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
        cancer_type_ids: this.state.attributes["cancer_types[]"],
        speciality_ids: this.state.attributes["specialities[]"]
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
          if(!this.request.project['new_funders']){
            this.request.project["new_funders"] = [];
          }
          element = JSON.parse(element);
          var funder = {
            name: element["organizationName"],
            organization_type_id: element["organizationType"],
            addresses_attributes: [{
              country_id: element["organizationCountry"],
              latitude: element["organizationLatitude"],
              longitude: element["organizationLongitude"],
              primary: true
            }]
          };
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
            if(lead == "lead-"+id){
              obj.membership_type = "main";
            }
            else{
              obj.membership_type = "secondary";
            }

            // NEW INVESTIGATOR RELATIONSHIP
            if(isNaN(parseInt(investigator))){
              if(investigator.investigatorUser){
                investigator.investigatorUser = window.USER_ID;
              }
              else{
                investigator.investigatorUser = undefined;
              }
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
                address_attributes: {
                  country_id: organization.organizationCountry,
                  city: organization.organizationCity,
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
                  user_id: investigator.investigatorUser,
                  name: investigator.investigatorName,
                  email: investigator.investigatorEmail,
                  website: investigator.investigatorWebsite
                }
              };
            } // NN
            else{
              obj.research_unit_attributes = {
                investigator_attributes: {
                  user_id: investigator.investigatorUser,
                  name: investigator.investigatorName,
                  email: investigator.investigatorEmail,
                  website: investigator.investigatorWebsite,
                  addresses_attributes: [
                    {
                      country_id: organization.organizationCountry,
                      city: organization.organizationCity,
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
        if (child.fetchData) {
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

  // Create
  App.Presenter.CreateProjectForm = function() {
    this.initialize.apply(this, arguments);
  };
  _.extend(App.Presenter.CreateProjectForm.prototype, App.Presenter.ProjectForm.prototype);

  // Edit
  App.Presenter.EditProjectForm = function() {
    this.initialize.apply(this, arguments);
    this.getProject.apply(this, arguments);
  };

  _.extend(App.Presenter.EditProjectForm.prototype, App.Presenter.ProjectForm.prototype);
  _.extend(App.Presenter.EditProjectForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      this.titleInput = new App.Presenter.Input();
      this.descTextarea = new App.Presenter.Textarea();
      this.startPickadate = new App.Presenter.PickadateStart({
        label: null,
      });
      this.endPickadate = new App.Presenter.PickadateEnd({
        label: null,
      });
      this.websiteInput = new App.Presenter.WebsiteInput();
      this.projectTypes = new App.Presenter.ProjectTypes({
        label: null,
        addNew: false
      });
      this.cancerTypes = new App.Presenter.CancerTypes({
        label: null,
        addNew: false
      });
      this.specialities = new App.Presenter.Specialities({
        label: null,
        addNew: false
      });
      this.fundingSources = new App.Presenter.FundingSources({
        label: null,
        addNew: true
      });
      this.policy = new App.Presenter.Policy();
      this.messagesList = new App.Presenter.MessagesList();

      this.investigatorOrganization = new App.Presenter.InvestigatorOrganization();
      this.investigatorOrganizationEdit = new App.Presenter.InvestigatorOrganizationEdit();

      this.fundingSourcesForm = new App.Presenter.FundingSourcesForm();

      this.children = [this.titleInput, this.descTextarea, this.startPickadate,
         this.endPickadate, this.websiteInput, this.projectTypes, this.cancerTypes, this.specialities,
         this.fundingSources, this.policy, this.messagesList, this.investigatorOrganization,
         this.investigatorOrganizationEdit];

      this.projectForm = new App.View.ProjectForm({
        children: this.children,
        el: '#project_form'
      });

      this.request = {};
      this.setEvents();
      this.setSubscriptions();

      this.project = this.getProject(params);
      this.project.then(function(response){
        this.project = JSON.parse(response);
        this.renderForm();
      }.bind(this)).catch(function(response){
        var messages = JSON.parse(response).message;
        App.trigger("ProjectForm:errors", messages);
      });

    },

    getProject: function(params){
      this.projectId = params.vars[1];
      return new Promise(function(resolve, reject){
        var url = "/api/projects/"+this.projectId+"?token="+window.AUTH_TOKEN;
        var q = new XMLHttpRequest();
        q.open('GET', url, true);
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
        q.send();
      }.bind(this));
    },

    loadData: function(){
      this.titleInput.setValue(this.project.title);
      this.descTextarea.setValue(this.project.summary);
      this.startPickadate.setValue(this.project.start_date);
      this.endPickadate.setValue(this.project.end_date);
      this.websiteInput.setValue(this.project.project_website);
      this.projectTypes.setFetchedValues(this.project.project_types);
      this.cancerTypes.setFetchedValues(this.project.cancer_types);
      this.specialities.setFetchedValues(this.project.specialities);
      this.fundingSources.setFetchedValues(this.project.funding_sources);
      this.investigatorOrganizationEdit.setValue(this.project.memberships);
    },

    buildInvestigatorsEdit: function(){
      if(!this.investigatorOrganizationEdit.elements && !this.project.memberships){
        return false;
      }
      if(!this.request.project.memberships){
        this.request.project["memberships"] = [];
      }
      _.each(this.project.memberships, function(membership){
        var membership_req;
        _.each(this.investigatorOrganizationEdit.elements, function(element){
          var investigator = this.state.attributes["investigatoredit-"+element.id];
          var organization = this.state.attributes["organizationedit-"+element.id];
          var lead = this.state.attributes["lead"];
          var membershipId;
          var membership_type = "secondary";
          if(investigator == membership.investigator.name && organization == membership.organization.name){
            membershipId = membership.id;
          }
          if(lead === "leadedit-"+element.id){
            membership_type = "main";
          }
          if(membershipId){
            membership_req = {
              id: membershipId,
              membership_type: membership_type
            };
          }
        }, this);

        if(!membership_req){
          membership_req = {
            id: membership.id,
            _destroy: true
          };
        }
        this.request.project.memberships.push(membership_req);
      }, this);
    },

    buildRequest: function(){
      this.request.project = {
        title: this.state.attributes["title"],
        summary: this.state.attributes["summary"],
        start_date: this.state.attributes["start_date"],
        end_date: this.state.attributes["end_date"],
        project_website: this.state.attributes["project_website"],
        project_type_ids: this.state.attributes["project_types[]"],
        cancer_type_ids: this.state.attributes["cancer_types[]"],
        speciality_ids: this.state.attributes["specialities[]"]
      };
      this.buildFundingSources();
      this.buildInvestigators();
      this.buildInvestigatorsEdit();
    },

    handleSubmit: function() {
      this.buildRequest();
      new Promise(function(resolve, reject){
        var url = "/api/projects/"+this.projectId+"?token="+window.AUTH_TOKEN;
        var q = new XMLHttpRequest();
        q.open('PATCH', url, true);
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
        var pSlug = JSON.parse(response).slug;
        window.location.href = "/projects/"+pSlug;
      }.bind(this)).catch(function(response){
        var messages = JSON.parse(response).message;
        App.trigger("ProjectForm:errors", messages);
      });
    },

    renderFormElements: function() {
      this.projectForm.render();
      _.each(this.children, function(child){

        // Render the child
        child.render();
      }.bind(this));
      this.loadData();
    }

  });


})(this.App);
