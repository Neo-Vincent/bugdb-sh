/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController'],
 function(oj, ko, $, app) {
  
    function BugViewModel() {
      var self = this;
      // Header Config
      var headerFactory = {
           createViewModel: function(params, valueAccessor) {
             var model =  {
               pageTitle: app.router.currentState().label,
               goBack : function() {
                                          app.pendingAnimationType = 'navParent';
                                          window.history.back();
                                    },
               handleBindingsApplied: function(info) {
                 app.adjustContentPadding();
               },

             };
             return Promise.resolve(model);
           }
       };
      self.headerConfig = {'viewName': 'bugViewHeader', 'viewModelFactory':headerFactory };

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


      oj.Router.sync().then(
          function() {
             var id = app.router.retrieve();
             app.router.store(null);
          }
       );
        self.readMode=false;
        self.status1="AA";
    }

    return new BugViewModel();
  }
);
