(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Textarea = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Textarea.prototype, {

    defaults: {
      name: 'summary'
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.Textarea = new App.View.Textarea({
        el: '#description',
        options: {
          value: null,
          label: false,
          required: true,
          class: 'c-textarea',
          name: 'summary',
          type: 'textarea',
          lableClass: 'c-section-title',
          placeholder: "Cancer is the second leading cause of deaths globally with 70% of all cancer deaths occurring in developing countries. Morocco's cancer burden is increasing and therefore, the country has prioritized cancer prevention and control as part of its health strategy. To achieve the goal of reducing the national cancer burden Morocco is strengthening its two population based cancer registries, has opened new cancer treatment hospitals in underserved regions and a breast cancer and cervical cancer screening facility in its capital. \
                        Finally, Morocco has allocated funding for cancer research. However much remains to be done including documenting the cancer distribution and the factors associated with cancer, as well as treatment outcomes to inform cancer prevention and treatment guidelines nationally. \
                        Currently, Morocco does not have a cadre of experts with advanced public health degrees or formal training in cancer research. Recognizing this limitation Morocco has expressed the interest in developing research training programs. The aim of this grant is to train a cadre of cancer research experts nationally through mixed methods of in-country training, online certificates and MSPH degrees at USF. In addition, the grant will leave behind a cancer epidemiology certificate developed for Morocco. \
                        To achieve these goals, we formed a partnership between the Moffitt Cancer Center & Research Institute which has a strong portfolio in cancer prevention and control research, the University of South Florida (USF) which can provide formal training in cancer epidemiology and public health, the National Institutes of Health in Morocco (NIHM), a public health institution in charge of supporting its own and the country's cancer research capacity, and the National Health Administration in charge of developing novel graduate training programs that address the nation's needs. Furthermore, NIHM has outreached to several institutions within Morocco including the colleges of medicine and Pharmacy at the University Casablanca, Fez, Rabat and Marrakesh and funding agencies such as Lalla Salma, the National Center for Research and Technology (CNRST) and Hassan II Academy of Science and technology. This grant comes at an exciting and pivotal time in our cancer research collaboration efforts with Morocco."
        }
      });

      this.setEvents();
    },

    setEvents: function(){
      this.state.on('change', function(){
        App.trigger('Textarea:change', this.state.attributes);
      }, this);

      this.Textarea.on('change', this.setState, this);
    },

    render: function(){
      this.Textarea.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.Textarea.setElement(el);
    },

    getElement: function() {
      return this.Textarea.$el;
    }

  });

})(this.App);
