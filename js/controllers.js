"use strict";



function TableCtrl($scope, $http, $filter) {
    $scope.head = {};
    $scope.body = [];
    $scope.currentItems = [];
    $scope.currentPosition = 0;
    $scope.maxItems = 50;
    $scope.pages = [];

    $scope.prev = function() {
        if ($scope.currentPosition > 0) {
            $scope.currentPosition--;
            updateCurrentItems();
        }
    }
    $scope.next = function() {
        if ($scope.currentPosition < $scope.pages.length - 1) {
            $scope.currentPosition++;
            updateCurrentItems();
        }
    }
    $scope.setPosition = function(position) {
        var maxPosition = $scope.body.length / $scope.maxItems;
        if (position > maxPosition || position < 0) {
            return;
        }
        $scope.currentPosition = position;

    };

    $scope.search = function() {
        updateCurrentItems();
    }
    $http.get('http://thethz.com/dataset.php?type=large').success(function(data) {
        $scope.head = data.shift();
        $scope.body = data;
        updateCurrentItems();
    });

    function updateCurrentItems() {
        var newCurrentItems = [];
        var items = $scope.body;

        if ($scope.query) {
            items = filterByString(items, $scope.query);
        }

        var start = $scope.maxItems * $scope.currentPosition;
        var finish = start + $scope.maxItems;
        for (var i = start; i < finish; i++) {
            if (!items[i]) {
                break;
            }
            newCurrentItems.push(items[i]);
        }
        $scope.currentItems = newCurrentItems;

        $scope.pages.length = Math.ceil($scope.body.length / $scope.maxItems);
    }

    function filterByString(items, query) {
        return $filter('filter')(items, function (item) {
            for(var attr in item) {
                var search = item[attr].toLowerCase().indexOf(query.toLowerCase()) !== -1
                if (search) {
                    return true;
                }
            }
            return false;
        });
    };
}
