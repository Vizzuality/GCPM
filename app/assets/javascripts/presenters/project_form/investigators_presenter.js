(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Investigators = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Investigators.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.investigators = new App.Collection.Investigators();
      this.investigators.url = '/api/investigators?token=' + AUTH_TOKEN;
      this.investigatorsId = 0;

      this.cache();
      this.initializeComponents();
      this.render();
      this.setSubscriptions();
    },

    cache: function() {
      this.$container = $('.investigators-organizations');
      this.$investAdded = $('.investigators-added');
    },

    initializeComponents: function() {
      this.investigatorsSelect = new App.View.Select({
        el: '#investigators',
        options: {
          name: 'investigators',
          type: 'text',
          label: 'Investigators',
          inputClass: 'c-section-title -one-line',
          placeholder: 'Investigators'
        }
      });

      this.organizationsSelect = new App.View.Select({
        el: '#organizations',
        options: {
          name: 'organizations_ids',
          type: 'text',
          label: 'Organizations',
          inputClass: 'c-section-title -one-line',
          placeholder: 'Select or add a new one'
        }
      });

      this.addressesSelect = new App.View.Select({
        el: '#addresses',
        options: {
          name: 'address_id',
          type: 'text',
          label: 'Address',
          inputClass: 'c-section-title -one-line',
          placeholder: 'Select location'
        }
      });

      this.leadInput = new App.View.Input({
        el: '#lead',
        options: {
          name: 'lead',
          type: 'checkbox',
          label: 'Lead',
          inputClass: 'c-section-title -one-line'
        }
      });

      this.addMore = this.$container.append(
        '<button class="c-button -color-3 js-add-more">Add more</button>'
      );
    },

    render: function() {
      this.investigators
        .fetch()
        .done(function() {
          var options = this.investigators.toJSON().map(function(type) {
            return { name: type.name, value: type.id };
          });
          this.investigatorsSelect.renderOptions(options);

          if (options.length !== 0) {
            this.renderOrganizations(options[0].value);
          }
        }.bind(this));
    },

    renderOrganizations: function(investigatorId) {
      $.ajax({
        url: '/api/investigators/' + investigatorId + '?token=' + AUTH_TOKEN,
        method: 'GET',
        success: function(data) {
          var organizations = data.organizations.map(function(organization) {
            return {
              name: organization.name,
              value: organization.id
            };
          }.bind(this));
          this.organizationsSelect.renderOptions(organizations, true);
          data.organizations.length !== 0 &&
            this.renderAddresses(organizations[0].value);
        }.bind(this)
      });
    },

    renderAddresses: function(organizationId) {
      var required = this.organizationsSelect.$el.find('.c-required');
      required && required.addClass('-hidden');

      $.ajax({
        url: '/api/organizations/' + organizationId,
        method: 'GET',
        success: function(data) {
          var addresses = data.addresses.map(function(address) {
            return {
              name: address.city + ', ' + address.country_name,
              value: address.id
            };
          }.bind(this));
          this.addressesSelect.renderOptions(addresses);
        }.bind(this)
      });
    },

    // Subscribe the presenter to its elements events
    setSubscriptions: function() {
      this.investigatorsSelect.on('change', function(investigatorsSelect){
        var investId = investigatorsSelect.$el.find(':selected')[0].value;
        this.renderOrganizations(investId);
      }.bind(this));

      this.organizationsSelect.on('change', function(organizationsSelect){
        var organizId = organizationsSelect.$el.find(':selected')[0].value;
        this.renderAddresses(organizId);
      }.bind(this));

      this.$container.find('.js-add-more')
        .on('click', this.handleAddMore.bind(this));

      this.$container.find('.delete').on('click', this.handleDeleteInvestigator);
    },

    setDeleteSubscription: function() {
      this.$container.find('.delete').on('click', this.handleDeleteInvestigator.bind(this));
    },

    handleDeleteInvestigator: function(ev) {
      var investigators = {};
      var oldInvestigators = this.state.get('investigators');
      var value = $(ev.target).attr('value');

      Object.keys(oldInvestigators).map(function(id) {
        if (id !== value) {
          investigators[id] = oldInvestigators[id];
        }
      }.bind(this));

      // Remove from state
      this.state.set({investigators: investigators});
      App.trigger('InvestigatorsSelect:change', this);

      // Remove from table
      this.$investAdded.find('tr[value='+ value +']').remove();
    },

    addInvestigatorRow: function() {
      var investigators = this.state.get('investigators') || {};
      var investigator = this.investigatorsSelect.$el.find('select');
      var organization = this.organizationsSelect.$el.find('select');
      var address = this.addressesSelect.$el.find('select');
      var lead = this.leadInput.$el.find('input')[0];

      investigators[this.investigatorsId] = {
        investigator_id: investigator[0].value,
        organization_id: organization[0].value,
        address_id: address[0].value,
        lead: lead.checked
      };

      this.state.set({investigators: investigators});
      App.trigger('InvestigatorsSelect:change', this);

      this.$investAdded.append(
        '<tr value="' + this.investigatorsId + '"><td value="' +
          investigator.find(':selected').val() + '">' +
            investigator.find(':selected').text() + '</td><td value="' +
          organization.find(':selected').val() + '">' +
            organization.find(':selected').text() + '</td><td>' +
          (lead.checked ? 'Lead' : "") + '</td><td value="' +
            this.investigatorsId + '" class="delete">Delete</td></tr>'
      );

      this.setDeleteSubscription();
      this.investigatorsId ++;
    },

    handleAddMore: function() {
      var organizations = this.organizationsSelect.$el;

      if (Number(organizations.find('select :selected')[0].value) < 0) {
        var required = organizations.find('.c-required');
        required && required.removeClass('-hidden');
      } else this.addInvestigatorRow();
    }

    // setSelectMultipleValues: function(select) {
    //   var values = [];
    //   var options = select.$el.find('select :selected');

    //   options.map(function(index, option) {
    //     values.push(Number(option.value));
    //   }.bind(this));

    //   if (values) {
    //     var obj = {};
    //     obj[select.options.name] = values;

    //     this.state.set(obj);
    //     App.trigger('InvestigatorsSelect:change', this);
    //   }
    // }

  });

})(this.App);
