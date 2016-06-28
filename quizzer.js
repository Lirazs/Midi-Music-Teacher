(function(Quizzer) {

Quizzer.notes = {0: ['C', ''], 1: ['C', '#'], 2: ['D', ''], 3: ['D', '#'], 4: ['E', ''], 5: ['F', ''],
                 6: ['F', '#'], 7: ['G', ''], 8: ['G', '#'], 9: ['A', ''], 10: ['A', '#'], 11: ['B', '']};

Quizzer.keys = {0: [['C', '']], 1: [['C', '#'], ['D', 'b']], 2: [['D', '']], 3: [['D', '#'], ['E', 'b']], 4: [['E', '']], 5: [['F', '']],
                6: [['F', '#'], ['G', 'b']], 7: [['G', '']], 8: [['G', '#'], ['A', 'b']], 9: [['A', '']], 10: [['A', '#'], ['B', 'b']], 11: [['B', '']]};

Quizzer.randomInt = function(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

Quizzer.randomNote = function(allowed_notes) {
   var target_octave = null;
   var target_key = null;
   var target_name = null;

   if (allowed_notes.octaves != null) {
      target_octave = allowed_notes.octaves[Quizzer.randomInt(0, allowed_notes.octaves.length)];
   }

   if (allowed_notes.keys == null) {
      target_key = Quizzer.randomInt(0,12);
   } else {
      target_key = allowed_notes.keys[Quizzer.randomInt(0, allowed_notes.keys.length)];
   }

   target_name = Quizzer.keys[target_key][Quizzer.randomInt(0, Quizzer.keys[target_key].length)];

   return {key: target_key, octave: target_octave, name: target_name};
};


Quizzer.NotesGame = function(score_id, timer_id) {
   var self = this;
   self._timer = null;
   self._timer_id = timer_id;
   self._given_time = 0;
   self._score_element = document.getElementById(score_id);
   self._points = 0;
   self._correct_score = 0;
   self._mistake_score = 0;
   self._target_key = null;
   self._target_name = '';
   self._target_octave = null;
   self._allowed_notes = [{keys: null, octaves: null}];
};

Quizzer.NotesGame.prototype.restrictNotes = function(allowed_notes) {
   var self = this;
   self._allowed_notes = allowed_notes;
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

Quizzer.NotesGame.prototype.quizz = function(millisecs, correct_score, mistake_score, timeout_score, onTimeout) {
   var self = this;
   self._correct_score = correct_score;
   self._mistake_score = mistake_score;
   self._given_time = millisecs;

   var note = Quizzer.randomNote(self._allowed_notes[Quizzer.randomInt(0,self._allowed_notes.length)]);
   self._target_name = note.name;
   self._target_key = note.key;
   self._target_octave = note.octave;

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
   return {key_index: self._target_key, name: self._target_name[0],
           accidental: self._target_name[1], octave: self._target_octave};
};

}(window.Quizzer = window.Quizzer  || {}));
