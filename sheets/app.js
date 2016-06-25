"use strict";


var mymod = angular.module("mymodule", []);

mymod.controller("CalcController", function CalcController($scope, $interval) {
    var easy = {width: 8, height: 8, mines: 10};
    var regular = {width: 16, height: 16, mines: 40};
    var expert = {width: 30, height: 16, mines: 99};
    const mines = 10;
    var width = 8;
    var height = 8;
    $scope.remained_flags = mines;
    var layout = [];
    for (var i = 0; i < mines; i++) {
        layout.push({mine: true, display: ''});
    }
    for (var i = 0; i < width * height - mines; i++) {
        layout.push({mine: false, display: ''});
    }

    shuffle(layout);

    var won = width * height - mines;// easy_layout.length;
    $scope.board = [];

    while (layout.length > 0) {
        $scope.board.push(layout.splice(0, width));
    }

    $scope.leftClick = function (row, col) {
        if (won === 0 || won === -1) {
            return;
        }
        var cell = $scope.board[row][col];

        if (cell.flag) {
            return;
        }

        if (cell.mine) {
            for (var i = 0; i < $scope.board.length; i++) {
                for (var j = 0; j < $scope.board[0].length; j++) {
                    if ($scope.board[i][j].mine && !$scope.board[i][j].flag)
                        $scope.board[i][j].bomb = true;
                    if (!$scope.board[i][j].mine && $scope.board[i][j].flag) {
                        $scope.board[i][j].flag = !$scope.board[i][j].flag;
                        $scope.board[i][j].display = 'X';
                        $scope.board[i][j].color = 'n3';
                    }
                }
            }
            cell.color = "bomb";
            won = -1;
            $scope.status = "GAME OVER!!!";
        } else {
            var num = mines_around(row, col, $scope.board.length, $scope.board[0].length, $scope.board);
            cell.color = "n" + num;
            if (num === 0) {
                $scope.zeroes(row, col);
            } else {
                cell.display = num;
                won--;
            }
        }

        if (won === 0) {
            $scope.status = "WON!!!";
        }

        // $scope.time = $interval.cancel();
        // $scope.time = 0;
        // $scope.time += $interval(function() {
        //       $scope.time += Number(1);
        //     }, 1000);

    };

    $scope.zeroes = function (row, col) {
        if (!(row < $scope.board.length && row > -1 && col < $scope.board[0].length && col > -1)) {
            return;
        }
        var cell = $scope.board[row][col];
        if (cell.display !== "") {
            return;
        }
        var o = mines_around(row, col, $scope.board.length, $scope.board[0].length, $scope.board);
        cell.display = o;
        won--;
        cell.color = "n" + o;
        if (o === 0) {
            $scope.zeroes(row - 1, col - 1);
            $scope.zeroes(row - 1, col);
            $scope.zeroes(row - 1, col + 1);
            $scope.zeroes(row, col - 1);
            $scope.zeroes(row, col + 1);
            $scope.zeroes(row + 1, col - 1);
            $scope.zeroes(row + 1, col);
            $scope.zeroes(row + 1, col + 1);
        }
    };

    function mines_around(ln_index, cl_index, ln, cl, layout) {
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

    $scope.rightClick = function (cell) {
        if (cell.display !== "" || $scope.status) {
            return;
        }

        // if there is a flag counter decrease else increase
        $scope.remained_flags += (cell.flag === true) * 2 - 1;

        cell.flag = !cell.flag;
    };

    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    }
});


mymod.directive('ngRightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, {$event: event});
            });
        });
    };
});
