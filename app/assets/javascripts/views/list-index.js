(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.List = Backbone.View.extend({

    el: '#collection-list',

    defaults: {},

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings ? settings : {};
      this.options = _.extend({}, this.defaults, opts);
      this.list = settings.list;
      this.template = settings.template;
      this.twoLevels = settings.twoLevels;
      this.itemCategory = settings.itemCategory
      if (settings.secondLevelName) this.secondLevelName = settings.secondLevelName;

      this.setList();
    },

    setList: function() {
      this.list.fetch().done(function(data) {
        this.data = data;
        /* Set to re-use it on cancer-type section of one-level data (array of objects) */
        this.twoLevels ? this.drawList(this.twoLevels) : this.drawList(this.twoLevels, this.data);
        this.searchListener();
      }.bind(this));
    },

    drawList: function(isTwolevels, secondList) {
      let collectionList = [];

      if (isTwolevels) {
        collectionList = this.data;
        this.el.innerHTML = '';
      } else {
        /* Creates a new object to contain the array of objects needed to set the handlebars template */
        collectionList = [{
          name: ''
        }];
        collectionList[0][this.secondLevelName] = secondList;
      }

      collectionList.map(function(firstLevelItem) {
        const html = this.template(firstLevelItem);
        /* Whether it has to add a new element or start from emptiness */
        isTwolevels ? this.el.innerHTML += html : this.el.innerHTML = html;
      }.bind(this));
    },

    searchListener: function() {
      const search = $('#search');
      const options = {
        caseSensitive: false,
        includeScore: false,
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 0,
        keys: [this.itemCategory]
      };
      const firstLevelList = this.data;
      const self = this;

      /* Selects all text when focus on the input */
      search.on('focus', function() {
        this.setSelectionRange(0, this.value.length);
      });

      search.on('keyup', function() {
        const token = this.value;
        let result = [];

        if (token !== '') {
          firstLevelList.map(function(firstLevelItem) {
            const elements = firstLevelItem[self.secondLevelName];
            const fuse = new Fuse(elements, options);
            result = result.concat(fuse.search(token));
          }.bind(this));

          self.drawList(false, result);
          $('.single-list-title').hide();

        } else {
          self.drawList(true);
          $('.single-list-title').show();
        }
      });
    }

  });

})(this.App);
