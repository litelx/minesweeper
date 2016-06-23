"use strict";



var mymod = angular.module("mymodule", []);
//
// mymod.run(function udi($rootScope) {
//     $rootScope.x = "ROOT!";
// });


mymod.controller("CalcController", function CalcController($scope) {
    var east_layout = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    var won = east_layout.length - 10;

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
    shuffle(east_layout);

    $scope.board = [];

    for (var i = 0; i < east_layout.length; i++) {
        var row = [];
        for (var j = 0; j < 10; j++) {
            if (east_layout[i] === 1){
                row.push({mine: true, display: ''});
            }
            else {
                row.push({mine: false, display: ''});
            }
            i++;
        }
        $scope.board.push(row);
    }

    $scope.ans = function (row, col) {
        if (!$scope.board[row][col].flag) {
            if ($scope.board[row][col].mine === true) {
                $scope.board[row][col].bomb = true;
                $("#won").append("GAME OVER!!!");

            }
            else {
                var num = f(row, col, $scope.board.length, $scope.board[0].length, $scope.board);
                if (num === 0) {
                    $scope.zeroes(row, col);
                    $scope.board[row][col].color = "n" + num;
                }
                else {
                    $scope.board[row][col].display = num;
                    $scope.board[row][col].color = "n" + num;
                    won--;
                }
            }

            $scope.zeroes = function (row, col) {
                if (row < $scope.board.length && row > -1 && col < $scope.board[0].length && col > -1) {
                    if ($scope.board[row][col].display === "") {
                        var o = f(row, col, $scope.board.length, $scope.board[0].length, $scope.board);
                        $scope.board[row][col].display = o;
                        won--;
                        $scope.board[row][col].color = "n" + o;
                        if (o === 0) {
                            $scope.zeroes(row - 1,  col - 1);
                            $scope.zeroes(row - 1,  col);
                            $scope.zeroes(row - 1,  col + 1);
                            $scope.zeroes(row,      col - 1);
                            $scope.zeroes(row,      col + 1);
                            $scope.zeroes(row + 1,  col - 1);
                            $scope.zeroes(row + 1,  col);
                            $scope.zeroes(row + 1,  col + 1);
                        }
                    }
                }
            }
        }
        if (won === 0){
            $("#won").append("WON!!!");
        }
    };
    function f(ln_index, cl_index, ln, cl, layout) {
                if(ln_index >= 0 && cl_index >= 0 && ln_index < ln && cl_index < cl) {
                    var counter = 0;
                    for (var i = ln_index - 1; i <= ln_index + 1; i++) {
                        for (var j = cl_index - 1; j <= cl_index + 1; j++) {
                            if (i >= 0 && i < ln && j >= 0 && j < cl) {
                                if (i === ln_index && j === cl_index) {
                                    continue;
                                }
                                if (layout[i][j].mine === true) {
                                    counter++;
                                }
                            }
                        }
                    }
                    return counter;
                }
                return -1;
            }

    $scope.right = function (row, col) {
        if (!$scope.board[row][col].bomb && $scope.board[row][col].display === "" ) {
            $scope.board[row][col].flag = !$scope.board[row][col].flag;
            if ($scope.board[row][col].flag === true){
                won--;
            }
            else {won++;}
        }
    };
});



mymod.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
