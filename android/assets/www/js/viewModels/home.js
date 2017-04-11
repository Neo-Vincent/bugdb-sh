/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojcollectiontabledatasource', 'ojs/ojmodel', 'ojs/ojselectcombobox'],
    function (oj, ko, $, app) {
        function HomeViewModel() {
            var self = this;
            self.username = "User";
            self.serviceURL = "searchByPerson.json";
            self.Bugs = ko.observableArray([]);
            self.bugListCol = ko.observable();
            self.dataSource = ko.observable();
            // Header Config

            self.headerConfig = {
                'viewName': 'homeHeader',
                'viewModelFactory': {
                    createViewModel: function (params, valueAccessor) {
                        var model = {
                            pageTitle: "Home",
                            handleBindingsApplied: function (info) {
                                app.adjustContentPadding();
                            },
                            previousValue: null,
                            updateEventHandler: function (context, ui) {
                                var valueObj = {
                                    previousValue: this.previousValue,
                                    value: ui.value
                                };
                                previousValue = ui.value;

                                $('#updateEvent').html("<u>Update Event:</u>");
                                $('#update-changelog').html("Value Change: " + JSON.stringify(valueObj, null, 4));
                                $('#update-changeTrigger').html("Value Change Trigger: " + ui.optionMetadata.trigger);
                                $('#update-eventTime').html("Last event fired at: " + eventTime);
                            },
                        };
                        return Promise.resolve(model);
                    }
                }
            };


            self.handleActivated = function (params) {

            };

            self.handleAttached = function (info) {
                // Implement if needed
            };

            self.handleBindingsApplied = function (info) {

            };

            self.fetch = function (successCallBack) {
                self.bugListCol().fetch({
                    success: successCallBack,
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log('Error in fetch: ' + textStatus);
                    }
                });
            };
            self.parseBugItem = function (instance) {
                var item = {
                    "filed": instance["createUser"]["firstName"] + " " +
                    instance["createUser"]["lastName"],
                    "assigned": instance["assignment"]["assignTo"]["firstName"] + " " +
                    instance["assignment"]["assignTo"]["lastName"],
                    "type": instance["type"]["name"],
                    "name": instance["name"],
                    "createDate": instance["createDate"],
                    "bugNumber": instance["bugNumbeDater"],
                    "status": instance["status"]["id"],
                    "update": instance["lastUpdateDate"]
                };
                return item;
            };
            var BugList = oj.Model.extend({
                urlRoot: self.serviceURL,
                parse: self.parseBugItem,
                idAttribute: 'bugNumber'
            });
            var mBugList = new BugList();
            var BugCollection = oj.Collection.extend({
                url: self.serviceURL + "?limit=50",
                model: mBugList
            });

            self.bugListCol(new BugCollection());
            self.dataSource(new oj.CollectionTableDataSource(self.bugListCol()))
            self.handleDetached = function (info) {
                // Implement if needed
            };

            self.onSelected = function (event, ui) {
                // Custom logic on selected elements
                if (ui.option === 'selection') {
                    // Access selected elements via ui.items
                    var selectedIdsArray = $.map(ui.items, function (selectedListItem) {
                        return selectedListItem.id;
                    });
                    app.router.store(selectedIdsArray[0]);
                    app.router.go("bugView");
                }
            }

        }

        return new HomeViewModel();
    }
);
