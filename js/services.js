"use strict";

angular.module('TableServices', []).
    factory('Table', function(){
        return {
            create : function(data) {
                var table = {
                    head : data.shift(),
                    body : data,
                    currentItems : getItems(),
                    pageNumber : 0,
                    pages : [],
                    maxItems : 50

                }

                return table;
            }
        }
    });
;
