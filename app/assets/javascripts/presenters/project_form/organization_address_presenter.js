(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationAddress = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationAddress.prototype, {

    defaults: {
      multiple: false,
      name: 'address',
      label: 'Address',
      placeholder: 'Select location',
      blank: null,
      addNew: false,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.selector = viewSettings.DOMelement;

      // Creating view
      this.select = new App.View.Select({
        el: viewSettings.DOMelement,
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('OrganizationAddress:change', this.state.attributes);
      }, this);
    },

    setSubscriptions: function(){
      App.on('Organization:#organization-'+this.selector.split("-")[1], function(data){
        if(data.value.length > 0){
          var organizationId = data.value[0];
          var p = new Promise(function(resolve, reject){
            var url = "/api/organizations/"+organizationId;
            var q = new XMLHttpRequest();
            q.open('GET', url, true);
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
            q.send();
          }).then(function(response){
            var response = JSON.parse(response);
            var addresses = response.addresses;
            var options = addresses.map(function(address) {
               return {
                 name: address.line_1+" "+address.city+", "+address.country_name,
                 value: address.id
               };
             });
             if(options.length > 0){
               this.select.setOptions(options);
               this.select.render();
             }
          }.bind(this)).catch(function(response){
            throw Error(response);
          });
        }
      }, this);
    },


    render: function() {
      this.select.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);
