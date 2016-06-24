(function(Game) {

// Stage Selector
// Nice Feedback


Game.Chapter1 = function(quizzer, octave, timeout, allowed_keys) {
   var self = this;
   self._quizzer = quizzer;
   self._octave = octave;
   self._timeout = timeout;
   self._quizzer.restrictKeys(allowed_keys);

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



Game.initStage1 = function init() {
   document.getElementById('asked-note-symbol').querySelector('canvas').style.display = 'none';
   document.getElementById('asked-note-symbol').querySelector('span').style.display = 'inline-block';

   var stave = new Score.Stave("stave", "treble");
   var octave = new Keyboard.Octave(document.getElementById('octave'));
   var quizzer = new Quizzer.NotesGame('user-points', 'timer', 'asked-note-name', stave);

   var game = new Game.Chapter1(quizzer, octave, 5000, [0,2,4,5,7,9,11]);

   var midi = new Midi.Controller(
      function(ok_flag, devices, msg) {
         if (!ok_flag) {
            alert('Midi is unsupported by the browser: ' + msg);
            return;
         }
         Common.initDeviceList(devices, document.getElementById('devices-list'));
         game.newRound();
      },
      function(octave, note_index) {
         game.onPress(octave, note_index);
      },
      function(octave, note_index) {
         game.onRelease(octave, note_index);
      }
   );
};


}(window.Game = window.Game|| {}));
