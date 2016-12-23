(function(App) {

  'use strict';

  App.Controller.Home = function() {};

  _.extend(App.Controller.Home.prototype, {

    index: function(params) {
      new App.Presenter.Map(params, {
        noInteractivity: true,
        noAnimateBounds: true,
        disable: true
      }, {
        zoom: 3,
        center: [25, -15],
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        trackResize: false,
        closePopupOnClick: false
      });

      new App.Presenter.WidgetsFeatured(params);
      new App.Presenter.Notice();

      gon.isMobile && new App.Presenter.JoinNetworkMobile();
    }



  });

})(this.App);
