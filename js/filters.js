angular.module('paginator', []).filter('list', function() {
    return function(input) {
        var result = [];
        for (var i = 0; i < input; i++) {
            result.push(i)
        }
        return result;
    };
});
