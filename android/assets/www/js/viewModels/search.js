/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController','viewModels/search/ojSearch',
      'viewModels/search/AdvancedSearchViewModel',
      'ojs/ojcomponents', 'ojs/ojselectcombobox', 'ojs/ojmodule',
      'promise'],
 function(oj, ko, $, app,ojSearch, AdvancedSearchViewModel) {

   var searchModelOptions = {
     searchURL : "http://mocksolr/collection/select",
     resultPageSize : 5,
     modelId : "employee_id",
     maxRecentSearches : 3,
     searchId: "people",

     /**
      * Builds the REST service URL to get the search results for
      * the current search criteria.
      *
      * In this demo Apache Solr service is used to provide
      * the result data. So building the request URL based on the
      * Solr format.
      */
     buildSearchURL : function(collection, collectionOptions,
                               searchOptions) {
       // Adding paging parameters
       var url = collection.url + "?rows="
           + encodeURIComponent(collection.fetchSize);
       if (collectionOptions['startIndex']) {
         url += "&start="
             + encodeURIComponent(collectionOptions['startIndex']);
       }

       // Preparing search query parameters
       var prepareAnyFieldQuery = function(keyword) {
         var query = "(firstname:*" + keyword + "*"
             + " OR lastname:*" + keyword + "*" + " OR email:\"*"
             + keyword + "*\"" + " OR department_name:*" + keyword
             + "*" + " OR level:*" + keyword + "*"
             + " OR location_code:*" + keyword + "*"
             + " OR tags:*" + keyword + "*" + " OR phone:*"
             + keyword + ")";
         return query;
       };

       var prepareFieldQuery = function(field, value) {
         if (field == "any") {
           return prepareAnyFieldQuery(value);
         } else if (field == "advancedSearchKeywords") {
           var query = "";
           var keywords = value.split(",");
           for (i in keywords) {
             var keyword = keywords[i].trim();
             if (keyword) {
               if (query) {
                 query += " AND ";
               }
               query += prepareAnyFieldQuery(keyword);
             }
           }
           return query;
         } else {
           return field + ":*" + value + "*";
         }
       };

       var queryString = "";
       var searchCriteria = searchOptions.searchCriteria;
       if (typeof searchCriteria == "string") {
         queryString = prepareAnyFieldQuery(searchCriteria);
       } else {
         $.each(searchCriteria, function(field, value) {
           if (queryString) {
             queryString += " AND ";
           }
           queryString += prepareFieldQuery(field, value);
         });
       }

       // Adding category based search filter parameters to URL
       switch (searchOptions.filterByCategory) {
         case "managers":
           queryString += " AND isManager:1";
           break;
         case "contracts":
           queryString += " AND isContractor:1";
           break;
         case "employees":
           queryString += " AND isManager:0 AND isContractor:0";
           break;
       }

       var filterQuery = "";
       $.each(searchOptions.appliedFilters, function(filterIdx,
                                                     filter) {
         var filterId = filter.filterId;
         var options = filter.options;
         filterQuery += "&fq={!tag=" + filterId + "}" + filterId
             + ":/";
         for (var i = 0; i < options.length; i++) {
           filterQuery += options[i];
           if (i != (options.length - 1))
             filterQuery += "|";
         }
         filterQuery += "/";
       });

       url += "&q=" + encodeURIComponent(queryString);
       url += filterQuery;
       url += "&wt=json";

       var buildFacetExcludeTagMap = function() {
         var facetExcludeTagMap = {};
         var appliedFilters = searchOptions.appliedFilters;
         for (var i = 0; i < appliedFilters.length; i++) {
           var filterId = appliedFilters[i].filterId;
           var facetExcludeTag = "{!ex=" + filterId;

           for (var j = i + 1; j < appliedFilters.length; j++) {
             facetExcludeTag += "," + appliedFilters[j].filterId;
           }

           facetExcludeTag += "}";
           facetExcludeTagMap[filterId] = facetExcludeTag;
         }
         return facetExcludeTagMap;
       };

       // Adding parameters to get the available filter options.
       // Filter options will be obtained for the new requests
       // only, as it is not required in case of pagination.
       if (searchOptions.newSearch) {
         var facetExcludeTagMap = buildFacetExcludeTagMap();
         var facetFields = [ 'location_code', 'level',
           'department_name' ];

         url += "&facet=true";

         for (i in facetFields) {
           url += "&facet.field=";
           var facet = facetFields[i];
           if (facetExcludeTagMap[facet])
             url += facetExcludeTagMap[facet];
           url += facet;
         }
       }

       // Adding sorting parameters to URL.
       var sortQuery = "";
       $.each(searchOptions.sortCriteria, function(index,
                                                   sortOrderItem) {
         var colName;
         switch (sortOrderItem.columnIndex) {
           case 0:
             colName = "firstname";
             break;
           case 1:
             colName = "location_code";
             break;
           case 2:
             colName = "level";
             break;
         }
         if (colName) {
           sortQuery += "," + colName + " "
               + sortOrderItem.sortOrder;
         }
       });

       if (sortQuery) {
         url += "&sort="
             + encodeURIComponent(sortQuery.substring(1));
       }

       return url;
     },

     /**
      * Provides the paging details for the current search results.
      *
      * Converts the Solr data format to the format required by
      * ojCollection.
      */
     resultPagingOptions : function(response) {
       var pagingOptions = {};
       try {
         pagingOptions.totalResults = response.response.numFound;
         pagingOptions.limit = response.responseHeader.params.rows;
         pagingOptions.count = response.response.docs.length;
         pagingOptions.offset = response.response.start;
         pagingOptions.hasMore = (response.response.start
             + response.response.docs.length) < response.response.numFound;
       } catch (e) {
       }

       return pagingOptions;
     },

     /**
      * Parses the result data and returns it as excepted by
      * searchModel.
      *
      * Converts the Solr data format to the format required by
      * searchModel.
      */
     parseResultData : function(response) {
       var searchResult = {
         resultItems : []
       };

       try {
         searchResult.resultItems = response.response.docs;

         if (response.facet_counts) {
           var availableFilters = {};
           $.each(response.facet_counts.facet_fields, function(
               filterId, filterItems) {
             var filterName = "Location";
             if (filterId == "level")
               filterName = "Level";
             else if (filterId == "department_name")
               filterName = "Organization";

             var filter = {
               filterId : filterId,
               filterName : filterName,
               filterItems : []
             };
             availableFilters[filterId] = filter;

             for (i = 0; i < filterItems.length; i += 2) {
               if (filterItems[i + 1] == 0)
                 continue;
               var filterItem = {
                 name : filterItems[i],
                 value : filterItems[i],
                 totalResults : filterItems[i + 1]
               }
               filter.filterItems.push(filterItem);
             }
           });

           searchResult.availableFilters = availableFilters;
         }
       } catch (e) {
       }

       return searchResult;
     }
   };

   var searchModel = new ojSearch.SearchModel(searchModelOptions);

   var searchResultVMOptions = {
     searchModel : searchModel,
     listViewResultHeaderTemplate : "listViewResultHeaderTemplate",
     gridViewResultHeaderTemplate : "gridViewResultHeaderTemplate",
     listViewResultItemTemplate : "listViewResultItemTemplate",
     gridViewResultItemTemplate : "gridViewResultItemTemplate",
     resultCategories : [ {
       id : "managers",
       name : "Managers"
     }, {
       id : "employees",
       name : "Employees"
     }, {
       id : "contracts",
       name : "Contracts"
     } ],
     selectResultItem : function(selectedItem) {
       $("#selection").text("Selected Employee ID: " + selectedItem);
     }
   };

   var advancedSearchVMOptions = {
     searchModel : searchModel,
     inputSearchId : "inputSearch",
     searchFeilds : [ {
       id : "firstname",
       name : "First Name"
     }, {
       id : "lastname",
       name : "Last Name"
     }, {
       id : "department_name",
       name : "Organization"
     }, {
       id : "level",
       name : "Level"
     }, {
       id : "location_code",
       name : "Location"
     }, {
       id : "email",
       name : "Email"
     }, {
       id : "phone",
       name : "Phone Number"
     }, {
       id : "tags",
       name : "Tags"
     } ]
   };
   var advancedSearchVM = new AdvancedSearchViewModel(advancedSearchVMOptions);

   var viewModel = {
     headerConfig : {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()},
     searchModel : searchModel,
     searchResultVMOptions : searchResultVMOptions,
     advancedSearchVM : advancedSearchVM,
     advancedSearchVMFactory : {
       createViewModel: function(params, valueAccessor) {
         return new Promise(function(fulfill, reject) {
           fulfill(advancedSearchVM);
         });
       }
     },
     search : function(event, ui) {
       if (ui.option !== "value") {
         return;
       }

       var trigger = ui.optionMetadata.trigger;
       if (!trigger || trigger === "blur") {
         return;
       }

       var criteria = ui.value[0];
       var searchCriteria = {
         searchCriteria : criteria
       };

       if (trigger === "option_selected") {
         if (criteria.indexOf("grp:") == 0) {
           var values = criteria.split(":");
           searchCriteria.filterByCategory = values[1];
           searchCriteria.searchCriteria = values[2];
           $("#inputSearch").ojInputSearch({"value": values[2]});
         } else if (criteria.indexOf("recentSearches-") == 0) {
           var values = criteria.split("-");
           var recentSearches = searchModel.getRecentSearches();
           searchCriteria = recentSearches[parseInt(values[1])].searchOptions;
         } else if (criteria.indexOf("savedSearches-") == 0) {
           var values = criteria.split("-");
           var savedSearches = searchModel.getSavedSearches();
           searchCriteria = savedSearches[parseInt(values[1])].searchOptions;
         } else if (criteria.indexOf("commonSearches-") == 0) {
           var values = criteria.split("-");
           searchCriteria.searchCriteria = values[1];
         } else {
           searchResultVMOptions.selectResultItem(criteria);
           searchCriteria.searchCriteria = "";
         }
       }

       searchModel.search(searchCriteria);
     },
     suggestions : function(context) {
       return new Promise(function(fulfill, reject) {

         var options = [];

         var term = context.term;
         if (!term) {

           var getSearchGroup = function(group) {
             var searchItems;
             var groupName;
             if (group == "recentSearches") {
               searchItems = searchModel.getRecentSearches();
               groupName = "RECENT SEARCHES";
             } else {
               searchItems = searchModel.getSavedSearches();
               groupName = "SAVED SEARCHES";
             }

             if (searchItems.length) {
               var searchGroup = {
                 groupName: groupName,
                 items: []
               };

               for(var i = 0; i < searchItems.length; i++) {
                 var name = searchItems[i].name;
                 searchGroup.items.push({
                   label: name,
                   value: group + "-" + i
                 });
               }

               return searchGroup;
             }

             return null;
           };

           var recentSearches = getSearchGroup("recentSearches");
           var savedSearches = getSearchGroup("savedSearches");

           if (recentSearches)
             options.push(recentSearches);

           var commonSearches = {
             groupName: "COMMON SEARCHES",
             items: [
               { label: "Kristin", value: "commonSearches-Kristin" },
               { label: "McClur", value: "commonSearches-McClur" },
               { label: "Sreekrishna", value: "commonSearches-Sreekrishna" }]
           };
           options.push(commonSearches);

           if (savedSearches)
             options.push(savedSearches);

           fulfill(options);
           return;
         }

         var suggestionURL = "http://mocksolr/collection/select";

         var query = "(firstname:*" + term + "*"
             + " OR lastname:*" + term + "*" + ")";

         suggestionURL += "?q=" + encodeURIComponent(query);
         suggestionURL += "&wt=json&group=true&group.field=isManager&group.limit=4";

         $.getJSON(suggestionURL, function(data) {
           var employees;
           var managers;

           var groups = data.grouped.isManager.groups;
           $.each(groups, function(index, group) {
             if (group.groupValue == 0) {
               var emp = {
                 groupId : "grp:employees:" + term,
                 groupName : "EMPLOYEES",
                 totalResults : group.doclist.numFound,
                 items : group.doclist.docs
               };
               employees = emp;
             } else {
               var mng = {
                 groupId : "grp:managers:" + term,
                 groupName : "MANAGERS",
                 totalResults : group.doclist.numFound,
                 items : group.doclist.docs
               };
               managers = mng;
             }
           });

           if (managers)
             options.push(managers);
           if (employees)
             options.push(employees);

           fulfill(options);
         });
       });
     }
   };

    function CustomerViewModel() {
      var self = this;
      
      // Header Config
      self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()};

      self.handleActivated = function(info) {
        // Implement if needed
      };

      self.handleAttached = function(info) {
        // Implement if needed
      };

      self.handleBindingsApplied = function(info) {
        // Implement if needed
      };

      self.handleDetached = function(info) {
        // Implement if needed
      };
    }

    return  viewModel;
  }
);
