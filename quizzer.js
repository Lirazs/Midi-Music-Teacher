(function(Quizzer) {

Quizzer.notes = {0: ['C', ''], 1: ['C', '#'], 2: ['D', ''], 3: ['D', '#'], 4: ['E', ''], 5: ['F', ''],
                 6: ['F', '#'], 7: ['G', ''], 8: ['G', '#'], 9: ['A', ''], 10: ['A', '#'], 11: ['B', '']};

Quizzer.keys = {0: [['C', '']], 1: [['C', '#'], ['D', 'b']], 2: [['D', '']], 3: [['D', '#'], ['E', 'b']], 4: [['E', '']], 5: [['F', '']],
                6: [['F', '#'], ['G', 'b']], 7: [['G', '']], 8: [['G', '#'], ['A', 'b']], 9: [['A', '']], 10: [['A', '#'], ['B', 'b']], 11: [['B', '']]};

Quizzer.randomInt = function(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}



Quizzer.NotesGame = function(score_id, timer_id, keyname_id, stave) {
   var self = this;
   self._timer = null;
   self._timer_id = timer_id;
   self._given_time = 0;
   self._score_element = document.getElementById(score_id);
   self._stave = stave;
   self._note_element = keyname_id? document.getElementById(keyname_id) : null;
   self._points = 0;
   self._correct_score = 0;
   self._mistake_score = 0;
   self._target_key = null;
   self._target_name = '';
   self._allowed_keys = null;
   self._target_octave = null;
};

Quizzer.NotesGame.prototype.restrictKeys = function(allowed_keys) {
   var self = this;
   self._allowed_keys = allowed_keys;
};

Quizzer.NotesGame.prototype.abort = function() {
   var self = this;
   if (self._timer != null) {
      self._timer.abort();
   }
   self._timer = null;
};

Quizzer.NotesGame.prototype.timeUsed = function() {
   var self = this;
   return self._given_time - self._timer.remaining();
};

Quizzer.NotesGame.prototype.quizz = function(millisecs, correct_score, mistake_score, timeout_score, onTimeout, octaves_list) {
   var self = this;
   self._correct_score = correct_score;
   self._mistake_score = mistake_score;
   self._given_time = millisecs;

   if (octaves_list) {
      self._target_octave = octaves_list[Quizzer.randomInt(0, octaves_list.length)];
   } else {
      self._target_octave = null;
   }

   if (self._allowed_keys == null) {
      self._target_key = Quizzer.randomInt(0,12);
   } else {
      self._target_key = self._allowed_keys[Quizzer.randomInt(0, self._allowed_keys.length)];
   }
   self._target_name = Quizzer.keys[self._target_key][Quizzer.randomInt(0, Quizzer.keys[self._target_key].length)];

   self._timer = new Widgets.CountDown(millisecs, 50,
      function() {
         self._set_score(self._points+timeout_score);
         if (onTimeout) {
            onTimeout(self);
         }
      },
      function(t) {
         Widgets.setProgress(self._timer_id, t.remaining(), t.remaining()/millisecs);
      }
   );
};

Quizzer.NotesGame.prototype.trial = function(octave, key_index) {
   var self = this;
   var correct = false;
   if (self._target_key == key_index) {
      correct = ((self._target_octave == null) || (self._target_octave == octave));
   }

   if (correct === true) {
      self._timer.abort();
       self._set_score(self._points+self._correct_score);
   } else {
      self._set_score(self._points+self._mistake_score);
   }
   return correct;
}

Quizzer.NotesGame.prototype._set_score = function(score) {
   var self = this;
   self._points = score;
   self._score_element.querySelector('span').innerHTML = "Score: " + self._points.toString();
};


Quizzer.NotesGame.prototype.getTarget = function() {
   var self = this;
   return {key_index: self._target_key, octave: self._target_octave};
};

Quizzer.NotesGame.prototype.showKeyname = function() {
   var self = this;
   if (self._note_element) {
      self._note_element.querySelector('span').innerHTML = self._target_name[0]+self._target_name[1];
   }
};

Quizzer.NotesGame.prototype.showNote = function() {
   var self = this;
   if (self._stave) {
      var octave = self._target_octave || 4;
      self._stave.drawBeat([{name: self._target_name[0], accidental: self._target_name[1], octave: octave}], 4);
   }
};

}(window.Quizzer = window.Quizzer  || {}));
