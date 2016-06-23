angular.module('pianoWidget', [])

.directive('octave', function() {
   return {
     restrict: 'E',
     scope: {},
     templateUrl: 'octave.html'
   };
});


