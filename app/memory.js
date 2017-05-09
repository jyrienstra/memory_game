// Define the AngularJS Module
// Modules are used to
// 1. Associate an AngularJS app with part of an HTML document
// 2. Provide access to AngularJS features
// 3. Help with organization
var app1 = angular.module('memory', []);

app1.service('sharedProperties', function() {
    var boardSize = 0;
    var time = 0;
    var scores = [];
    var combinations = [];
    var gameFinished = false;
    var clickedFields = [];
    var valueinactive = "red";
    var valueactive = "orange";
    var valuefound = "green";
    var isGameStarted = false;

    return {
        getBoardSize: function() {
            return boardSize;
        },
        setBoardSize: function(value) {
            boardSize = value;
        },
        getTime: function(){
            return time;
        },
        setTime: function(value){
            time = value;
        },
        getScores: function(){
            return scores;
        },
        setScores: function (array) {
            scores = array;
        },
        setFoundCombinations: function (array) {
            combinations = array;
        },
        getFoundcombinations: function () {
            return combinations;
        },
        setClickedFields: function (array) {
            clickedFields = array;
        },
        getClickedFields: function () {
            return clickedFields;
        },
        setGameFinished: function (boolean) {
            gameFinished = boolean;
            isGameStarted = false;
        },
        isGameFinished: function () {
            return gameFinished;
        },
        setValueInactiveColor: function (color) {
            valueinactive = color;
        },
        setValueActiveColor: function (color) {
            valueactive = color;
        },
        setValueFoundColor: function (color) {
            valuefound = color;
        },
        getValueFoundColor: function () {
            return valuefound;
        },
        getValueActiveColor:function () {
            return valueactive;
        },
        getValueInactiveColor:function () {
            return valueinactive;
        },
        setGameStarted: function (boolean) {
            isGameStarted = boolean;
        },
        isGameStarted: function () {
            return isGameStarted;
        }
    }
});

app1.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});

app1.controller('boardCreator', function ($scope, $timeout, sharedProperties) {
    //Default value before initGame is called
    $scope.boardSize = 0;
    $scope.scores = [];
    $scope.avaragePlayingTime = 0;

    //When page is loaded initGame is called
    $scope.newGame = function (value) {
        sharedProperties.setGameFinished(false);
        $scope.resetColors();
        sharedProperties.setClickedFields([]);
        sharedProperties.setFoundCombinations([]);
        $timeout.cancel(timer); //cancel old timer
        increaseTime(); //create new timer



        //Set scores & avarage playing time
        $scope.avaragePlayingTime = calculateAvaragePlayingTime();

        //Set boardsize
        if(value){
            //use param setter (ng-init call)
            $scope.boardSize = value;
        }else{
            //get from selector
            $scope.boardSize = angular.element('#size').val();
        }
        sharedProperties.setBoardSize($scope.boardSize);


        //Reset gameGrid
        $scope.gameRows = [];
        $scope.gameCols = [];
        $scope.gameGrid = [];
        $scope.characters = []; //memory charachters
        $scope.currentTime = 0;

        $scope.setCharachters($scope.boardSize);
        //Create & fill grid
        for (var i = 0; i < $scope.boardSize; i++) {
            $scope.gameRows[i] = i;
            $scope.gameCols[i] = i;
            $scope.gameGrid[i] = [];
            for (var j = 0; j < $scope.boardSize; j++) {
                $scope.gameGrid[i].push($scope.getRandomCharachter($scope.boardSize));
            }
        }
    };

    var calculateAvaragePlayingTime = function () {
        var time = 0;
        var scores = sharedProperties.getScores();
        for(var i=0; i<scores.length; i++){
            time += scores[i].time;
        }
        if(time !=0){
            return time/scores.length;
        }
        return 0;
    };

    //Generate new memory charachter based on boardsize
    $scope.setCharachters = function (boardSize) {
        var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

        for (var i = 0; i < (boardSize * boardSize / 2); i++) {
            $scope.characters[i] = {
                char: alphabet[i],
                count: 0
            };
        }
    };

    //Return a new random character
    //Only 4 ar possible of each charachter
    //@Param bordSize Create's enough random charachters for a certain bordSize
    $scope.getRandomCharachter = function (boardSize) {
        for (var i = 0; i < $scope.characters.length; i++) {
            if ($scope.characters[i].count == 2) {
                $scope.characters.splice(i, 1);
                break;
            }
        }

        var rand = Math.floor((Math.random() * ($scope.characters.length)) + 0);
        $scope.characters[rand].count++;

        return $scope.characters[rand].char;
    };

    var timer;
    var increaseTime = function(){
        timer = $timeout(function () {
            if(!sharedProperties.isGameFinished()){
                increaseTime();
                if(sharedProperties.isGameStarted()){
                    $scope.currentTime++;
                    sharedProperties.setTime($scope.currentTime);
                }
            }
            $scope.scores = sharedProperties.getScores(); //update top 5
        }, 1000);
    };

    $scope.colorChange = function () {
        sharedProperties.setValueInactiveColor("#"+angular.element("#valueinactive").val());
        sharedProperties.setValueActiveColor("#"+angular.element("#valueactive").val());
        sharedProperties.setValueFoundColor("#"+angular.element("#valuefound").val());
        $scope.updateColors();
    }

    $scope.updateColors = function () {
        angular.element('.gameField').css('background-color', sharedProperties.getValueInactiveColor());

        var foundCombinations = sharedProperties.getFoundcombinations();

        var clickedFields = sharedProperties.getClickedFields();
        for(var i=0; i<clickedFields.length; i++){
            angular.element(clickedFields[i].event.currentTarget).css('background-color', sharedProperties.getValueActiveColor());
        }
        for(var i=0; i< foundCombinations.length; i++){
            console.log("tering raar weer")
            angular.element(foundCombinations[i].event1.currentTarget).css('background-color', sharedProperties.getValueFoundColor());
            angular.element(foundCombinations[i].event2.currentTarget).css('background-color', sharedProperties.getValueFoundColor());
        }
    }

    $scope.resetColors = function () {
        angular.element('.gameField').css('background-color', sharedProperties.getValueInactiveColor());
        angular.element('.gameValue').css('opacity', '0');

        var foundCombinations = sharedProperties.getFoundcombinations();

        var clickedFields = sharedProperties.getClickedFields();
        for(var i=0; i<clickedFields.length; i++){
            angular.element(clickedFields[i].event.currentTarget).css('background-color', sharedProperties.getValueInactiveColor());
            angular.element(clickedFields[i].event.currentTarget).css('opacity', '0');
        }
        for(var i=0; i< foundCombinations.length; i++){
            console.log("tering raar weer")
            angular.element(foundCombinations[i].event1.currentTarget).css('background-color', sharedProperties.getValueInactiveColor());
            angular.element(foundCombinations[i].event1.currentTarget).css('opacity', '0');
            angular.element(foundCombinations[i].event2.currentTarget).css('background-color', sharedProperties.getValueInactiveColor());
            angular.element(foundCombinations[i].event2.currentTarget).css('opacity', '0');

        }
    }
});

