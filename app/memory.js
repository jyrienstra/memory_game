// Define the AngularJS Module
// Modules are used to
// 1. Associate an AngularJS app with part of an HTML document
// 2. Provide access to AngularJS features
// 3. Help with organization
var app1 = angular.module('memory', []);
app1.controller('boardCreator', function($scope) {
    //Default value before initGame is called
    $scope.boardSize = 1;

    //When page is loaded initGame is called
    $scope.initGame = function ($size) {
        //Set boardsize
        $scope.boardSize = $size;

        //Reset gameGrid
        $scope.gameRows = [];
        $scope.gameCols = [];
        $scope.gameGrid = [];

        $scope.characters = []; //memory charachters

        $scope.setCharachters($scope.boardSize);
        console.log($scope.characters);

        // http://www.java2s.com/Tutorials/Javascript/AngularJS_Example/Directives/2920__ng_repeat_with_key_and_value_pair.htm
        // https://blog.rjmetrics.com/2015/09/02/8-features-of-ng-repeat/

        //Create & fill grid
        for(var i = 0; i < $scope.boardSize; i++){
            $scope.gameRows[i] = i;
            $scope.gameCols[i] = i;
            $scope.gameGrid[i] = [];
            for(var j = 0; j < $scope.boardSize; j++){
                $scope.gameGrid[i].push($scope.getRandomCharachter($scope.boardSize));
            }
        }
    };

    //Generate new memory charachter based on boardsize
    $scope.setCharachters = function (boardSize) {
        var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

        for(var i=0; i < (boardSize*boardSize/2); i++){
            $scope.characters[i] = {
                char: alphabet[i],
                count: 0
            };
        }
    };

    //Return a new random character
    //Only 4 ar possible of each charachter
    //@Param bordSize Create's enough random charachters for a certain bordSize
    $scope.getRandomCharachter = function(boardSize) {
        for(var i=0; i<$scope.characters.length; i++){
            if($scope.characters[i].count == 2) {
                $scope.characters.splice(i,1);
                break;
            }
        }

        var rand = Math.floor((Math.random() * ($scope.characters.length-1)) + 0);
        $scope.characters[rand].count++;

        return $scope.characters[rand].char;
    };
});

app1.controller('boardInteraction', function($scope) {
    var clickedFields = [];

    $scope.clickField = function(value){
        //add value
        clickedFields.push(value);

        //check if we have selected 2 values and if its a valid combo
        if(clickedFields.length == 2){
            if(clickedFields[0] == clickedFields[1]){
                console.log("found a valid combination");
            }else{
                console.log("combination is wrong, try again");
                clickedFields.length = 0; //clear array
            }
        }

    }
});


//Didn't get this to work with angular
function change(){
    var fieldInactiveColor = "#" + $('#valueinactive').val();
    var gameFieldType = $('.gameField').val();
    console.log("val" + gameFieldType);
    $('.gameField').css('background-color', fieldInactiveColor);
}

// $(document).ready(function() {
//     $( ".gameField" ).click(function() {
//         console.log("why not");
//         alert( "Handler for .click() called." );
//     });
// });