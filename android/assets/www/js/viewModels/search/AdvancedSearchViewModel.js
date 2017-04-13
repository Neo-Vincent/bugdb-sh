/**
 * This module creates AdvancedSearchViewModel class.
 * 
 * AdvancedSearchViewModel provides the functionalities required for the
 * quick advanced popup and advanced search form.
 */
define(
    [ 'ojs/ojcore', 'knockout', 'jquery', './ojSearch', 'ojs/ojlistview' ],

    /**
     * Creates the AdvancedSearchViewModel object.
     * 
     * @param options :
     *          Options for AdvancedSearchViewModel.
     *          'searchModel' has to be passed in options.
     */
    function(oj, ko, $, ojSearch) {
      var AdvancedSearchViewModel = function(options) {
        var self = this;

        self.searchModel = options.searchModel;
        delete options["searchModel"];

        self.options = {
          /**
           * Id for the input search field.
           * This will be used to find the ojInputSearch component
           * for which this advanced search is attached.
           */
          inputSearchId : "",
          
          /**
           * Array of search fields in {id, name} format.
           */
          searchFeilds : []
        };

        // Initializing the options provided by user.
        self._initOptions = function(options) {
          $.each(options, function(key, value) {
            self.options[key] = value;
          });
        };
        self._initOptions(options);

        /**
         * Generates the unique Id for UI elements in result template.
         */
        self.uniqueId = ojSearch.Utils.generateId();

        /** ************* Quick Advanced Search ************** */

        self.viewAllResults = function(data, event) {
          var inputSearchComp = self._getInputSearchComponent();

          var searchCriteria = inputSearchComp.option("rawValue");

          self.searchModel.search({
            searchCriteria : searchCriteria
          });

          inputSearchComp.collapse();
        };

        self.isAdvanced = ko.observableArray([]);

        self.showQuickAdvancedSearch = function(data, event) {
          var inputSearchComp = self._getInputSearchComponent();
          var advancedSearchPopup = $("#" + self.uniqueId("popup"));

          var showAdvancedSearch = event.currentTarget.checked;
          if (showAdvancedSearch) {
            advancedSearchPopup.closest(".oj-popup")
                .outerWidth(inputSearchComp.widget().innerWidth());
            advancedSearchPopup.ojPopup("open", inputSearchComp.widget());
            $("#" + self.uniqueId('advancedSearchKeywords')).focus();
          }

          return true;
        };

        self.hideQuickAdvancedSearch = function() {
          self.closeQuickAdvancedSearch();

          if (self.inputSearchComponent) {
            self.inputSearchComponent.widget().find(":text").focus();
            self.inputSearchComponent.expand();
          }

          return true;
        };

        self.closeQuickAdvancedSearch = function() {
          var advancedSearchPopup = $("#" + self.uniqueId("popup"));

          try {
            advancedSearchPopup.ojPopup("close");
          } catch (e) {
          }
        };

        self.popupCloseHandler = function() {
          self.isAdvanced.removeAll();
        };

        self.inputSearchComponent = null;

        /**
         * This function will cache the input-search component associated with
         * this Search and attaches a listener which will close the advanced
         * search popup when focus transferred back to input-search.
         */
        self._getInputSearchComponent = function() {
          if (self.inputSearchComponent)
            return self.inputSearchComponent;

          self.inputSearchComponent = $("#" + self.options.inputSearchId)
                                        .data("oj-ojInputSearch");

          self.inputSearchComponent.widget().on({
            "focusin" : function() {
              var advancedSearchPopup = $("#" + self.uniqueId("popup"));
              advancedSearchPopup.ojPopup("close");
            }
          });

          return self.inputSearchComponent;
        };

        /**
         * Indicates currently how many search criteria items are visible in
         * quick advanced search options.
         */
        self.noOfSearchCriteriaItems = ko.observable(1);

        /**
         * Resets the data entered by user in quick advanced search popup.
         */
        self.resetQuickAdvancedSearch = function() {
          $("#" + self.uniqueId("advancedSearchKeywords")).val("");

          var searchCriteriaContainer = $("#"
              + self.uniqueId("searchCriteria-container"));
          searchCriteriaContainer.empty();

          self.noOfSearchCriteriaItems(0);
          self.addSearchCriteriaItem();
        };

        /**
         * Adds a search criteria item in quick advanced search.
         */
        self.addSearchCriteriaItem = function() {
          var searchCriteriaContainer = $("#"
              + self.uniqueId("searchCriteria-container"));

          var noOfSearchCriteriaItems = self.noOfSearchCriteriaItems();
          var itemIndex = noOfSearchCriteriaItems;

          noOfSearchCriteriaItems++;
          self.noOfSearchCriteriaItems(noOfSearchCriteriaItems);

          var searchCriteriaItemLabelsHTML = "<div class='oj-helper-hidden-accessible'>"
              + "<label aria-hidden='true' for='"
              + self.uniqueId("searchCriteriaItem", itemIndex)
              + "' data-bind=\"text: 'Search criteria field "
              + noOfSearchCriteriaItems
              + " of ' + noOfSearchCriteriaItems()\"></label>"
              + "<label aria-hidden='true' for='"
              + self.uniqueId("searchCriteriaItem", itemIndex, "value")
              + "' data-bind=\"text: 'Search criteria value "
              + noOfSearchCriteriaItems
              + " of ' + noOfSearchCriteriaItems()\"></label></div>";

          var searchCriteriaItemLabelsElem = $(searchCriteriaItemLabelsHTML);
          ko.applyBindings(self, searchCriteriaItemLabelsElem[0]);
          searchCriteriaItemLabelsElem.appendTo(searchCriteriaContainer);

          var searchCriteriaItemHTML = "<div class='oj-flex'>"
              + "<div class='oj-flex-item'>"
              + "<select data-bind=\"ojComponent: {component: 'ojSelect'}\" id='"
              + self.uniqueId("searchCriteriaItem", itemIndex)
              + "' value='any'>"
              + "<option data-bind=\"value: 'any', text: 'Any'\"></option>"
              + "<!-- ko foreach: options.searchFeilds -->"
              + "<option data-bind=\"value: id, text: name\"></option>"
              + "<!-- /ko -->"
              + "</select>"
              + "</div>"
              + "<div class='oj-flex-item'>"
              + "<input data-bind=\"ojComponent: {component: 'ojInputText', rootAttributes: {style: 'max-width: 100%'}}\" id='"
              + self.uniqueId("searchCriteriaItem", itemIndex, "value")
              + "' /></div></div>";

          var searchCriteriaItemElem = $(searchCriteriaItemHTML);
          ko.applyBindings(self, searchCriteriaItemElem[0]);
          searchCriteriaItemElem.appendTo(searchCriteriaContainer);

          // Setting announcement text. This will be used screen
          // readers to announce that new criteria item added.
          $("#" + self.uniqueId("addCriteriaAlert")).text(
              "Search criteria item added.");
        };

        /**
         * This function will show the detailed advanced search options and also
         * populates the data passed in searchCriteria parameter into the search
         * form.
         */
        self.showAllAdvancedSearch = function() {
          self._showAdvancedSearch(self.getQuickAdvancedSearchCriteria(), true);
          self.closeQuickAdvancedSearch();
        };

        self.saveQuickAdvancedSearch = function() {
          var searchOptions = {
            searchCriteria : self.getQuickAdvancedSearchCriteria()
          };

          self.tobeSavedSearch(searchOptions);
          $("#" + self.uniqueId("saveSearchDialog")).ojDialog("open");
        };

        self.quickAdvancedSearch = function() {
          self.searchModel.search({
            searchCriteria : self.getQuickAdvancedSearchCriteria()
          });

          self.closeQuickAdvancedSearch();
        };

        /**
         * Returns the search criteria map from quick advanced search popup.
         */
        self.getQuickAdvancedSearchCriteria = function() {
          var searchCriteriaContainer = $("#"
              + self.uniqueId("searchCriteria-container"));

          var searchCriteria = {};
          var searchFields = searchCriteriaContainer
              .find(":data('oj-ojSelect')");
          for (var i = 0; i < searchFields.length; i++) {
            var searchField = $(searchFields[i]);
            var field = searchField.ojSelect("option", "value");
            var value = $("#" + searchField.attr("id") + "-value").val().trim();

            if (field && value)
              searchCriteria[field] = value;
          }

          var keywords = $("#" + self.uniqueId("advancedSearchKeywords")).val();
          if (keywords) {
            searchCriteria["advancedSearchKeywords"] = keywords;
          }

          return searchCriteria;
        };

        /** ************* End of Quick Advanced Search ************** */

        /** ****************** Advanced Search ******************* */

        // This subscription is to reset the AdvancedSearchViewModel on new
        // search results.
        self.searchModel.resultDataSource.subscribe(function() {
          self.isAdvancedSearchVisible(false);
        });

        /**
         * Indicates currently advanced search options are visible.
         */
        self.isAdvancedSearchVisible = ko.observable(false);

        self.advancedSearchCriteria = ko.observable(null);

        self.showAdvancedSearch = function() {
          self._showAdvancedSearch({}, true);
        };

        self._showAdvancedSearch = function(searchCriteria, grabFocus) {

          if (typeof searchCriteria === "string") {
            var keyword = searchCriteria;
            searchCriteria = {
              advancedSearchKeywords : keyword
            };
          }

          var updatedSearchCriteria = [];
          $.each(self.options.searchFeilds, function(index, searchFeild) {
            var criteria = {
              id : searchFeild.id,
              name : searchFeild.name,
              value : searchCriteria[searchFeild.id] || ""
            };
            updatedSearchCriteria.push(criteria);
          });

          var advancedSearchKeywords = searchCriteria["advancedSearchKeywords"]
              || "";
          if (searchCriteria["any"]) {
            if (advancedSearchKeywords) {
              advancedSearchKeywords += ", " + searchCriteria["any"];
            } else {
              advancedSearchKeywords = searchCriteria["any"];
            }
          }

          updatedSearchCriteria.push({
            id : "advancedSearchKeywords",
            name : "Keywords",
            value : advancedSearchKeywords
          });

          self.advancedSearchCriteria(updatedSearchCriteria);

          self.isAdvancedSearchVisible(true);

          if (grabFocus) {
            $("#" + self.uniqueId('advancedSection')).find("input").first()
                .focus();
          }

        };

        /**
         * Closes the detailed advanced search page.
         */
        self.closeAdvancedSearch = function() {
          self.isAdvancedSearchVisible(false);
        };

        /**
         * Resets the data entered by user in detailed advanced search page.
         */
        self.resetAdvancedSearch = function() {
          var advancedSearchCriteria = self.advancedSearchCriteria();
          self.advancedSearchCriteria(null);
          self.advancedSearchCriteria(advancedSearchCriteria);
        };

        self.saveAdvancedSearch = function() {
          var searchOptions = {
            searchCriteria : self.getAdvancedSearchCriteria()
          };

          self.tobeSavedSearch(searchOptions);
          $("#" + self.uniqueId("saveSearchDialog")).ojDialog("open");
        };

        self.advancedSearch = function() {
          self.searchModel.search({
            searchCriteria : self.getAdvancedSearchCriteria()
          });
        };

        /**
         * Returns the search criteria map from the advanced search options
         * form.
         */
        self.getAdvancedSearchCriteria = function() {
          var searchCriteriaContainer = $("#"
              + self.uniqueId("advanced-searchCriteria-container"));

          var searchCriteria = {};
          var searchFields = searchCriteriaContainer
              .find(":data('oj-ojInputText')");
          for (var i = 0; i < searchFields.length; i++) {
            var searchField = $(searchFields[i]);
            var field = searchField.attr("data-search-field");
            var value = searchField.val().trim();

            if (field && value)
              searchCriteria[field] = value;
          }

          return searchCriteria;
        };

        /** ****************** End of Advanced Search ******************* */

        /** ****************** Recent/Saved Searches ******************* */

        self.recentSearches = new oj.ArrayTableDataSource(
            self.searchModel.recentSearches, {
              idAttribute : "name"
            });

        self.savedSearches = new oj.ArrayTableDataSource(
            self.searchModel.savedSearches, {
              idAttribute : "name"
            });

        self.searchItemRenderer = function(context) {
          var searchItem = context["data"];
          var item = context["parentElement"];

          var content = $("<div>").text(searchItem.name);
          $(item).append(content);
        };

        self.recentSearchSelected = function(event, ui) {
          if (ui.option === "selection" && ui.value && ui.value.length) {
            self._selectSearchItem(self.searchModel.recentSearches(),
                ui.value[0]);
          }
        };

        self.savedSearchSelected = function(event, ui) {
          if (ui.option === "selection" && ui.value && ui.value.length) {
            self._selectSearchItem(self.searchModel.savedSearches(),
                ui.value[0]);
          }
        };

        self._selectSearchItem = function(searchItems, itemName) {
          var selectedItem = null;
          for (i in searchItems) {
            if (itemName === searchItems[i].name) {
              selectedItem = searchItems[i];
              break;
            }
          }

          if (selectedItem) {
            self._showAdvancedSearch(selectedItem.searchOptions.searchCriteria,
                false);
          }
        };

        self.tobeSavedSearch = ko.observable();
        self.searchName = ko.observable();

        self.saveSearch = function() {
          self.searchModel
              .saveSearch(self.searchName(), self.tobeSavedSearch());

          $("#" + self.uniqueId("saveSearchDialog")).ojDialog("close");
        };

        self.cancelSaveSearch = function() {
          $("#" + self.uniqueId("saveSearchDialog")).ojDialog("close");
        };

        /** ****************** End of Recent/Saved Searches ******************* */
      };

      return AdvancedSearchViewModel;
    });