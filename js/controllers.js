"use strict";



function TableCtrl($scope, $http, $filter) {
    $scope.head = {};
    $scope.body = [];
    $scope.currentItems = [];
    $scope.query = ''
    $scope.filterItems = [];
    $scope.currentPosition = 0;
    $scope.maxItems = 50;
    $scope.pages = [];
    $scope.selectedType = 'small';
    $scope.types = {
        small : 'Small',
        large : 'Large',
        their : 'Their'
    }

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
        var maxPosition = $scope.filterItems.length / $scope.maxItems;
        if (position > maxPosition || position < 0) {
            return;
        }
        $scope.currentPosition = position;
        updateCurrentItems();
    };

    $scope.search = function() {
        if ($scope.query) {
            $scope.filterItems = filterByString($scope.body, $scope.query);
            $scope.currentPosition = 0;
        } else {
            $scope.filterItems = $scope.body;
        }
        updateCurrentItems();
    }

    $scope.load = function(type) {
        if (!$scope.types[type]) {
            return;
        }
        $scope.selectedType = type;
        if (type == 'their') {
            loadFile(function(data) {
                setData(data);
                $scope.$apply()
            });
        } else {
            $http.get('http://thethz.com/dataset.php?type=' + type).success(function(data) {
                setData(data);
            });
        }
    }



     function setData(data) {
        $scope.head = data.shift();
        $scope.body = data;
        $scope.filterItems = data;
        $scope.currentPosition = 0;
        $scope.query = '';
        updateCurrentItems();
    }

    function updateCurrentItems() {
        var newCurrentItems = [];
        var items = $scope.filterItems;

        var start = $scope.maxItems * $scope.currentPosition;
        var finish = start + $scope.maxItems;
        for (var i = start; i < finish; i++) {
            if (!items[i]) {
                break;
            }
            newCurrentItems.push(items[i]);
        }
        $scope.currentItems = newCurrentItems;
        $scope.pages.length = Math.ceil(items.length / $scope.maxItems);
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

    function loadFile(cb) {
        var r = new FileReader();
        r.onload = function (oFREvent) {
            var text = oFREvent.target.result;
            cb(JSON.parse(text))
        };

        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.onchange = function(e) {
            var file = e.target.files[0];
            r.readAsText(file);
        }
        fileSelector.click();
    }
}
