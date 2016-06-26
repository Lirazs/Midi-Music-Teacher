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

   Keyboard.Octave.prototype.unmarkKeys = function() {
      var self = this;
      for (var key_index in self._index2ID) {
         if (self._index2ID.hasOwnProperty(key_index)) {
            self.unmarkKey(key_index);
         }
      }
   };

   Keyboard.Octave.prototype.pressKey = function(key_index) {
      var self = this;
      self._element.querySelector('.'+self._index2ID[key_index]).classList.add('pressed');
   };

   Keyboard.Octave.prototype.releaseKey = function(key_index) {
      var self = this;
      self._element.querySelector('.'+self._index2ID[key_index]).classList.remove('pressed');
   };

   Keyboard.Octave.prototype.releaseKeys = function() {
      var self = this;
      for (var key_index in self._index2ID) {
         if (self._index2ID.hasOwnProperty(key_index)) {
            self.releaseKey(key_index);
         }
      }
   };

   Keyboard.Octave.prototype.annotation = function(flag) {
      var self = this;
      var mode = flag? 'visible':'hidden';
      for (var key_index in self._index2ID) {
         if (self._index2ID.hasOwnProperty(key_index)) {
            self._element.querySelector('.'+self._index2ID[key_index]).querySelector('.keyname').style.visibility = mode;
         }
      }
   };

   Keyboard.Octave.prototype.setScreen = function(onPress, onRelease, information) {
      var self = this;
      for (var key_index in self._index2ID) {
         if (self._index2ID.hasOwnProperty(key_index)) {
            var set = function (keyID) {
               var key_element = self._element.querySelector('.'+self._index2ID[key_index])
               key_element.onmousedown = function(e) {onPress(keyID, information);};
               key_element.onmouseup = function(e) {onRelease(keyID, information);};
               key_element.ontouchstart = function(e) {e.preventDefault(); onPress(keyID, information);};
               key_element.ontouchend = function(e) {e.preventDefault(); onRelease(keyID, information);};
            }(key_index);
         }
      }
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


   Keyboard.Range.prototype.releaseKeys = function() {
      var self = this;
      for (var octave in self._octaves) {
         if (self._octaves.hasOwnProperty(octave)) {
            self._octaves[octave].releaseKeys();
         }
      }
   };


   Keyboard.Range.prototype.unmarkKeys = function() {
      var self = this;
      for (var octave in self._octaves) {
         if (self._octaves.hasOwnProperty(octave)) {
            self._octaves[octave].unmarkKeys();
         }
      }
   };

   Keyboard.Range.prototype.annotation = function(flag) {
      var self = this;
      for (var octave in self._octaves) {
         if (self._octaves.hasOwnProperty(octave)) {
            self._octaves[octave].annotation(flag);
         }
      }
   };

   Keyboard.Range.prototype.setScreen = function(onPress, onRelease) {
      var self = this;
      for (var octave in self._octaves) {
         if (self._octaves.hasOwnProperty(octave)) {
            var set = function(octave_number) {
               self._octaves[octave_number].setScreen(onPress, onRelease, octave_number);
            }(octave);
         }
      }
   };
 
}(window.Keyboard = window.Keyboard || {}));
