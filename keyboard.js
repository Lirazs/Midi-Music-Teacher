angular.module('keyboard', [])

.directive('octave', function() {
   return {
     restrict: 'E',
     scope: {},
     templateUrl: 'keyboard_octave.html'
   };
});


(function(Keyboard) {

   Keyboard.Octave = function(octave_name) {
      var self = this;
      self._element = document.getElementById(octave_name);
      self._index2ID = {0: 'C', 1: 'CD', 2: 'D', 3: 'DE', 4: 'E', 5: 'F', 6: 'FG', 7: 'G', 8: 'GA', 9: 'A', 10: 'AB', 11: 'B'};
   };

   Keyboard.Octave.prototype.markKey = function(key_index) {
      var self = this;
      self._element.querySelector('.'+self._index2ID[key_index]).classList.add('marked');
   };

   Keyboard.Octave.prototype.unmarkKey = function(key_index) {
      var self = this;
      self._element.querySelector('.'+self._index2ID[key_index]).classList.remove('marked');
   };

   Keyboard.Octave.prototype.pressKey = function(key_index) {
      var self = this;
      self._element.querySelector('.'+self._index2ID[key_index]).classList.add('pressed');
   };

   Keyboard.Octave.prototype.releaseKey = function(key_index) {
      var self = this;
      self._element.querySelector('.'+self._index2ID[key_index]).classList.remove('pressed');
   };

}(window.Keyboard = window.Keyboard || {}));
