"use strict";

function RootCtrl($scope) {
    $scope.tables = [1];

    $scope.add = function() {
        $scope.tables.push(1);
    }
}

function TableCtrl($scope, $http, $filter) {

    var MAX_ITEMS = 50;
    var SMALL_TYPE = 'small';
    var LARGE_TYPE = 'large';
    var THEIR_TYPE = 'their';
    var DATA_URL = 'http://thethz.com/dataset.php?type=';
    var BROKEN_FILE_MASSAGE = 'Broken file.'

    /**
     * Header columns
     *
     * @type {{object}}
     */
    $scope.head = {};

    /**
     * All row in table
     *
     * @type {Array}
     */
    $scope.body = [];

    /**
     * Showed row in table
     *
     * @type {Array}
     */
    $scope.currentItems = [];

    /**
     * Search string
     * @type {string}
     */
    $scope.query = ''

    /**
     * Rows after filter
     *
     * @type {Array}
     */
    $scope.filterItems = [];

    /**
     * Current page position
     *
     * @type {number}
     */
    $scope.currentPosition = 0;

    /**
     * List of pages
     *
     * @type {Array}
     */
    $scope.pages = [];

    /**
     * File types
     * 
     * @type {{object}}
     */
    $scope.types = {};
    $scope.types[SMALL_TYPE] = 'Small';
    $scope.types[LARGE_TYPE] = 'Large';
    $scope.types[THEIR_TYPE] = 'Their';

    /**
     * Sort column
     *
     * @type {index}
     */
    $scope.sortBy = null;

    /**
     * Revers sort
     *
     * @type {boolean}
     */
    $scope.sortRevers = false;
    /**
     * Selected file type
     * 
     * @type {string | null}
     */
    $scope.selectedType = 'small';

    $scope.selectedItem = null;

    $scope.selectItem = function(item) {
        $scope.selectedItem = item;
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
        var maxPosition = $scope.filterItems.length / MAX_ITEMS;
        if (position > maxPosition || position < 0) {
            return;
        }
        $scope.currentPosition = position;
        updateCurrentItems();
    }

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
        if (type == THEIR_TYPE) {
            loadFile(function(e, data) {
                if (e) {
                    alert(BROKEN_FILE_MASSAGE);
                    return;
                }
                $scope.selectedType = type;
                setData(data);
                $scope.$apply();
            });
        } else {
            $http.get(DATA_URL + type).success(function(data) {
                $scope.selectedType = type;
                setData(data);
            });
        }
    }

    $scope.sort = function(index) {
        if ($scope.sortBy == index) {
            $scope.sortRevers = !$scope.sortRevers;
        } else {
            $scope.sortRevers = false;
        }
        $scope.sortBy = index;

        $scope.body.sort(function(a, b) {
            if (a[index] < b[index]) {
                return $scope.sortRevers ? 1 : -1;
            } else if (a[index] > b[index]) {
                return $scope.sortRevers ? -1 : 1;
            } else {
                return 0;
            }
        });
        $scope.search();
    }

    function setData(data) {
        $scope.head = data.shift();
        $scope.body = data;
        $scope.filterItems = data;
        $scope.currentPosition = 0;
        $scope.query = '';
        $scope.sortBy = null;
        $scope.selectedItem = null;
        updateCurrentItems();
    }

    function updateCurrentItems() {
        var newCurrentItems = [];
        var items = $scope.filterItems;

        var start = MAX_ITEMS * $scope.currentPosition;
        var finish = start + MAX_ITEMS;
        for (var i = start; i < finish; i++) {
            if (!items[i]) {
                break;
            }
            newCurrentItems.push(items[i]);
        }
        $scope.currentItems = newCurrentItems;
        $scope.pages.length = Math.ceil(items.length / MAX_ITEMS);
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
    }

    function loadFile(cb) {
        var r = new FileReader();
        r.onload = function (oFREvent) {
            var text = oFREvent.target.result;
            try {
                var data = JSON.parse(text);
            } catch (e) {
                cb(e)
                return;
            }
            cb(null, data);
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
