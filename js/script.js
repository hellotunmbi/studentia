
var app = angular.module('studentApp', ['ngRoute']);

// API Configuration
const base_url = 'https://studentia-api.herokuapp.com/api/';

app.config(function($routeProvider) {
    $routeProvider
        .when("/register", {
            templateUrl: 'views/register.html',
            controller: 'registerCtrl'
        })

        .when("/list", {
            templateUrl: 'views/list.html',
            controller: 'listCtrl'
        })

        .when("/update/:id", {
            templateUrl: 'views/update.html',
            controller: 'updateCtrl'
        })

        .otherwise({
            templateUrl: 'views/register.html'
        })
});


/** ********************************************************* */


// Register New Student Controller
app.controller('registerCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.formData = {};
    $scope.isDisabled = false;
    $scope.submitValue = "Register Student";

    $scope.registerStudent = function() {

        //check if sex is selected
        if(!$scope.formData.sex ) {
            alert('Select your sex');
            return;
        }
        else if(!$scope.formData.level) {
            alert('Select your Level');
            return;
        }

        $scope.isDisabled = true;
        $scope.submitValue = "Submitting...";

        var studentData = {
            'first_name': $scope.formData.first_name,
            'last_name': $scope.formData.last_name,
            'faculty': $scope.formData.faculty, 
            'department': $scope.formData.department,
            'level': $scope.formData.level,
            'sex': $scope.formData.sex
        };


        $http({ 
            method: 'POST',
            url: base_url+'student',
            data: studentData,
            headers: { 'Content-Type': 'application/json' }
        })
            .success( function (data) {
                console.log(data);

                if (!data._id) {
                // if not successful, bind errors to error variables
                console.log("Error");
                } else {
                // if successful, bind success message to message
                $scope.message = "Student Successfully Registered!";
                $scope.formData = {};
                $scope.isDisabled = false;
                $scope.submitValue = "Register Student";
                }
            })

        
    }
    

}] );


/** ********************************************************* */


// Controller for Listing Student Record
app.controller('listCtrl', ['$scope', '$http', '$route', function ($scope, $http, $route) {
    
    $scope.isRecord = false;
    $scope.noRecord;

    // Call API to get all students
    $http({ 
        method: 'GET',
        url: base_url + 'students',
        headers: { 'Content-Type': 'application/json' }
    })
      .success((data) => {
          $scope.students = data;

          console.log(data);

          if($scope.students.length < 1) {
              $scope.noRecord = "No record found";
          } else {
              console.log("Some record found");
              $scope.isRecord = true;

          }
      });



      // Delete Student Record Function
      $scope.delete = () => {

        let studentId = event.target.id;

        // Call delete API to delete single student
        $http({ 
            method: 'DELETE',
            url: base_url + 'student' + '/' + studentId,
            headers: { 'Content-Type': 'application/json' }
        })
          .success((data) => {
             console.log(data);

            //  $route.reload();
             $('.deleted_message').css('visibility', 'visible');
             $('.'+studentId).remove();
             console.log(data.message);

          })
      }

}]);


/** ********************************************************* */

// Update Single Student Record Controller
app.controller('updateCtrl', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    
    // alert($routeParams.id);
    let studentId = $routeParams.id;

    $scope.students = {};
    $scope.isDisabled = false;
    $scope.updateValue = "Update Record";

    $http({ 
        method: 'GET',
        url: base_url + 'student' + '/' +studentId,
        headers: { 'Content-Type': 'application/json' }
    })
      .success((data) => {
          $scope.students = data;

          console.log(data);

          if($scope.students.length < 1) {
              
            $scope.noRecord = "No record found";

          } else {
            
              console.log("Some record found");


          }
      });


      // Action to Update Record on Submit
      $scope.update = () => {
        
        // Call delete API to delete single student
        $http({ 
            method: 'PUT',
            url: base_url + 'student' + '/' + studentId,
            data: $scope.students,
            headers: { 'Content-Type': 'application/json' }
        })
            .success((data) => {
                console.log(data);

                $('.updated_message').css('visibility', 'visible');

            })
        }



}]);


/** ********************************************************* */


// Create ng-confirm-click directive to show confirm dialog (delete)
app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}]);

/** ********************************************************* */

