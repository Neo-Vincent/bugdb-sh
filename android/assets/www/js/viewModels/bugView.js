/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojknockout'],
    function (oj, ko, $, app) {

        function BugViewModel() {
            var self = this;
            self.rawData=app.currentBugRawData;
            self.bugNum=ko.observable();
            self.bugType=ko.observable();
            self.statusCode=ko.observable();
            self.assignBy=ko.observable();
            self.assignee=ko.observable();
            self.product=ko.observable();
            self.component=ko.observable();
            self.subcomponent=ko.observable();
            self.patchNumber=ko.observable();
            self.application=ko.observable();
            self.cloud=ko.observable();
            self.os=ko.observable();
            self.version=ko.observable();
            self.hardware=ko.observable();
            self.middleware=ko.observable();
            //if(self.rawData==null) return;
            self.readMode = true;

            self.updateModelToView = function(){
                self.rawData=app.currentBugRawData;
                if(!self.rawData) return;
                self.bugNum=self.rawData["bugNumber"];
                var data=self.rawData;
                /*
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
                 */
                self.bugType=data["type"]["name"];
                self.statusCode=data["status"]["id"];
                self.status1=data["status"]["name"];
                self.assignBy=
                    data["assignment"]["assignBy"]["firstName"] + " " +
                    data["assignment"]["assignBy"]["lastName"];
                self.assignee=
                    data["assignment"]["assignBy"]["firstName"] + " " +
                    data["assignment"]["assignBy"]["lastName"];
                self.product=data["product"]["name"];
                self.component=data["component"]["name"];
                self.subcomponent=data["subcomponent"]["name"];
                self.patchNumber=data["patch"]["patchNumber"];
                self.version=data["version"]["releaseNumber"];
                self.hardware=data["environment"]["hardwareV"]["product"]["name"];
                self.middleware=data["environment"]["middlewareV"]["product"]["name"];
                self.os=data["environment"]["osV"]["product"]["name"];
                self.cloud=data["environment"]["cloudV"]["product"]["name"];
                self.application=data["environment"]["applicationV"]["product"]["name"];
            };
            self.updateViewToModel = function(){
                var data=self.rawData;
                data["type"]["name"]=self.bugType;
                data["status"]["id"]=self.statusCode;
                data["status"]["name"]=self.status1;
                var asseignBy=self.assignBy.split(" ");
                data["assignment"]["assignBy"]["firstName"]=asseignBy[0];
                data["assignment"]["assignBy"]["lastName"]=asseignBy[1];
                var assignee=self.assignee.split(" ");
                data["assignment"]["assignBy"]["firstName"] = assignee[0];
                data["assignment"]["assignBy"]["lastName"] = assignee[1];
                data["product"]["name"]=self.product;
                data["component"]["name"]=self.component;
                data["subcomponent"]["name"]=self.subcomponent;
                data["patch"]["patchNumber"]=self.patchNumber;
                data["version"]["releaseNumber"]=self.version;
                data["environment"]["hardwareV"]["product"]["name"]=self.hardware;
                data["environment"]["middlewareV"]["product"]["name"]=self.middleware;
                data["environment"]["osV"]["product"]["name"]=self.os;
                data["environment"]["cloudV"]["product"]["name"]=self.cloud;
                data["environment"]["applicationV"]["product"]["name"]=self.application;
                console.log(data);
            };
            self.editableInputTextIds=["BugTypeInput","assignBy","Assignee","Product","Component",
            "SubComponent","PatchNumber","Version","Hardware","Middleware","OperatingSystem","Cloud",
            "Application"];
            self.editableInputNum=["Status1"];
            self.modeChanged = function(isEditMode){
                self.readMode = !isEditMode;
                for(var item in self.editableInputTextIds){
                    $("#"+self.editableInputTextIds[item]).ojInputText("option","readOnly",self.readMode);
                }
                for(var item in self.editableInputNum){
                    $("#"+self.editableInputNum[item]).ojInputNumber("option","readOnly",self.readMode);
                }
            };
            // Header Config
            var headerFactory = {
                createViewModel: function (params, valueAccessor) {
                    var model = {
                        pageTitle: app.router.currentState().label,
                        goBack: function () {
                            app.pendingAnimationType = 'navParent';
                            window.history.back();
                        },
                        handleBindingsApplied: function (info) {
                            app.adjustContentPadding();
                        },
                        editMode:"Edit",
                        isEditMode:false
                    };
                    model.buttonClick= function (data, event) {
                        var id=event.currentTarget.id;
                        if(id=="isEditMode"){
                            this.isEditMode=!this.isEditMode;
                            if(this.isEditMode==true){
                                $( "#isEditMode" ).ojButton( "option", "label", "Read" );
                                $( "#editCancel" ).ojButton( "option", "disabled", false );
                                $( "#editApply" ).ojButton( "option", "disabled", false );
                            }
                            else{
                                $( "#isEditMode" ).ojButton( "option", "label", "Edit" );
                                $( "#editCancel" ).ojButton( "option", "disabled", true );
                                $( "#editApply" ).ojButton( "option", "disabled", true );
                            }
                            self.modeChanged(this.isEditMode);
                        }
                        if(id=="editCancel"){
                            self.updateModelToView();
                        }
                        if(id=="editApply"){
                            self.updateViewToModel();
                        }
                        return true;
                    };
                    return Promise.resolve(model);
                }
            };
            self.headerConfig = {'viewName': 'bugViewHeader', 'viewModelFactory': headerFactory};

            self.handleActivated = function (info) {
                // Implement if needed
            };

            self.handleAttached = function (info) {
                // Implement if needed
            };


            self.handleBindingsApplied = function (info) {
                // Implement if needed
            };


            self.handleDetached = function (info) {
                // Implement if needed
            };
            self.status1 = "AA";
            this.commentValue1 = ko.observable("Sam     2016-1-1 19:30");
            this.commentValue2 = ko.observable("Lily    2016-1-2 07:00      Reply@Sam");
            this.commentValue3 = ko.observable("Sam     2016-1-5 21:00      Reply@Lily");
            this.commentValue4 = ko.observable("Emma    2016-1-5 21:05      Reply@Sam");
            this.commentValue5 = ko.observable("Sam     2016-1-6 09:00     Reply@Emma");
            oj.Router.sync().then(
                function () {
                    self.bugNum = app.router.retrieve();
                    self.rawData=app.currentBugRawData;
                    self.updateModelToView();
                }
            );
        }
        return new BugViewModel();
    }
);