// 'use strict';
app1.controller('boardInteraction', function ($scope, $timeout, sharedProperties) {
        var clickedFields = [];
        var foundCombinations = [];
        var top5 = [];
        var isNewGame = false;

        var reset = function(){
            sharedProperties.setFoundCombinations(foundCombinations);
            clickedFields = [];
            foundCombinations = [];
        };

        $scope.clickField = function ($event, char, row, col) {
            sharedProperties.setGameStarted(true);

            if (foundCombinations.indexOf(char) !== -1) {
                console.log("combination already exists or clicking same field again");
            } else {
                //add value & change color to open card color
                var newValue = {
                    char: char,
                    event: $event,
                    row: row,
                    col: col
                };
                clickedFields.push(newValue);
                sharedProperties.setClickedFields(clickedFields);


                //Clicked field color
                angular.element($event.currentTarget).css('background-color', sharedProperties.getValueActiveColor());
                angular.element($event.currentTarget).css('opacity', '1');
            }

            //check if we have selected 2 values and if its a valid combo
            if (clickedFields.length == 2) {
                if((clickedFields[0].row != clickedFields[1].row || clickedFields[0].col != clickedFields[1].col) && clickedFields[0].char == clickedFields[1].char){
                    var newValue = {
                        char: clickedFields[0].char,
                        event1: clickedFields[0].event,
                        event2: clickedFields[1].event
                    };
                    foundCombinations.push(newValue);
                    sharedProperties.setFoundCombinations(foundCombinations);
                    angular.element(clickedFields[0].event.currentTarget).css('background-color', sharedProperties.getValueFoundColor());
                    angular.element(clickedFields[1].event.currentTarget).css('background-color', sharedProperties.getValueFoundColor());
                    angular.element('#found').html(foundCombinations.length); //somehow didn't work using {{variable}}, so hardcode it
                    console.log("found a valid combination we now have: " + foundCombinations + "as succesfull combinations");
                } else {
                    $scope.wrongCombination(clickedFields[0].event, clickedFields[1].event);
                    console.log("combination is wrong, try again");
                }
                clickedFields.length = 0; //clear array
                if(gameIsFinished()){
                    showResults(askForName());
                }
            }
        }

        var gameIsFinished = function(){
            if(foundCombinations.length == ((sharedProperties.getBoardSize()*sharedProperties.getBoardSize())/2)){
                sharedProperties.setGameFinished(true);
                reset();
                return true;
            }
            return false;
        };


        var askForName = function () {
            var name = prompt("Please enter your name", "Player");

            if (name == null || name == "") {
                console.log("nunll/");
            }
            return name;
        }

        var showResults = function (name) {
            addTop5(name);
        };

        var addTop5 = function (name) {
            if(name != null) {
                var score = {
                    name: name,
                    score: sharedProperties.getBoardSize(),
                    time: sharedProperties.getTime()
                };
                top5.push(score);
                orderTop5();
                sharedProperties.setScores(top5);
            }
        }

        //bubblesort, not very effective but only index=5
        var orderTop5 = function () {
            var stopFlag = true;
            for (var j =0; (j < top5.length) && (stopFlag==true); j++){
                stopFlag = false;
                for (var i = 0; i < top5.length - 1; i++) {
                    var temp;
                    temp = top5[i];
                    if (top5[i + 1].time < top5[i].time) {
                        top5[i] = top5[i + 1];
                        top5[i + 1] = temp;
                        stopFlag = true;
                    }
                }
            }
        };


        $scope.wrongCombination = function (event1, event2) {
            //Wait maxTime, before closing the opened cells
            var currentTime=0;
            var maxTime =500;
            var timeLeftWidth = 185; //185px
            var fadeTimer = function () {
                if(clickedFields.length>0){
                    //If a new field is clicked, quit looping
                    currentTime = maxTime;
                }
                if(currentTime < maxTime){
                    currentTime+=5;
                    timeLeftWidth-=5;
                    angular.element('#timeLeft').css('width', timeLeftWidth);
                    $timeout(fadeTimer, 5); //call function every 5 ms
                }else{
                    angular.element(event1.currentTarget).css('opacity', '0');
                    angular.element(event2.currentTarget).css('opacity', '0');
                    angular.element('#timeLeft').css('width', timeLeftWidth);
                }
            };
            $timeout(fadeTimer, 5); //call function every 5 ms
        }
    }
);
