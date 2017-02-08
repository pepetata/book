/* global $http angular $  location */
// https://www.npmjs.com/package/ng-file-upload
var app = angular.module('book', ['ngFileUpload']);

app.controller('BookController', ['$http', '$scope', 'Upload', '$timeout',function($http, $scope, Upload, $timeout){
    var club = this;
    club.user= sessionStorage.user ? JSON.parse(sessionStorage.user) : {email: "a@a.com", password:"a", password2: "a"};
    club.books = [];
    club.book = { title:"", author: ""};
    club.trade = {book:"", bemail:"", mybook:"", mybemail: "", status: 'Sent'};
    
    console.log('user=',club.user,'book',club.book);

    // get list of books
    $http.get('/listBooks').then(function(data){
        club.books = data.data;
        console.log( club.books);
    }, function(err) {
        console.log(err);
    });

    // get list of trades: mine and to me
    $http.post('/getMyTrades', club.user).then(function(data){
        club.trades = data.data;
        console.log( club.trades);
    }, function(err) {
        console.log(err);
    });


    this.updateTrade = function(trade,status) {
        trade.status = status;
        console.log('alterando' , trade, status);
        $http.post('/updateTrade', trade).then(function(data){
            // $("#tradeModal").modal('hide');
            // $("#msg").html("Trade request sent with success!!");
            // $("#msgModal").modal('show');
        }, function(err) {
            console.log(err);
        });
    };


    this.tradereq = function(book) {
        club.trade.book= book.imagesrc;
        club.trade.bemail=book.email;
        $("#trade").html('<img src="' + book.imagesrc + '">');
        $("#tradeModal").modal('show');
    };

    this.mytradereq = function(book) {
        club.trade.mybook= book.imagesrc;
        club.trade.mybemail=book.email;
        console.log(club.trade);
        $http.post('/trade', club.trade).then(function(data){
            $("#tradeModal").modal('hide');
            $("#msg").html("Trade request sent with success!!");
            $("#msgModal").modal('show');
        }, function(err) {
            console.log(err);
        });
    };


    this.addBook = function() {
        club.book.error = false;
        club.book.errorMsg = "";
        club.book.email = club.user.email;
        console.log('clickou inserir book',club.book);
        console.log(club.book.picFile);
        // dont send file if web image is present
        if (club.book.image > "") delete club.book.picFile;
        Upload.upload({
            url: '/addBook',
            data: club.book
        }).then(function (resp) {
            console.log('Success ' + resp + 'uploaded. Response: ' + resp.data);
            $("#msg").html("New book added with success!!");
            $("#msgModal").modal('show');
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt);
        });
    };

    
    this.loginUser = function(user) {
        console.log('login',club.user);
        user = user || club.user;
        user.error = false;
        user.errorMsg = "";
        $http.post('/loginUser', this.user).then(function(data){
            club.user = data.data;
            console.log(club.user);
            if (club.user.error) return false;
            $("#signInModal").modal('hide');
            // save user
            sessionStorage.user=JSON.stringify(club.user);
        }, function(err) {
            console.log(err);
        });
    };

    this.signOutUser = function() {
        club.user.logged = false;
        sessionStorage.removeItem('user');
        console.log(club.user);
        location.href ="/";
        };

    this.addUser = function(user) {
        return saveUser(user, false);
    };
    
    this.myProfile = function(user) {
        return saveUser(user, true);
    };
    
    function saveUser(user,update){
        user = user || club.user;
        user.error = false;
        user.errorMsg = "";
        if (user.password != user.password2) {
            club.user.error = true;
            club.user.errorMsg = "Passwords don't match!!";
            return false;
        }
        $http.post('/saveUser', { user: user, update: update}).then(function(data){
            console.log(data.data);
            club.user = data.data;
            sessionStorage.user=JSON.stringify(club.user);
            if (club.user.error) return false;
            $("#signUpModal").modal('hide');
            if (update) $("#msg").html("User saved with success!!");
            else $("#msg").html("New user added with success!!");
            $("#msgModal").modal('show');
        }, function(err) {
            console.log(err);
        });
        return true;
    }

    
    
    
    
}]);

