/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore','knockout','ojs/ojrouter', 'ojs/ojarraytabledatasource', 'ojs/ojmoduleanimations'],
    function (oj,ko) {
        function ControllerViewModel() {
            var self = this;
            self.baseUrl="http://10.191.3.164:7101/SmartBugDBBackEnd/";

            // Save the theme so we can perform platform specific navigational animations
            var platform = oj.ThemeUtils.getThemeTargetPlatform();
            // Router setup
            self.router = oj.Router.rootInstance;

            self.router.configure({
                "signin": {label: 'signin'},
                'home': {label: 'Home', isDefault: true},
                'create': {label: 'Create'},
                'search': {label: 'Search'},
                'mybugdb': {label: 'MyBugDB'},
                'bugView': {label: "bugView"},
                'SearchResult':{label: 'SearchResult'}
            });

            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
            // Callback function that can return different animations based on application logic.
            function switcherCallback(context) {
                if (platform === 'android')
                    return 'fade';
                return null;
            };

            function mergeConfig(original) {
                return $.extend(true, {}, original, {
                    'animation': oj.ModuleAnimations.switcher(switcherCallback)
                });
            }

            self.moduleConfig = mergeConfig(self.router.moduleConfig);

            // Navigation setup
            var navData = [
                {
                    name: 'Home', id: 'home',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
                },
                // {
                //     name: 'Create', id: 'create',
                //     iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
                // },
                {
                    name: 'Search', id: 'search',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'
                },
                {
                    name: 'MyBugDb', id: 'mybugdb',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'
                }
            ];
            self.navData = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});
            //self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});
            self.navDataSource=self.navData;
            // Header Setup
            self.getHeaderModel = function () {
                var headerFactory = {
                    createViewModel: function (params, valueAccessor) {
                        var model = {
                            pageTitle: self.router.currentState().label,
                            handleBindingsApplied: function (info) {
                                // Adjust content padding after header bindings have been applied
                                self.adjustContentPadding();
                            }
                        };
                        return Promise.resolve(model);
                    }
                }
                return headerFactory;
            }

            // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions.
            // This method should be called whenever your fixed region height may change.  The application
            // can also adjust content paddings with css classes if the fixed region height is not changing between
            // views.
            self.adjustContentPadding = function () {
                var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
                var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
                var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];
                if (topElem) {
                    contentElem.style.paddingTop = topElem.offsetHeight + 'px';
                }
                if (bottomElem) {
                    contentElem.style.paddingBottom = bottomElem.clientHeight + 'px';
                }
                // Add oj-complete marker class to signal that the content area can be unhidden.
                // See the override.css file to see when the content area is hidden.
                contentElem.classList.add('oj-complete');
            }

            self.gotoBugView = function(bugNum){
                $.getJSON('searchByNumber'+bugNum+'.json',
                    function (jsonResponse) {
                        self.router.store(bugNum);
                        self.currentBugRawData=jsonResponse;
                        self.router.go("bugView");
                    });
            };
        }

        return new ControllerViewModel();
    }
);
