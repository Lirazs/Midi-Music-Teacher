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

Game.Chapter1.prototype.abort = function() {
   var self = this;
   self._quizzer.abort();
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



Game.Stages = function() {
   var self = this;
   self._stave = null;
   self._octave = null;
   self._quizzer = null;
   self._game = null;
   self._midi = null;
};


Game.Stages.prototype._init_midi = function() {
   var self = this;

   if (self._midi) {
      return false;
   }

   self._midi = new Midi.Controller(
      function(ok_flag, devices, msg) {
         if (!ok_flag) {
            alert('Midi is unsupported by the browser: ' + msg);
            return;
         }
         Common.initDeviceList(devices, document.getElementById('devices-list'));
         if (self._game) {
            self._game.newRound();
         }
      },
      function(octave, note_index) {
         if (self._game) {
            self._game.onPress(octave, note_index);
         }
      },
      function(octave, note_index) {
         if (self._game) {
            self._game.onRelease(octave, note_index);
         }
      }
   );
   return true;
};


Game.Stages.prototype.abort = function() {
   var self = this;
   if (self._game) {
      self._game.abort();
   }

   self._stave = null;
   self._octave = null;
   self._quizzer = null;
   self._game = null;
};

Game.Stages.prototype._keys_stage = function(allowed_keys) {
   var self = this;

   self.abort();

   document.getElementById('asked-note-symbol').querySelector('canvas').style.display = 'none';
   document.getElementById('asked-note-symbol').querySelector('span').style.display = 'inline-block';

   self._stave = new Score.Stave("stave", "treble");
   self._octave = new Keyboard.Octave(document.getElementById('octave'));
   self._quizzer = new Quizzer.NotesGame('user-points', 'timer', 'asked-note-name', self._stave);
   self._game = new Game.Chapter1(self._quizzer, self._octave, 5000, allowed_keys);

   if (!self._init_midi()) {
      self._game.newRound();
   }
};



Game.Stages.prototype.stage1 = function() {
   var self = this;
   self._keys_stage([0,2,4,5,7,9,11]);
};

Game.Stages.prototype.stage2 = function() {
   var self = this;
   self._keys_stage([0,1,2,3,4,5,6,7,8,9,10,11]);
};



}(window.Game = window.Game|| {}));

