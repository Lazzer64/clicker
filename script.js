var app = angular.module('App', ['ngRoute']); 
app.config(function($routeProvider) {
    $routeProvider  
        .otherwise( {
            templateUrl: 'clicker.html'
        });
});

app.controller('ClickerCtrl', function($scope, $interval) {
    $scope.shopUnlock = 10;
    $scope.score = 0;
    $scope.money = 0;
    $scope.critChance = 0;
    $scope.clicksPerSecond = 0;
    $scope.clickMod = 1;
    $scope.clickPower = 1;

    $scope.upgrade = function(opts){
        $scope.clickPower += opts.amnt;
    };

    $scope.autoclicker = function(opts){
        $scope.clicksPerSecond += opts.clicks;
    };

    $scope.increaseCrit = function(opts){
        $scope.critChance += opts.amnt;
    };

    $scope.shop = {
        'upgrade':  { name: 'Upgrade Clicker',       amnt: 0, price: 20,   use: $scope.upgrade,      params:{amnt:1},     unlock: 10  },
        'auto1':    { name: 'Auto Clicker',          amnt: 0, price: 50,   use: $scope.autoclicker,  params:{clicks:1},   unlock: 20  },
        'auto2':    { name: 'Super Auto Clicker',    amnt: 0, price: 200,  use: $scope.autoclicker,  params:{clicks:5},   unlock: 100 },
        'auto3':    { name: 'Uber Auto minion',      amnt: 0, price: 1000, use: $scope.autoclicker,  params:{clicks:25},  unlock: 500 },
        'crit':     { name: 'Critical Click Chance', amnt: 0, price: 1, use: $scope.increaseCrit, params:{amnt:0.01},  unlock: 0 }
    };

    $interval( function(){
        $scope.click($scope.clicksPerSecond);
    }, 1000);

    $scope.rollCrit = function(){
        if ($scope.score < $scope.shopUnlock) return 0;
        var roll = Math.random()
        var crit = (roll < $scope.critChance);
        console.log(roll);
        return crit;
    };

    $scope.click = function (amnt) {
        var mult = 1;
        if ($scope.rollCrit()) mult += 1;
        $scope.score += amnt * mult;
        $scope.money += amnt * mult;
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
