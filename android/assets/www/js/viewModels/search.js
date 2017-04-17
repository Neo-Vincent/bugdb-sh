/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController','ojs/ojinputtext','ojs/ojselectcombobox','ojs/ojbutton','ojs/ojknockout','ojs/ojdialog'],
 function(oj, ko, $, app) {

    function SearchViewModel() {
      var self = this;
      self.reuse = [];

      self.subjectSearch = ko.observable();
      self.firstNameSearch = ko.observable();
      self.lastNameSearch = ko.observable();

      self.prioritysearchs = ko.observableArray();
      self.prioritysearch = ko.observable();

      self.productsearch = ko.observable();
      self.productsearchs = ko.observableArray();

      self.componentsearch = ko.observable();
      self.componentsearchs = ko.observableArray();

      self.subcomponentsearch = ko.observable();
      self.subcomponentsearchs = ko.observableArray();

      self.savesearch = ko.observable();
      self.savesearchs = ko.observableArray();

      self.updateEventHandler = function (context, ui) {
           var valueObj = {
                  previousValue: this.previousValue,
                   value: ui.value
                   };
             app.gotoBugView(ui.value[0]);
       }

      self.regist = ko.observable();
      self.buttonClick = function(data, event){
          var url=app.baseUrl+"/"
               console.log(self.firstNameSearch());
               app.router.go('SearchResult');
      }

      self.buttonSaveClick = function(data, event) {
$("#modalDialog1").ojDialog("open");


      }

      self.buttonOkClick = function(data, event) {
            $("#modalDialog1").ojDialog("close");
             this.reuse.push({"Subject":self.subjectSearch(),
                                 "Firstname": self.firstNameSearch(),
                                 "Lastname" : self.lastNameSearch(),
                                 "Project": self.productsearch(),
                                 "Component": self.componentsearch(),
                                 "Subcomponent": self.subcomponentsearch(),
                                 "name":"BUGBUGBUG"
                                 });
                            console.log(self.reuse[0]);
                        self.savesearchs.push({value:self.reuse.length-1,label:self.regist()});
      }
//      self.buttonOpenClick = function(data, event) {
//            $("#modalDialog1").ojDialog("open");
//      }

//      self.handleOpen = $("#buttonOpener").click(function() {
//             $("#modalDialog1").ojDialog("open"); });
//
//      self.handleOKClose = $("#okButton").click(function() {
//             $("#modalDialog1").ojDialog("close"); });

      // Header Config
      self.headerConfig = {'viewName': 'header', 'viewModelFactory': app.getHeaderModel()};

      // Below are a subset of the ViewModel methods invoked by the ojModule binding
      // Please reference the ojModule jsDoc for additionaly available methods.

      /**
       * Optional ViewModel method invoked when this ViewModel is about to be
       * used for the View transition.  The application can put data fetch logic
       * here that can return a Promise which will delay the handleAttached function
       * call below until the Promise is resolved.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
       * the promise is resolved
       */
      self.handleActivated = function(info) {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
       */
      self.handleAttached = function(info) {
        // Implement if needed
      };


      /**
       * Optional ViewModel method invoked after the bindings are applied on this View.
       * If the current View is retrieved from cache, the bindings will not be re-applied
       * and this callback will not be invoked.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       */
      self.handleBindingsApplied = function(info) {
        // Implement if needed
      };

      /*
       * Optional ViewModel method invoked after the View is removed from the
       * document DOM.
       * @param {Object} info - An object with the following key-value pairs:
       * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
       * @param {Function} info.valueAccessor - The binding's value accessor.
       * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
       */
      self.handleDetached = function(info) {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new SearchViewModel();
  }
);
