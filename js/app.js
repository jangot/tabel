"use strict";

angular
    .module('table', ['tableFilters', 'ui.state'])
    .config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
    .config(function($stateProvider){
        $stateProvider
            .state('index', {
                url: "", // root route
                views: {
                    "viewTable": {
                        templateUrl: "/table.html"
                    }
                }
            })
    })
;