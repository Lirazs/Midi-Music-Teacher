(function(Game) {

// Nice Feedback


Game.Chapter1 = function(quizzer, octave, timeout, allowed_keys) {
   var self = this;
   self._quizzer = quizzer;
   self._octave = octave;
   self._timeout = timeout;
   self._allowed_keys = allowed_keys;

   octave.annotation(false);
};

Game.Chapter1.prototype.newRound  = function() {
   var self = this;
   self._quizzer.quizz(self._timeout, +3, -1, -2, function() {
      self._octave.annotation(true);
   });
};


Game.Chapter1.prototype.onPress = function(octave, note_index) {
   var self = this;
   self._octave.pressKey(note_index);
   if (self._quizzer.trial(note_index)) {
      setTimeout(function() { 
         self._octave.annotation(false);
         self.newRound();
      }, 1000);
   }  
};

Game.Chapter1.prototype.onRelease = function(octave, note_index) {
   var self = this;
   self._octave.releaseKey(note_index);
};

}(window.Game = window.Game|| {}));
