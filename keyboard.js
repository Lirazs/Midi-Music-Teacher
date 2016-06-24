angular.module('keyboard', [])

.directive('octave', function() {
   return {
     restrict: 'E',
     scope: {},
     templateUrl: 'keyboard_octave.html'
   };
});


(function(Keyboard) {

   Keyboard.Octave = function(element) {
      var self = this;
      self._element = element;
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



   Keyboard.Range = function(element, octaves, $compile, $scope) {
      var self = this;
      self._element = element;
      self._octaves = {};

      for (var i = 0; i < octaves.length; ++i) {
         var curr = document.createElement('octave');
         $compile(curr)($scope);
         element.appendChild(curr);
         self._octaves[octaves[i]] = new Keyboard.Octave(curr);
      };
   };

   Keyboard.Range.prototype.markKey = function(octave, key_index) {
      var self = this;
      if (octave in self._octaves) {
         self._octaves[octave].markKey(key_index);
         return true;
      }
      return false;
   };

   Keyboard.Range.prototype.unmarkKey = function(octave, key_index) {
      var self = this;
      if (octave in self._octaves) {
         self._octaves[octave].unmarkKey(key_index);
         return true;
      }
      return false;
   };

   Keyboard.Range.prototype.pressKey = function(octave, key_index) {
      var self = this;
      if (octave in self._octaves) {
         self._octaves[octave].pressKey(key_index);
         return true;
      }
      return false;     
   };

   Keyboard.Range.prototype.releaseKey = function(octave, key_index) {
      var self = this;
      if (octave in self._octaves) {
         self._octaves[octave].releaseKey(key_index);
         return true;
      }
      return false;     
   };



}(window.Keyboard = window.Keyboard || {}));
