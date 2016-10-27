var app = angular.module('App', ['ngRoute']); 
app.config(function($routeProvider) {
    $routeProvider  
        .otherwise( {
            templateUrl: 'clicker.html'
        });
});

app.controller('ClickerCtrl', function($scope, $interval) {
    $scope.score = 0;
    $scope.money = 0;
    $scope.clicksPerSecond = 0;
    $scope.clickPower = 10;

    $scope.upgrade = function(opts){
        $scope.clickPower += opts.amnt;
    }

    $scope.autoclicker = function(opts){
        $scope.clicksPerSecond += opts.clicks;
    }

    $scope.shop = {
        'upgrade':  { name: 'Upgrade',       amnt: 0, price: 10,   use: $scope.upgrade,     params:{amnt:1},     unlock: 20  },
        'auto1':    { name: 'Minion',        amnt: 0, price: 50,   use: $scope.autoclicker, params:{clicks:1},   unlock: 20  },
        'auto2':    { name: 'Super minion',  amnt: 0, price: 200,  use: $scope.autoclicker, params:{clicks:5},   unlock: 100 },
        'auto3':    { name: 'Uber minion',   amnt: 0, price: 1000, use: $scope.autoclicker, params:{clicks:25},  unlock: 500 }
    };

    $interval( function() {
        $scope.click($scope.clicksPerSecond);
    }, 1000);

    $scope.click = function (amnt) {
        $scope.score += amnt;
        $scope.money += amnt;
    };

    $scope.spend = function (amnt) {
        $scope.money -= amnt;
    };

    $scope.buy = function (item) {
        if($scope.money < item.price) return;
        $scope.spend(item.price);
        item.amnt++;
        if(item.use) item.use(item.params);
    };
});
