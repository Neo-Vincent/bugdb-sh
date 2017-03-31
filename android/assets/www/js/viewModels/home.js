/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojcollectiontabledatasource', 'ojs/ojmodel'],
 function(oj, ko, $, app) {
  
    function HomeViewModel() {
      var self = this;
      self.username="User";
      // Header Config
      self.headerConfig = {'viewName': 'home_header',
          'viewModelFactory': {
              createViewModel: function(params, valueAccessor) {
              var model =  {
                pageTitle: "Home",
                handleBindingsApplied: function(info) {
                  app.adjustContentPadding();
                },
                userName:self.username
              };
              return Promise.resolve(model);
            }
          }};
      

      self.handleActivated = function(params) {
      };

      self.handleAttached = function(info) {
        // Implement if needed
      };

      self.handleBindingsApplied = function(info) {

      };

      self.data= [
                  {
                      "filed_by": "Oracle Retail",
                      "assigned":"Neo",
                      "bug_type":"Bug",
                      "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                      "created_at": "2015-03-04 2:40am",
                      "bug_num":2400001,
                      "status":80,
                      "updated_at": "2015-03-04 2:40am"
                  },
                {
                    "filed_by": "Oracle Retail",
                    "assigned":"Neo",
                    "bug_type":"Bug",
                    "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                    "created_at": "2015-03-04 2:40am",
                    "bug_num":2400001,
                    "status":80,
                    "updated_at": "2015-03-04 2:40am"
                },
                {
                    "filed_by": "Oracle Retail",
                    "assigned":"Neo",
                    "bug_type":"Bug",
                    "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                    "created_at": "2015-03-04 2:40am",
                    "bug_num":2400001,
                    "status":80,
                    "updated_at": "2015-03-04 2:40am"
                },
                {
                    "filed_by": "Oracle Retail",
                    "assigned":"Neo",
                    "bug_type":"Bug",
                    "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                    "created_at": "2015-03-04 2:40am",
                    "bug_num":2400001,
                    "status":80,
                    "updated_at": "2015-03-04 2:40am"
                },
              {
                  "filed_by": "Oracle Retail",
                  "assigned":"Neo",
                  "bug_type":"Bug",
                  "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                  "created_at": "2015-03-04 2:40am",
                  "bug_num":2400001,
                  "status":80,
                  "updated_at": "2015-03-04 2:40am"
              },
            {
                "filed_by": "Oracle Retail",
                "assigned":"Neo",
                "bug_type":"Bug",
                "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                "created_at": "2015-03-04 2:40am",
                "bug_num":2400001,
                "status":80,
                "updated_at": "2015-03-04 2:40am"
            },
            {
                "filed_by": "Oracle Retail",
                "assigned":"Neo",
                "bug_type":"Bug",
                "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                "created_at": "2015-03-04 2:40am",
                "bug_num":2400001,
                "status":80,
                "updated_at": "2015-03-04 2:40am"
            },
            {
                "filed_by": "Oracle Retail",
                "assigned":"Neo",
                "bug_type":"Bug",
                "subject": "London's West End set for 3m sq ft of new retail space as area's sales hit 11bn (via @RetailWeek) http://bit.ly/1zXpZHZ  ^SW",
                "created_at": "2015-03-04 2:40am",
                "bug_num":2400001,
                "status":80,
                "updated_at": "2015-03-04 2:40am"
            },
              ];

              self.dataSource= new oj.ArrayTableDataSource(self.data, {idAttribute: "filed_by"});

      self.handleDetached = function(info) {
        // Implement if needed
      };

      self.onSelected = function(event, ui)
      {
          // Custom logic on selected elements
          if (ui.option === 'selection')
          {
              // Access selected elements via ui.items
              var selectedIdsArray = $.map(ui.items, function(selectedListItem) {
                  return selectedListItem.id;
              });
              console.log(selectedIdsArray);
              app.router.store(selectedIdsArray[0]);
              app.router.go("bugView");
          }
      }

    }

    return new HomeViewModel();
  }
);
