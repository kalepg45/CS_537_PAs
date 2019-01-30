var app =   angular.module('myApp',['ngRoute', 'ngAnimate']);


app.controller('navController', function ($scope){});

app.controller('PA0_controller', function($scope){
    $scope.encrypt = function(plaintext){
      var ciphertext = "";
      for(var i=0;i<plaintext.length;i++){
        if(plaintext[i]>='a'&&plaintext[i]<='z')
          ciphertext += String.fromCharCode(25 - plaintext.charCodeAt(i) + 2*97);
        else if(plaintext[i]>='A'&&plaintext[i]<='Z')
          ciphertext += String.fromCharCode(25 - plaintext.charCodeAt(i) + 2*65);
        else
          ciphertext += plaintext[i];
      }
      return ciphertext;
    }
    $scope.decrypt = function(ciphertext){
      var plaintext = "";
      for(var i=0;i<ciphertext.length;i++){
        if(ciphertext[i]>='a'&&ciphertext[i]<='z')
          plaintext += String.fromCharCode(25 - ciphertext.charCodeAt(i) + 2*97);
        else if(ciphertext[i]>='A'&&ciphertext[i]<='Z')
          plaintext += String.fromCharCode(25 - ciphertext.charCodeAt(i) + 2*65);
        else
          plaintext += ciphertext[i];
      }
      return plaintext;
    }
    $scope.plaintext_change = function(){
      $scope.ciphertext = $scope.encrypt($scope.plaintext);
    }
    $scope.ciphertext_change = function(){
      $scope.plaintext = $scope.decrypt($scope.ciphertext);
    }
});

app.controller('PA2_controller', function($scope){
    $scope.equal_key_change = function(){
      if($scope.equal_key)
        $scope.key_2 = $scope.key_1;
    }
    $scope.equal_plaintext_change = function(){
      if($scope.equal_plaintext)
        $scope.plaintext_2 = $scope.plaintext_1;
    }
    $scope.ascii_2_bit = function(p){
      
    }
    $scope.plaintext_1_change = function(){
      $scope.ciphertext_1 = $scope.encrypt($scope.plaintext_1);
    }
    $scope.plaintext_2_change = function(){
      $scope.ciphertext_2 = $scope.encrypt($scope.plaintext_2);
    }
    $scope.ciphertext_1_change = function(){
      $scope.plaintext_1 = $scope.decrypt($scope.ciphertext_1);
    }
    $scope.ciphertext_2_change = function(){
      $scope.plaintext_2 = $scope.decrypt($scope.ciphertext_2);
    }
    $scope.encrypt = function(plaintext){
      plaintext = ascii_2_bit(plaintext);
      //
    }
    $scope.decrypt = function(ciphertext){
      ciphertext = ascii_2_bit(ciphertext);
      //
    }
});

//Define route for site
app.config(['$routeProvider',function ($routeProvider){
    $routeProvider
        .when('/',{
            title: 'home',
            templateUrl: 'templates/home.html'
        })
        .when('/PA0',{
            title: 'PA0',
            templateUrl: 'templates/PA0.html'
        })
        .when('/PA1',{
            title: 'PA1',
            templateUrl: 'templates/PA1.html'
        })
        .when('/PA2',{
            title: 'PA2',
            templateUrl: 'templates/PA2.html'
        })
        .otherwise({
            redirectTo: 'templates/notfound.html'
        });
}]);