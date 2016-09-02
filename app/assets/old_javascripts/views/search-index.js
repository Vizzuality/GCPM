(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.SearchList = Backbone.View.extend({

    el: '.search-container',

    events: {
      'click .js-search-list': 'selectFullInputContent',
      'keyup .js-search-list': 'setNewSearchList'
    },

    defaults: {
      fuseOptions: {
        caseSensitive: false,
        includeScore: false,
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 0,
        keys: ['name']
      }
    },

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.options ? settings.options : {};
      if (settings.options.itemSearchedCategory) this.defaults.fuseOptions['keys'] = [settings.options.itemSearchedCategory];
      this.options = _.extend({}, this.defaults, opts);

      this.searchList = settings.searchList;

      this.listeners();
    },

    listeners: function() {
      this.searchList.on('sync reset change', this.setSearchList.bind(this));
    },

    setSearchList: function() {
      var isTwoLevels = this.options.isTwoLevels;
      /* Set to re-use it on cancer-type section of one-level data (array of objects) */
      isTwoLevels ? this.drawSearchList(isTwoLevels) : this.drawSearchList(isTwoLevels, this.searchList.toJSON());
    },

    drawSearchList: function(isTwolevels, innerSearchList) {
      var searchShowList = [];
      var innerSearchListName = this.options.innerSearchListName;

      if (isTwolevels) {
        searchShowList = this.searchList.toJSON();
        $('#search-list', this.el).html('');
      } else {
        /* Creates a new object to contain the array of objects needed to set the handlebars template */
        searchShowList = [{
          name: ''
        }];
        searchShowList[0][innerSearchListName] = innerSearchList;
      }

      searchShowList.map(function(externalListItem) {
        var html = this.options.template(externalListItem);
        /* Whether it has to add a new element or start from emptiness */
        isTwolevels ? $('#search-list', this.el).append(html) : $('#search-list', this.el).html(html);
      }.bind(this));
    },

    /* Click event function */
    selectFullInputContent: function(e) {
      e.target.setSelectionRange(0, e.target.value.length);
    },

    /* Keyup event function */
    setNewSearchList: function(e) {
      var search = $('#search-input');
      var externalSearchList = this.searchList.toJSON();
      var token = e.target.value;
      var result = [];

      if (token !== '') {
        externalSearchList.map(function(externalListItem) {
          var innerSearchList = externalListItem[this.options.innerSearchListName];
          var fuse = new Fuse(innerSearchList, this.options.fuseOptions);
          result = result.concat(fuse.search(token));
        }.bind(this));

        this.drawSearchList(false, result);
        $('.single-list-title').hide();

      } else {
        this.drawSearchList(true);
        $('.single-list-title').show();
      }
    }

  });

})(this.App);
