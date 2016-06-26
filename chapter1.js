(function(Chapter1) {

Chapter1.Engine = function(quizzer, octave, timeout, adaptive_timout, allowed_keys) {
   var self = this;
   self._quizzer = quizzer;
   self._octave = octave;
   self._timeout = timeout;
   self._quizzer.restrictKeys(allowed_keys);
   self._wait_for_round = false;
   self._adaptive_timeout = adaptive_timout;

   octave.annotation(false);
};

Chapter1.Engine.prototype.abort = function() {
   var self = this;
   self._quizzer.abort();
};

Chapter1.Engine.prototype.newRound  = function() {
   var self = this;
   self._quizzer.quizz(self._timeout, +3, -1, -2, function() {
      self._octave.annotation(true);
   });
   self._quizzer.showNote();
   self._quizzer.showKeyname();
};


Chapter1.Engine.prototype.onPress = function(octave, note_index) {
   var self = this;
   self._octave.pressKey(note_index);
   if (self._wait_for_round) {
      return;
   }
   var used = self._quizzer.timeUsed();
   if (self._quizzer.trial(octave, note_index)) {
      Common.feedbackCorrect('keyboard');
      self._wait_for_round = true;
      if (self._adaptive_timeout) {
         self._timeout = (used == self._timeout)? self._timeout+500 : Math.floor((used+self._timeout)/2.0);
      }
      setTimeout(function() {
         self._wait_for_round = false;
         Common.feedbackNone('keyboard');
         self._octave.annotation(false);
         self.newRound();
      }, 1000);
   } else {
      Common.feedbackWrong('keyboard');
   }
};

Chapter1.Engine.prototype.onRelease = function(octave, note_index) {
   var self = this;
   self._octave.releaseKey(note_index);
   if (!self._wait_for_round) {
      Common.feedbackNone('keyboard');
   }
};



Chapter1.Stages = function() {
   var self = this;
   self._stave = null;
   self._octave = null;
   self._quizzer = null;
   self._game = null;
   self._midi = null;
};


Chapter1.Stages.prototype._init_midi = function() {
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


Chapter1.Stages.prototype.abort = function() {
   var self = this;
   if (self._game) {
      self._game.abort();
   }

   self._stave = null;
   self._octave = null;
   self._quizzer = null;
   self._game = null;
};

Chapter1.Stages.prototype._keys_stage = function(allowed_keys, timeout, adaptive_timeout) {
   var self = this;

   self.abort();

   document.getElementById('asked-note-symbol').querySelector('canvas').style.display = 'inline-block';
   document.getElementById('asked-note-symbol').querySelector('span').style.display = 'none';

   self._stave = new Score.Stave("stave", "treble");
   self._octave = new Keyboard.Octave(document.getElementById('octave'));
   self._quizzer = new Quizzer.NotesGame('user-points', 'timer', 'asked-note-name', self._stave);
   self._game = new Chapter1.Engine(self._quizzer, self._octave, timeout, adaptive_timeout, allowed_keys);

   self._octave.setScreen(function(key, info) {self._game.onPress(info, key);},
                         function(key, info) {self._game.onRelease(info, key);}, 0);

   if (!self._init_midi()) {
      self._game.newRound();
   }
};



Chapter1.Stages.prototype.stage1 = function() {
   var self = this;
   self._keys_stage([0,2,4,5,7,9,11], 5000, false);
};

Chapter1.Stages.prototype.stage2 = function() {
   var self = this;
   self._keys_stage([0,1,2,3,4,5,6,7,8,9,10,11], 5000, false);
};

Chapter1.Stages.prototype.stage3 = function() {
   var self = this;
   self._keys_stage([0,1,2,3,4,5,6,7,8,9,10,11], 5000, true);
};

}(window.Chapter1 = window.Chapter1|| {}));
