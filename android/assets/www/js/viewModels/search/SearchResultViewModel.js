/**
 * This module creates SearchResultViewModel class.
 * 
 * SearchResultViewModel provides the functionalities required for the
 * Search-Result templates.
 */
define([ 'ojs/ojcore', 'knockout', 'jquery', './ojSearch', 'ojs/ojlistview' ],

function(oj, ko, $, ojSearch) {

  /**
   * Creates the SearchResultViewModel object.
   * 
   * @param options :
   *          Options for SearchResultViewModel.
   *          'searchModel' has to be passed in options.
   */
  var SearchResultViewModel = function(options) {
    var self = this;

    self.searchModel = options.searchModel;
    delete options["searchModel"];

    /**
     * SearchResultViewModel options which needs to be configured by user.
     */
    self.options = {
      /**
       * Result header template name for list-view layout.
       */
      listViewResultHeaderTemplate : null,

      /**
       * Result header template name for grid-view layout.
       */
      gridViewResultHeaderTemplate : null,

      /**
       * Result item template name. This will be used to render each result item
       * in list-view layout.
       */
      listViewResultItemTemplate : null,

      /**
       * Result item template name. This will be used to render each result item
       * in grid-view layout.
       */
      gridViewResultItemTemplate : null,

      /**
       * Limit of filter items for each filter type. These many filter items
       * will be shown for each filter type in UI.
       */
      limitPerFilterType : 4,

      /**
       * User needs to define this if category based search operation is
       * required.
       * 
       * Data structure is: [{id: <categoryId>, name: <categoryName>}, ...]
       * 
       * If this field is defined by user then by default 'All' category will be
       * added by SearchViewModel to indicate the full search.
       */
      resultCategories : null,

      /**
       * Event handler function for select result item.
       */
      selectResultItem : function(selectedItem) {

      }
    };

    // Initializing the options provided by user.
    self._initOptions = function(options) {
      $.each(options, function(key, value) {
        self.options[key] = value;
      });

      if (self.options.resultCategories) {
        self.options.resultCategories.unshift({
          id : "all",
          name : "All"
        });
      }
    };
    self._initOptions(options);

    // This subscription is to reset the SearchResultViewModel on new search
    // results.
    self.searchModel.resultDataSource.subscribe(function(resultDataSource) {

      if (self.searchModel.searchOptions) {
        var filterByCategory = self.searchModel.searchOptions.filterByCategory
            || "all";
        self.searchCategory([ filterByCategory ]);
        self.appliedFilters(self.searchModel.searchOptions.appliedFilters);
        self.sortCriteria(self.searchModel.searchOptions.sortCriteria);
      }

      self.activeShowMoreFilterType(null);

      if (resultDataSource) {
        setTimeout(function() {
          $("#" + self.uniqueId('resultsAlert')).text(
              "Showing " + self.searchModel.totalResults() + " search results.");
        }, 5);
      }
    });

    // This subscription will update the filtersStatus map based on
    // availableFilters in SearchModel.
    self.searchModel.availableFilters.subscribe(function(availableFilters) {
      if (availableFilters === null) {
        self.filtersStatus({});
        return;
      }

      var buildAppliedFiltersMap = function() {
        var appliedFiltersMap = {};
        var appliedFilters = self.searchModel.searchOptions.appliedFilters;
        for (i in appliedFilters) {
          var filter = appliedFilters[i];
          appliedFiltersMap[filter.filterId] = filter.options;
        }

        return appliedFiltersMap;
      };

      var appliedFiltersMap = buildAppliedFiltersMap();
      var filtersStatus = {};

      $.each(availableFilters, function(filterId, filter) {

        var selectedFilterIOptions = appliedFiltersMap[filterId] || [];
        filtersStatus[filterId] = ko.observableArray(selectedFilterIOptions);
      });

      self.filtersStatus(filtersStatus);
    });

    /**
     * Generates the unique Id for UI elements in result template.
     */
    self.uniqueId = ojSearch.Utils.generateId();

    /**
     * Current result layout. This will be bound to the result layout button-set
     * in result template.
     */
    self.resultLayout = ko.observable("listView");


    // This subscription will refresh the result collection,
    // so that ListView will be rendered again with new layout.
    self.resultLayout.subscribe(function() {
      self.searchModel.searchResultCollection.refresh();
    });

    /**
     * Returns the result header template based on the current resultLayout.
     */
    self.resultHeaderTemplate = ko.computed(function() {
      if (self.resultLayout() === "listView") {
        return self.options.listViewResultHeaderTemplate;
      } else {
        return self.options.gridViewResultHeaderTemplate;
      }
    });

    /**
     * Returns the result item template based on the current resultLayout.
     */
    self.resultItemTemplate = ko.computed(function() {
      if (self.resultLayout() === "listView") {
        return self.options.listViewResultItemTemplate;
      } else {
        return self.options.gridViewResultItemTemplate;
      }
    });

    /**
     * Indicates whether filter options are currently visible or not. This will
     * be bound to 'Show Filters' toggle button in result template.
     */
    self.isFilterPaneVisible = ko.observableArray([]);

    /**
     * Contains the filter type id for which currently more filter options are
     * shown.
     */
    self.activeShowMoreFilterType = ko.observable(null);

    /**
     * Map of filters' status, this will be used to bind the filters checkbox in
     * result template.
     * 
     * Data structure for each item is:
     * 
     * {filterId: [Array of selected filter items]}
     */
    self.filtersStatus = ko.observable({});

    /**
     * List of applied filters.
     */
    self.appliedFilters = ko.observable([]);

    /**
     * Returns the string representation of currently applied filters.
     */
    self.appliedFiltersText = ko.computed(function() {
      if (self.appliedFilters().length === 0) {
        return "";
      }

      var availableFilters = self.searchModel.availableFilters();
      var appliedFilters = self.appliedFilters();

      var filtersText = "Filters: ( ";
      $.each(appliedFilters, function(filterIdx, filter) {
        filtersText += availableFilters[filter.filterId].filterName + ": ";
        $.each(filter.options, function(optionsIdx, option) {
          filtersText += option;
          if (optionsIdx !== filter.options.length - 1)
            filtersText += ", ";
        });
        if (filterIdx !== appliedFilters.length - 1)
          filtersText += "; ";
      });
      filtersText += " )";

      return filtersText;
    });

    /**
     * visibleFilters is the computed observable. It will return the list of
     * filters which should be visible in the UI.
     */
    self.visibleFilters = ko.computed(function() {

      var availableFilters = self.searchModel.availableFilters();
      if (!availableFilters) {
        return null;
      }

      // If selected any particular filter type to show more items in that type
      // then only all available options for that filter type will be returned.
      if (self.activeShowMoreFilterType()) {
        var filter = availableFilters[self.activeShowMoreFilterType()];
        filter.totalNoOfFilterItems = filter.filterItems.length;
        return [ filter ];
      }

      // If not selected any particular filter type to show more items then as
      // per the "limitPerFilterType" config filter options will be returned for
      // each filter type.
      var visibleFilters = [];
      $.each(availableFilters, function(filterId, filter) {
        var visibleFilterItems = [];
        for (var i = 0; i < self.options.limitPerFilterType
            && i < filter.filterItems.length; i++) {
          visibleFilterItems[i] = filter.filterItems[i];
        }

        if (visibleFilterItems) {
          var visibleFilter = {
            filterId : filterId,
            filterName : filter.filterName,
            filterItems : visibleFilterItems,
            totalNoOfFilterItems : filter.filterItems.length
          };
          visibleFilters.push(visibleFilter);
        }
      });

      return visibleFilters;
    });

    /**
     * Shows more filter options for a particular filter type. Updates the
     * "activeShowMoreFilterType" so that "visibleFilters" computed observable
     * will return all filter options for a particular filter type.
     */
    self.showMoreFilters = function(filterType) {
      self.activeShowMoreFilterType(filterType.filterId);
    };

    /**
     * Resets the "activeShowMoreFilterType".
     */
    self.showLessFilters = function(filterType) {
      self.activeShowMoreFilterType(null);
    };

    /**
     * Flag indicating that currently all filters are getting cleared. This will
     * be used to avoid firing multiple filter result request.
     */
    self._clearingAllFilters = false;

    /**
     * Clears all applied filters on search result.
     */
    self.clearAllFilters = function(searchViewModel) {
      if (!self.appliedFilters().length)
        return;

      self._clearingAllFilters = true;

      $.each(self.filtersStatus(), function(filterId, filterOptions) {
        filterOptions.removeAll();
      });

      self.appliedFilters([]);
      self.searchModel.applyFilters([]);
      self._clearingAllFilters = false;
    };

    /**
     * Applies the selected filters on search result.
     */
    self.applyFilters = function(event, data) {
      if (data.option !== "value" || self._clearingAllFilters)
        return;

      var changeInAppliedFilters = false;

      var filterId = $(event.target).attr("data-filterId");
      var appliedFilters = self.appliedFilters();

      if (appliedFilters.length === 0 && data.value.length > 0) {
        appliedFilters.push({
          filterId : filterId,
          options : data.value
        });
        changeInAppliedFilters = true;
      } else {
        var filter = null;
        var filterIndex = -1;
        for (var i = 0; i < appliedFilters.length; i++) {
          if (appliedFilters[i].filterId === filterId) {
            filter = appliedFilters[i];
            filterIndex = i;
            break;
          }
        }

        if (data.value.length === 0 && filterIndex >= 0) {
          appliedFilters.splice(filterIndex, 1);
          changeInAppliedFilters = true;
        } else {
          if (filter) {
            filter.options = data.value;
            changeInAppliedFilters = true;
          } else if (data.value.length > 0) {
            appliedFilters.push({
              filterId : filterId,
              options : data.value
            });
            changeInAppliedFilters = true;
          }
        }
      }

      if (changeInAppliedFilters)
        self.searchModel.applyFilters(appliedFilters);
    };

    /**
     * List of sort criteria. Data structure for each item is: { columnIndex :
     * <columnIndex>, sortOrder : <sortOrder> }
     */
    self.sortCriteria = ko.observableArray([]);

    /**
     * Sorts the search result.
     */
    self.sortSearchResult = function(columnIndex) {
      return function() {
        var curSortOrder = self.getSortOrderForColumn(columnIndex);
        if (curSortOrder) {
          self.sortCriteria.remove(curSortOrder);
        }

        var nextSortOrder = null;
        if (!curSortOrder) {
          nextSortOrder = "desc";
        } else if (curSortOrder.sortOrder === "desc") {
          nextSortOrder = "asc";
        }
        if (nextSortOrder) {
          self.sortCriteria.push({
            columnIndex : columnIndex,
            sortOrder : nextSortOrder
          });
        }

        self.searchModel.sortSearchResult(self.sortCriteria());
      };
    };

    /**
     * Returns the current sort order for the column.
     */
    self.getSortOrderForColumn = function(columnIndex) {
      return ko.utils.arrayFirst(self.sortCriteria(), function(item) {
        return item.columnIndex === columnIndex;
      });
    };

    /**
     * Current result category. This will be bound to result category combobox
     * in result template.
     */
    self.searchCategory = ko.observableArray([ "all" ]);

    /**
     * Filters the results based on selected category.
     */
    self.filterByCategory = function(event, data) {
      if (data.option !== "value")
        return;

      var filterByCategory = self.searchModel.searchOptions.filterByCategory
          || "all";
      if (filterByCategory === data.value[0]) {
        // Current results already filtered by this category.
        return;
      }

      self.searchModel.filterByCategory(data.value[0]);
    };

    /**
     * Handler function for result item selection event.
     */
    self.selectResultItemHandler = function(event, data) {
      if (data.option === "selection" && data.value.length) {
        return self.options.selectResultItem(data.value[0]);
      }
    };
  };

  return SearchResultViewModel;
});