(function(Chapter3) {

Chapter3.Engine = function(quizzer, piano, quizz_widget, timeout, adaptive_timout, allowed_keys) {
   var self = this;
   self._quizzer = quizzer;
   self._piano = piano;
   self._quizz_widget = quizz_widget;
   self._timeout = timeout;
   self._quizzer.restrictKeys(allowed_keys);
   self._wait_for_round = false;
   self._adaptive_timeout = adaptive_timout;

   piano.annotation(false);
};

Chapter3.Engine.prototype.abort = function() {
   var self = this;
   self._quizzer.abort();
};

Chapter3.Engine.prototype.newRound = function() {
   var self = this;
   self._quizzer.quizz(self._timeout, +3, -1, -2, function() {
      var target = self._quizzer.getTarget();
      self._piano.markKey(target.octave, target.key_index);
      self._piano.annotation(true);
      self._quizz_widget.taggleName(target.octave, target.name, target.accidental, true);
   }, [4,5]); 

   var target = self._quizzer.getTarget();
   self._quizz_widget.taggleName(target.octave, target.name, target.accidental, false);
   self._quizz_widget.taggleSymbol(target.ocatve, target.name, target.accidental, true);
   self._piano.unmarkKeys();
};

Chapter3.Engine.prototype.onPress = function(octave, note_index) {
   var self = this;
   self._piano.pressKey(octave, note_index);
   if (self._wait_for_round) {
      return;
   }
   var used = self._quizzer.timeUsed();
   if (self._quizzer.trial(octave, note_index)) {
      self._wait_for_round = true;
      Common.feedbackCorrect('keyboard');
      self._piano.unmarkKeys();
      if (self._adaptive_timeout) {
         self._timeout = (used == self._timeout)? self._timeout+500 : Math.floor((used+self._timeout)/2.0);
      }
      setTimeout(function() {
         self._wait_for_round = false;
         Common.feedbackNone('keyboard');
         self._piano.annotation(false);
         self.newRound();
      }, 1000);
   } else {
      Common.feedbackWrong('keyboard');
   }

};

Chapter3.Engine.prototype.onRelease = function(octave, note_index) {
   var self = this;
   self._piano.releaseKey(octave, note_index);
   if (!self._wait_for_round) {
      Common.feedbackNone('keyboard');
   }
};





Chapter3.Stages = function(piano) {
   var self = this;
   self._piano = piano;
   self._stave = null;
   self._quizz_widget = null;
   self._quizzer = null;
   self._game = null;
   self._midi = null;
};


Chapter3.Stages.prototype._init_midi = function() {
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


Chapter3.Stages.prototype.abort = function() {
   var self = this;
   if (self._game) {
      self._game.abort();
   }

   self._stave = null;
   self._quizzer = null;
   self._quizz_widget = null;
   self._game = null;
};

Chapter3.Stages.prototype._keys_stage = function(allowed_keys, timeout, adaptive_timeout) {
   var self = this;

   self.abort();

   self._stave = new Score.Stave("stave", "treble");
   self._quizz_widget = new QuizzWidgets.Boxes(document.getElementById('quizz').querySelector('.note-name'), self._stave);
   self._quizzer = new Quizzer.NotesGame('user-points', 'timer');
   self._game = new Chapter3.Engine(self._quizzer, self._piano, self._quizz_widget, timeout, adaptive_timeout, allowed_keys);

   self._piano.setScreen(function(key, info) {self._game.onPress(info, key);},
                         function(key, info) {self._game.onRelease(info, key);});

   if (!self._init_midi()) {
      self._game.newRound();
   }
};



Chapter3.Stages.prototype.stage1 = function() {
   var self = this;
   self._keys_stage([0,4,7,9], 5000, false);
};

Chapter3.Stages.prototype.stage2 = function() {
   var self = this;
   self._keys_stage([0,2,4,5,7,9,11], 5000, false);
};

Chapter3.Stages.prototype.stage3 = function() {
   var self = this;
   self._keys_stage([0,1,2,3,4,5,6,7,8,9,10,11], 5000, false);
};

Chapter3.Stages.prototype.stage4 = function() {
   var self = this;
   self._keys_stage([0,1,2,3,4,5,6,7,8,9,10,11], 5000, true);
};


}(window.Chapter3 = window.Chapter3|| {}));
