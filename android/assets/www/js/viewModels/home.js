/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */

define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojcollectiontabledatasource', 'ojs/ojmodel', 'ojs/ojselectcombobox', 'ojs/ojchart'],
    function (oj, ko, $, app) {
        function HomeViewModel() {
            var self = this;
            self.username = localStorage.email;
            self.passwd= localStorage.passwd;
            console.log(self.username);
            //self.serviceURL = "searchByPerson.json";
            self.serviceURL = "http://10.191.4.245:7101/SmartBugDBBackEnd/bug/searchByAssignToEmail?email="+self.username;
            self.Bugs = ko.observableArray([]);
            self.bugListCol = ko.observable();
            self.dataSource = ko.observable();
            var converterFactory = oj.Validation.converterFactory("number");
            var options = {pattern: '#,##0%'};
            var converter = converterFactory.createConverter(options);
            self.converter = ko.observable(converter);

            self.rawData = [];
            /*
            $.ajax({
             type: "GET",
             url: app.baseUrl + "priority/searchAllPriority",
             success: function (jsonResponse) {
             app.priorities=[];
             for(var i in jsonResponse) {
             app.priorities.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
             }
             }
             });
             $.ajax({
             type: "GET",
             url: app.baseUrl + "status/searchAllStatus",
             success: function (jsonResponse) {
             app.status1s=[];
             for(var i in jsonResponse) {
             app.status1s.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
             }
             }
             });
             $.ajax({
             type: "GET",
             url: app.baseUrl + "type/searchAllType",
             success: function (jsonResponse) {
             app.bugTypes=[];
             for(var i in jsonResponse) {
             app.bugTypes.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
             }
             }
             });*/
            // Header Config
            self.gotoBugView = function (bugNum) {
                //$.getJSON('searchByNumber'+bugNum+'.json',
                //console.log(bugNum);
                $.ajax({
                    type: "GET",
                    url: app.baseUrl + "bug/searchByNumber?bugNumber=" + bugNum,
                    success: function (jsonResponse) {
                        app.router.store(bugNum);
                        app.currentBugRawData = jsonResponse;
                        app.router.go("bugView");
                    }
                });
            };
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
                                self.gotoBugView(previousValue[0]);
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

            self.totalBugsPieValue = ko.observableArray();
            self.updateTotalBugs = function () {
                var openRate = [{name: "Open Bugs", items: [0]},
                    {name: "Closed Bugs", items: [0]}];
                for (var i in self.rawData) {
                    var open=0;
                    var close=0;
                    if (self.rawData[i]["status"]["id"] < 3) {
                        open+=1;
                    }
                    else {
                        close+=1;
                    }

                }
                openRate[0]["items"]=[open];
                openRate[1]["items"]=[close];
                //self.openRatePieValue = ko.observableArray(self.openRate);
                $("#totalBugsChart").ojChart('option',"series",openRate);
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
                    "bugNumber": instance["bugNumber"],
                    "status": instance["status"]["id"],
                    "update": instance["lastUpdateDate"]
                };
                self.rawData.push(instance);
                self.updateTotalBugs();
                return item;
            };
            var BugList = oj.Model.extend({
                urlRoot: self.serviceURL,
                parse: self.parseBugItem,
                idAttribute: 'bugNumber'
            });
            var mBugList = new BugList();
            var BugCollection = oj.Collection.extend({
                url: self.serviceURL,
                model: mBugList
            });

            self.bugListCol(new BugCollection());
            self.dataSource(new oj.CollectionTableDataSource(self.bugListCol()));

            self.handleDetached = function (info) {
                // Implement if needed
            };

            self.onSelected = function (event, ui) {
                // Custom logic on selected elements
                if (ui.option === 'selection') {
                    var bugNum = ui.items[0].id;
                    for (var i in self.rawData) {
                        if (self.rawData[i]["bugNumber"] == bugNum) {
                            app.currentBugRawData = self.rawData[i];
                            break;
                        }
                    }
                    app.router.go("bugView");
                }
            }

        }

        return new HomeViewModel();
    }
);
