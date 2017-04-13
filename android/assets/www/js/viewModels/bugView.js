/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojknockout','ojs/ojtabs', 'ojs/ojconveyorbelt','ojs/ojselectcombobox'],
    function (oj, ko, $, app) {

        function BugViewModel() {
            var self = this;
            self.rawData=app.currentBugRawData;
            self.bugNum=ko.observable();
            self.bugType=ko.observable();
            self.statusCode=ko.observable();
            self.status1=ko.observable();
            self.priority=ko.observable();
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

            self.bugTypes = ko.observableArray(app.bugTypes);
            self.status1s = ko.observableArray(app.status1s);
            self.priorities= ko.observableArray(app.priorities);

            self.updateModelToView = function(){
                self.rawData=app.currentBugRawData;
                var data=self.rawData;
                $.ajax({
                    type: "GET",
                    url: app.baseUrl + "priority/searchAllPriority",
                    success: function (jsonResponse) {
                        self.priorities=[];
                        for(var i in jsonResponse) {
                            self.priorities.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
                            self.priority(data["priority"]["name"]);
                        }
                    }
                });
                $.ajax({
                    type: "GET",
                    url: app.baseUrl + "status/searchAllStatus",
                    success: function (jsonResponse) {
                        self.status1s=[];
                        for(var i in jsonResponse) {
                            self.status1s.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
                            self.statusCode=data["status"]["id"];
                            self.status1=data["status"]["name"];
                        }
                    }
                });
                $.ajax({
                    type: "GET",
                    url: app.baseUrl + "type/searchAllType",
                    success: function (jsonResponse) {
                        self.bugTypes=[];
                        for(var i in jsonResponse) {
                            self.bugTypes.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
                            self.bugType=data["type"]["name"];
                        }
                    }
                });
                if(!self.rawData) return;
                console.log(self);
                self.priority=data["priority"]["name"];
                self.statusCode=data["status"]["id"];
                self.status1=data["status"]["name"];
                self.bugType=data["type"]["name"];
                self.bugNum=self.rawData["bugNumber"];



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

                /*$.post(app.baseUrl+"bug/updateBug/",JSON.stringify(data),function(res){
                    console.log(res);
                },'json');*/
                console.log(JSON.stringify(data));
                $.ajax({
                    type:"POST",
                    url:app.baseUrl+"bug/updateBug/",
                    contentType:"application/json;charset=utf-8",
                    data:JSON.stringify(data),
                    success:function(res){
                            console.log(res);
                    }
                })
            };
            self.editableInputTextIds=["assignBy","Assignee","Product","Component",
            "SubComponent","PatchNumber","Version","Hardware","Middleware","OperatingSystem","Cloud",
            "Application"];
            self.editableInputNum=[];
            self.editableSelects=["BugTypeInput","Status1","Priority"];
            self.modeChanged = function(isEditMode){
                self.readMode = !isEditMode;
                for(var item in self.editableInputTextIds){
                    $("#"+self.editableInputTextIds[item]).ojInputText("option","readOnly",self.readMode);
                }
                for(var item in self.editableInputNum){
                    $("#"+self.editableInputNum[item]).ojInputNumber("option","readOnly",self.readMode);
                }
                for(var item in self.editableSelects){
                    $("#"+self.editableSelects[item]).ojSelect("option","disabled",self.readMode);
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
                self.updateModelToView();
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
            this.commentValue1 = ko.observable("Sam     2016-1-1 19:30");
            this.commentValue2 = ko.observable("Lily    2016-1-2 07:00      Reply@Sam");
            this.commentValue3 = ko.observable("Sam     2016-1-5 21:00      Reply@Lily");
            this.commentValue4 = ko.observable("Emma    2016-1-5 21:05      Reply@Sam");
            this.commentValue5 = ko.observable("Sam     2016-1-6 09:00     Reply@Emma");
            oj.Router.sync().then(
                function () {
                    self.rawData=app.currentBugRawData;
                    self.updateModelToView();
                }
            );
        }
        return new BugViewModel();
    }
);
