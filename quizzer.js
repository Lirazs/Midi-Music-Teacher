(function(Quizzer) {

Quizzer.notes = {0: ['C', ''], 1: ['C', '#'], 2: ['D', ''], 3: ['D', '#'], 4: ['E', ''], 5: ['F', ''],
                 6: ['F', '#'], 7: ['G', ''], 8: ['G', '#'], 9: ['A', ''], 10: ['A', '#'], 11: ['B', '']};



Quizzer.randomInt = function(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}



Quizzer.NotesGame = function(score_id, timer_id, keyname_id, stave) {
   var self = this;
   self._timer = null;
   self._timer_id = timer_id;
   self._score_element = document.getElementById(score_id);
   self._stave = stave;
   self._note_element = keyname_id? document.getElementById(keyname_id) : null;
   self._points = 0;
   self._correct_score = 0;
   self._mistake_score = 0;
   self._target_note = null;
   self._target_accidental = '';
};

Quizzer.NotesGame.prototype.quizz = function(millisecs, correct_score, mistake_score, timeout_score, onTimeout) {
   var self = this;
   self._correct_score = correct_score;
   self._mistake_score = mistake_score;

   self._target_note = Quizzer.randomInt(0,12);
   self._target_accidental = Quizzer.notes[self._target_note][1];
   if (self._target_accidental != '') {
      self._target_accidental = (Quizzer.randomInt(0, 2) == 0)?'#':'b';
   }


   self._show_keyname(self._target_note);
   self._show_note(self._target_note);

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

Quizzer.NotesGame.prototype.trial = function(note) {
   var self = this;
   if (self._target_note == note) {
      self._timer.abort();
      self._set_score(self._points+self._correct_score);
      return true;
   } else {
      self._set_score(self._points+self._mistake_score);
      return false;
   }
};

Quizzer.NotesGame.prototype._set_score = function(score) {
   var self = this;
   self._points = score;
   self._score_element.querySelector('span').innerHTML = "Score: " + self._points.toString();
};


Quizzer.NotesGame.prototype._show_keyname = function(key_index) {
   var self = this;
   if (self._note_element) {
      self._note_element.querySelector('span').innerHTML = Quizzer.notes[key_index][0]+self._target_accidental;
   }
};


Quizzer.NotesGame.prototype._show_note= function(key_index) {
   var self = this;
   if (self._stave) {
      self._stave.drawBeat([{name: Quizzer.notes[key_index][0], accidental: self._target_accidental, octave: 4}], 4);
   }
 
};

}(window.Quizzer = window.Quizzer  || {}));
