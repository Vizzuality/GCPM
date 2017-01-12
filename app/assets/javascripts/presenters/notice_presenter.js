(function(App) {

  'use strict';

  App.Presenter.Notice = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Notice.prototype, {

    initialize: function() {
      console.log(gon);
      if(gon.notice && gon.notice.show) {
        this.modal = new App.View.Modal({
          className: '-tiny'
        });
        this.openNotice();
      }
    },

    openNotice: function() {
      this.modal.open(gon.notice.text);
    }

  });

})(this.App);
