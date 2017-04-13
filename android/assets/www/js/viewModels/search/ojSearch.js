/**
 * This module creates SearchModel class.
 * 
 * SearchModel provides the all search functionalities such as basic search,
 * filtering and sorting search results.
 */
define(
    [ 'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojmodel',
        'ojs/ojknockout-model', 'ojs/ojtable-model', 'ojs/ojpagingcontrol-model',
        'ojs/ojpagingcontrol' ],

    function(oj, ko, $) {
      var ojSearch = {};

      /**
       * Creates the SearchModel object.
       * 
       * @param options :
       *          Options for SearchModel.
       */
      ojSearch.SearchModel = function(options) {
        var self = this;

        /**
         * SearchModel options which user needs to configure.
         */
        self.options = {
          /**
           * REST service URL for search results.
           */
          searchURL : null,

          /**
           * Result items per page.
           */
          resultPageSize : 25,
          
          /**
           * Unique ID for the collection model.
           */
          modelId: "id",

          /**
           * Search Id which will be used to save the searches in client
           * localStorage
           */
          searchId : "",

          /**
           * Number of recent searches to be saved. If configured with positive
           * value those many recent searches will be stored in client
           * "localStorage".
           */
          maxRecentSearches : 0,

          /**
           * A callback for users to build the search service URLs. The callback
           * should accept these parameters:
           * 
           * @param collection :
           *          oj.Collection object used to fire the search request.
           * @param collectionOptions :
           *          Options provided by the oj.Collection for customURL
           *          callback
           * @param searchOptions :
           *          Any of the following properties:
           * 
           * searchCriteria : Search keyword string or Map of {queryField-value}
           * 
           * newSearch : true/false. Indicates whether new search or just
           * pagination request.
           * 
           * appliedFilters : Applied filters array.
           * 
           * sortCriteria : Sorting order.
           * 
           * filterByCategory: Category ID for which result has to be filtered.
           */
          buildSearchURL : function(collection, collectionOptions,
              searchOptions) {

          },

          /**
           * A callback for users to provide the paging options. The callback
           * should accept these parameters:
           * 
           * @param response :
           *          The response coming back from the search call.
           */
          resultPagingOptions : function(response) {

          },

          /**
           * A callback for users to parse the result data.
           * 
           * User needs to return the data in this format: {resultItems : [],
           * availableFilters: []}
           * 
           * The callback should accept these parameters:
           * 
           * @param response :
           *          The response coming back from the search call.
           */
          parseResultData : function(response) {

          },

          /**
           * A callback for before performing the search operation.
           */
          beforeSearch : function(searchOptions) {

          }
        };

        self.savedSearches = ko.observableArray([]);
        self.recentSearches = ko.observableArray([]);

        // Initializing the options provided by user.
        self._initOptions = function(options) {
          $.each(options, function(key, value) {
            self.options[key] = value;
          });
        };
        self._initOptions(options);

        /**
         * Indicates currently searching is happening or not.
         */
        self.searching = ko.observable(null);
        
        /**
         * Hold the current search options.
         */
        self.searchOptions = null;

        /**
         * Result data source. This will hold the reference to
         * oj.PagingTableDataSource created on every new search.
         */
        self.resultDataSource = ko.observable(null);

        /**
         * Total result count for the current search.
         */
        self.totalResults = ko.observable(0);

        /**
         * Available filters for the current search result.
         */
        self.availableFilters = ko.observable(null);

        // Builds the oj.Collection object for the search.
        self._buildSearchResultCollection = function() {
          var searchResultModelOpt = {
            urlRoot : self.options.searchURL,
            idAttribute: self.options.modelId
          };

          self.SearchResultModel = oj.Model.extend(searchResultModelOpt);
          self.searchResultModel = new self.SearchResultModel();

          self.SearchResultCollection = oj.Collection.extend({
            url : self.options.searchURL,
            model : self.searchResultModel,
            fetchSize : self.options.resultPageSize,
            customURL : function(operation, collection, options) {
              return self.options.buildSearchURL(collection, options,
                  self.searchOptions);
            },
            customPagingOptions : function(response) {
              return self.options.resultPagingOptions(response);
            },
            parse : function(response) {

              // newSearch flag is set false so that next request on same data
              // source will not fetch filters details
              self.searchOptions.newSearch = false;

              var searchResult = self.options.parseResultData(response);

              if (searchResult.availableFilters) {
                self.availableFilters(searchResult.availableFilters);
              }

              return searchResult.resultItems;
            }
          });

          self.searchResultCollection = new self.SearchResultCollection();
        };
        self._buildSearchResultCollection();

        /**
         * Resets this SearchModel
         */
        self._resetPreviousSearchData = function() {
          self.searchOptions = null;
          self.resultDataSource(null);
          self.availableFilters(null);
          self.totalResults(0);
        };

        /**
         * Updates the search options with default values for options which are
         * not currently set.
         * 
         * @param searchOptions :
         *          For which search options needs to be updated.
         * 
         * @return {Object} : Returns updated searchOptions.
         */
        self._updateSearchOptions = function(searchOptions) {
          searchOptions.appliedFilters = searchOptions.appliedFilters || [];
          searchOptions.sortCriteria = searchOptions.sortCriteria || [];
          searchOptions.newSearch = true;

          return searchOptions;
        };

        /**
         * Called before performing the search.
         */
        self._beforeSearch = function(searchOptions) {
          if (self.options.beforeSearch) {
            self.options.beforeSearch(searchOptions);
          }
        };

        /**
         * Checks whether search criteria is empty or not.
         * 
         * @param searchOptions :
         *          For which empty check needs to be done.
         * @return {Boolean} : Returns true if search criteria is empty.
         */
        self.isSearchCriteriaEmpty = function(searchOptions) {
          if (!searchOptions || !searchOptions.searchCriteria) {
            return true;
          }

          var isSearchCriteriaEmpty = true;
          var searchCriteria = searchOptions.searchCriteria;

          if (typeof searchCriteria === "string") {
            isSearchCriteriaEmpty = searchCriteria.trim().length === 0;
          } else {
            $.each(searchCriteria, function(field, value) {
              isSearchCriteriaEmpty = value.trim().length === 0;
              if (!isSearchCriteriaEmpty)
                return false;
            });
          }

          return isSearchCriteriaEmpty;
        };

        /**
         * Performs the search operation.
         * 
         * @param searchOptions:
         *          Search request options:
         * 
         * searchCriteria : Search keyword string or Map of {queryField-value}
         * 
         * newSearch : true/false. Indicates whether new search or just
         * pagination request.
         * 
         * appliedFilters : Applied filters array.
         * 
         * sortCriteria : Sorting order.
         * 
         * filterByCategory: Category ID for which result has to be filtered.
         */
        self.search = function(searchOptions) {

          if (self.isSearchCriteriaEmpty(searchOptions)) {
            self._resetPreviousSearchData();
            return;
          }

          self._beforeSearch(searchOptions);

          searchOptions = self._updateSearchOptions(searchOptions);
          self.searchOptions = searchOptions;

          if (self.options.maxRecentSearches) {
            self.updateRecentSearches(searchOptions);
          }
          
          var resultDataSource = self.resultDataSource();
          if (!resultDataSource) {
            resultDataSource = new oj.PagingTableDataSource(
            new oj.CollectionTableDataSource(self.searchResultCollection));
          }

          self.searching(true);
          self.searchResultCollection.refresh().then(function() {
            var totalSize = resultDataSource.totalSize();
            self.totalResults(totalSize > 0 ? totalSize: 0);

            self.resultDataSource(resultDataSource);
            self.searching(false);
          });
        };

        /**
         * Filter the search result by a category.
         * 
         * @param category:
         *          Category by which result has to be filtered.
         */
        self.filterByCategory = function(category) {
          var searchOptions = {
            searchCriteria : self.searchOptions.searchCriteria,
            sortCriteria : self.searchOptions.sortCriteria,
            filterByCategory : category
          };

          self.search(searchOptions);
        };

        /**
         * Filters the search result.
         * 
         * @param appliedFilters:
         *          Array of filter conditions.
         */
        self.applyFilters = function(appliedFilters) {
          var searchOptions = {};
          $.extend(searchOptions, self.searchOptions);
          searchOptions.appliedFilters = appliedFilters;
          self.search(searchOptions);
        };

        /**
         * Sort the search result.
         * 
         * @param sortCriteria:
         *          Array of sort orders.
         */
        self.sortSearchResult = function(sortCriteria) {
          var searchOptions = {};
          $.extend(searchOptions, self.searchOptions);
          searchOptions.sortCriteria = sortCriteria;
          self.search(searchOptions);
        };

        /**
         * Updates the recent search list which is saved in the client
         * localStorage. Only last 'maxRecentSearches' will be preserved.
         */
        self.updateRecentSearches = function(searchOptions) {
          if (searchOptions.appliedFilters.length
              || searchOptions.sortCriteria.length
              || searchOptions.filterByCategory) {
            // If it is refined search request then no need to save this.
            return;
          }

          var searchCriteria = searchOptions.searchCriteria;
          var searchItemName = searchCriteria;
          if (typeof searchCriteria === "object") {
            searchItemName = "";
            $.each(searchCriteria, function(field, value) {
              searchItemName += "-" + value;
            });
            searchItemName = searchItemName.substring(1);
          }

          var searchItem = {
            name : searchItemName,
            searchOptions : searchOptions
          };

          self.recentSearches.remove(function(item) {
            return (item.name.toUpperCase() === searchItem.name.toUpperCase());
          });

          var recentSearches = self.recentSearches();
          while (recentSearches.length >= self.options.maxRecentSearches) {
            self.recentSearches.pop();
          }

          self.recentSearches.unshift(searchItem);

          localStorage.setItem(self.options.searchId + "-" + "recentSearches",
              JSON.stringify(self.recentSearches()));
        };

        /**
         * Returns the recent searches saved in the client localStorage.
         */
        self.getRecentSearches = function() {
          return self._getFromLocalStorage("recentSearches");
        };

        /**
         * Saves the search in client localStorage.
         */
        self.saveSearch = function(name, searchOptions) {
          self.savedSearches.remove(function(item) {
            return (item.name === name);
          });

          self.savedSearches.unshift({
            name : name,
            searchOptions : searchOptions
          });

          localStorage.setItem(self.options.searchId + "-" + "savedSearches",
              JSON.stringify(self.savedSearches()));
        };

        /**
         * Returns the saved searches saved in the client localStorage.
         */
        self.getSavedSearches = function() {
          return self._getFromLocalStorage("savedSearches");
        };

        self._getFromLocalStorage = function(key) {
          var value = localStorage.getItem(self.options.searchId + "-" + key);
          if (value) {
            value = JSON.parse(value);
          } else {
            value = [];
          }
          return value;
        };

        // Initializing the recent and saved searches.
        if (self.options.searchId) {
          self.savedSearches(self.getSavedSearches());
          self.recentSearches(self.getRecentSearches());
        }
      };

      ojSearch.Utils = {};
      ojSearch.Utils.generateId = function() {
        var uniqueId = new Date().getTime();
        return function() {
          var id = "ojSearch-" + uniqueId;
          if (arguments.length) {
            for (arg in arguments) {
              id += "-" + arguments[arg];
            }
          }

          return id;
        };
      };

      return ojSearch;
    });
