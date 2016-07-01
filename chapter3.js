(function(Chapter3) {


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
            self._game.start();
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

Chapter3.Stages.prototype._keys_stage = function(allowed_notes, timeout, adaptive_timeout) {
   var self = this;

   self.abort();

   self._stave = new Score.Stave("stave", "treble");
   self._quizz_widget = new QuizzWidgets.Boxes(document.getElementById('quizz').querySelector('.note-name'), self._stave);
   self._quizzer = new Quizzer.NotesGame('user-points', 'timer');
   self._game = new Chapter2.Engine(self._quizzer, self._piano, self._quizz_widget, timeout, adaptive_timeout, allowed_notes);

   self._piano.setScreen(function(key, info) {self._game.onPress(info, key);},
                         function(key, info) {self._game.onRelease(info, key);});

   if (!self._init_midi()) {
      self._game.start();
   }
};



Chapter3.Stages.prototype.stage1 = function() {
   var self = this;
   self._keys_stage([{octaves: [4], keys: [2,5,9]}], 5000, false);
};

Chapter3.Stages.prototype.stage2 = function() {
   var self = this;
   self._keys_stage([{octaves: [4], keys: [2,5,9]}, {octaves: [5], keys: [0,4,7,11]}], 5000, false);
};

Chapter3.Stages.prototype.stage3 = function() {
   var self = this;
   self._keys_stage([{octaves: [4,5], keys: [0,2,4,5,7,9,11]}], 5000, false);
};

Chapter3.Stages.prototype.stage4 = function() {
   var self = this;
   self._keys_stage([{octaves: [4,5], keys: [0,1,2,3,4,5,6,7,8,9,10,11]}], 5000, false);
};

Chapter3.Stages.prototype.stage5 = function() {
   var self = this;
   self._keys_stage([{octaves: [4,5], keys: [0,1,2,3,4,5,6,7,8,9,10,11]}], 5000, true);
};


}(window.Chapter3 = window.Chapter3|| {}));
