"use strict";

angular.module('table', ['TableServices']).
    config(['$httpProvider', function($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);