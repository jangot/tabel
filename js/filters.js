angular.module('tableFilters', []).filter('revers', function() {
    return function(input) {
        return input ? '\u2B06' : '\u2B07';
    };
});
