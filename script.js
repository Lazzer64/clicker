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
        'upg'   : { name: 'Upgrade Clicker', amnt: 0, price: 50, use: $scope.upgrade, params:{amnt:1}, unlock: 10, max: 99 },

        'crit'  : { name: 'Critical Click Chance', amnt: 0, price: 500, use: $scope.increaseCrit, params:{amnt:0.01}, unlock: 1000, max: 25 },
        'crit2' : { name: 'Critical-er Click Chance', amnt: 0, price: 1500, use: $scope.increaseCrit, params:{amnt:0.01}, unlock: 7000, max: 25 },

        'au1'   : { name: 'Auto Clicker', amnt: 0, price: 50, use: $scope.autoclicker, params:{clicks:1}, unlock: 20 },
        'au2'   : { name: 'Super Auto Clicker', amnt: 0, price: 200, use: $scope.autoclicker, params:{clicks:5}, unlock: 100 },
        'au3'   : { name: 'Uber Auto Clicker', amnt: 0, price: 1000, use: $scope.autoclicker, params:{clicks:25}, unlock: 500 },
        'au4'   : { name: 'Uberer Auto Clicker', amnt: 0, price: 10000, use: $scope.autoclicker, params:{clicks:100}, unlock: 5000 },
        'au5'   : { name: 'Uberist Auto Clicker', amnt: 0, price: 50000, use: $scope.autoclicker, params:{clicks:600}, unlock: 10000 }
    };

    $interval( function(){
        $scope.click($scope.clicksPerSecond);
    }, 1000);

    $scope.canbuy = function(item) {
        if($scope.money < item.price) return false;
        if($scope.soldout(item)) return false;
        return true;
    }

    $scope.soldout = function(item) {
        return (item.max && item.amnt >= item.max);
    }

    $scope.rollCrit = function(){
        if ($scope.score < $scope.shopUnlock) return 0;
        var roll = Math.random()
        var crit = (roll < $scope.critChance);
        console.log(roll);
        return crit;
    };

    $scope.clickText = function(string) {
        var text = document.createElement('div');
        text.innerHTML = string;
        text.className = 'fade-out fly-up';

        var clicks  = document.getElementById('clicks')
        clicks.appendChild(text);

        text.addEventListener('webkitAnimationEnd',function(event){
            clicks.removeChild(text);
        }, false);
    }

    $scope.click = function (amnt) {
        if(amnt <= 0) return;
        var text = '+'+amnt;
        var mult = 1;

        if ($scope.rollCrit()) {
            mult += 1;
            text = 'Crit!'+text
        }

        $scope.score += amnt * mult;
        $scope.money += amnt * mult;
        $scope.clickText(text);
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
