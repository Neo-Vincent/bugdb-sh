/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your customer ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojbutton', 'ojs/ojknockout','ojs/ojtabs', 'ojs/ojconveyorbelt','ojs/ojselectcombobox','promise', 'ojs/ojlistview','ojs/ojarraytabledatasource'],
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
            self.updateTime=ko.observable();
            //if(self.rawData==null) return;
            self.readMode = true;

            self.bugTypes = ko.observableArray(app.bugTypes);
            self.status1s = ko.observableArray(app.status1s);
            self.priorities= ko.observableArray(app.priorities);
//            self.rawData=app.currentBugRawData;
            self.rawData = {"assignment":{"assignBy":{"city":"Beijing","country":"China","email":"1_Ext_Org101@oracle.com","firstName":"1_Ext_Org101_Firstname","id":10001,"lastName":"1_Ext_Org101_Lastname","office":"100 Shanghai Road","organization":{"id":101,"isExternal":"Y","name":"1 - External"},"phone":"+86-10-1010-1010","stateProvince":"Beijing","title":"Developer"},"assignDate":"2017-04-05T10:28:32+08:00","assignTo":{"city":"Shanghai","country":"China","email":"1_Ora_Org1@oracle.com","firstName":"1_Ora_Org1_Firstname","id":1,"lastName":"1_Ora_Org1_Lastname","office":"100 Beijing Road","organization":{"id":1,"isExternal":"N","name":"1 - Oracle"},"phone":"+86-21-2121-2121","stateProvince":"Shanghai","title":"Developer"},"estimateP":{"id":18,"patchNumber":"0003","releaseDate":"2017-03-01T00:00:00+08:00","version":{"id":4,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2017-03-01T00:00:00+08:00","releaseNumber":"12.2"}},"estimateV":{"id":4,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2017-03-01T00:00:00+08:00","releaseNumber":"12.2"},"id":1},"bugNumber":1,"commentList":[{"commentBy":{"city":"Beijing","country":"China","email":"1_Ext_Org101@oracle.com","firstName":"1_Ext_Org101_Firstname","id":10001,"lastName":"1_Ext_Org101_Lastname","office":"100 Shanghai Road","organization":{"id":101,"isExternal":"Y","name":"1 - External"},"phone":"+86-10-1010-1010","stateProvince":"Beijing","title":"Developer"},"commentDate":"2017-03-31T13:30:25+08:00","details":"Please check BUG1","id":1},{"commentBy":{"city":"Shanghai","country":"China","email":"1_Ora_Org1@oracle.com","firstName":"1_Ora_Org1_Firstname","id":1,"lastName":"1_Ora_Org1_Lastname","office":"100 Beijing Road","organization":{"id":1,"isExternal":"N","name":"1 - Oracle"},"phone":"+86-21-2121-2121","stateProvince":"Shanghai","title":"Developer"},"commentDate":"2017-04-03T09:20:25+08:00","details":"BUG1 is under consideration.","id":20001,"replyToComment":1},{"commentBy":{"city":"Beijing","country":"China","email":"1_Ext_Org101@oracle.com","firstName":"1_Ext_Org101_Firstname","id":10001,"lastName":"1_Ext_Org101_Lastname","office":"100 Shanghai Road","organization":{"id":101,"isExternal":"Y","name":"1 - External"},"phone":"+86-10-1010-1010","stateProvince":"Beijing","title":"Developer"},"commentDate":"2017-03-31T10:30:25+08:00","details":"Hello world","id":40001,"replyToComment":10}],"component":{"id":1,"name":"1_Com_Prod1","product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"}},"createDate":"2017-03-31T10:30:25+08:00","createUser":{"city":"Beijing","country":"China","email":"1_Ext_Org101@oracle.com","firstName":"1_Ext_Org101_Firstname","id":10001,"lastName":"1_Ext_Org101_Lastname","office":"100 Shanghai Road","organization":{"id":101,"isExternal":"Y","name":"1 - External"},"phone":"+86-10-1010-1010","stateProvince":"Beijing","title":"Developer"},"details":"PRODUCT1|COMPONENT1|SUBCOMPONENT1 IS NOT WORKING FOR REASON 1","environment":{"applicationP":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"applicationV":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"},"cloudP":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"cloudV":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"},"dbP":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"dbV":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"},"hardwareP":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"hardwareV":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"},"id":1,"middlewareP":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"middlewareV":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"},"notes":"Some comments for bug environment.","osP":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"osV":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"id":1,"lastUpdateDate":"2017-04-05T16:28:32+08:00","lastUpdateUser":{"city":"Shanghai","country":"China","email":"1_Ora_Org1@oracle.com","firstName":"1_Ora_Org1_Firstname","id":1,"lastName":"1_Ora_Org1_Lastname","office":"100 Beijing Road","organization":{"id":1,"isExternal":"N","name":"1 - Oracle"},"phone":"+86-21-2121-2121","stateProvince":"Shanghai","title":"Developer"},"name":"PRODUCT1|COMPONENT1|SUBCOMPONENT1 IS NOT WORKING.","patch":{"id":12,"patchNumber":"0002","releaseDate":"2017-02-01T00:00:00+08:00","version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}},"priority":{"id":2,"name":"2 - Severe Loss of Service"},"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"status":{"id":1,"name":"1_Status"},"subcomponent":{"component":{"id":1,"name":"1_Com_Prod1","product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"}},"id":1,"name":"1_Subcom_Com1"},"tagBugList":[{"bugID":1,"id":1,"tag":{"id":1,"name":"1_TAG"}},{"bugID":1,"id":2,"tag":{"id":2,"name":"2_TAG"}}],"traceList":[{"bugID":1,"id":40001,"operation":"CHANGE","operationDate":"2017-03-31T15:30:25+08:00","operationDetails":"from 2 to 3","operationObject":"STATUS","operationUser":{"city":"Beijing","country":"China","email":"1_Ext_Org101@oracle.com","firstName":"1_Ext_Org101_Firstname","id":10001,"lastName":"1_Ext_Org101_Lastname","office":"100 Shanghai Road","organization":{"id":101,"isExternal":"Y","name":"1 - External"},"phone":"+86-10-1010-1010","stateProvince":"Beijing","title":"Developer"}},{"bugID":1,"id":60001,"operation":"CHANGE","operationDate":"2017-04-03T10:00:25+08:00","operationDetails":"FROM 3 TO 1","operationObject":"STATUS","operationUser":{"city":"Shanghai","country":"China","email":"1_Ora_Org1@oracle.com","firstName":"1_Ora_Org1_Firstname","id":1,"lastName":"1_Ora_Org1_Lastname","office":"100 Beijing Road","organization":{"id":1,"isExternal":"N","name":"1 - Oracle"},"phone":"+86-21-2121-2121","stateProvince":"Shanghai","title":"Developer"}}],"type":{"id":2,"name":"Enhancement"},"version":{"id":3,"product":{"category":{"id":1,"name":"STORAGE"},"id":1,"isExternal":"N","name":"1_Ora_Cat1"},"releaseDate":"2016-03-01T00:00:00+08:00","releaseNumber":"12.1"}};

            self.updateModelToView = function(){
//                self.rawData=app.currentBugRawData;
                var data=self.rawData;
                $.ajax({
                    type: "GET",
                    url: app.baseUrl + "priority/searchAllPriority",
                    success: function (jsonResponse) {
                        self.priorities=[];
                        for(var i in jsonResponse) {
                            self.priorities.push({value:jsonResponse[i]["id"],label:jsonResponse[i]["name"]});
                            self.priority=data["priority"]["name"];
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
            self.data = [];
            for (var index in self.rawData.commentList){
                   console.log(index);
                   var a =self.rawData.commentList;
                   var nameA = a[index].commentBy.firstName+a[index].commentBy.lastName;
                   var timeA = a[index].commentDate;
                   var commentA = a[index].details;
                   self.data.push({name: nameA, time: timeA, comment: commentA});
            }


            self.dataSource=  new oj.ArrayTableDataSource(self.data, {idAttribute: "name"});
            self.commentBoard = ko.observable();
            self.commentclick = function(data, event) {

                this.data.push({name: 'ming he', time: '...', comment: self.commentBoard()});
                $( "#listview" ).ojListView({ "data": new oj.ArrayTableDataSource(this.data)});
                self.commentBoard = ko.observable("");
                //self.dataSource=  new oj.ArrayTableDataSource(self.data, {idAttribute: "name"});
            }



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
