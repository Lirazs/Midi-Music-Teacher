(function(QuizzWidgets) {
   
QuizzWidgets.Boxes = function(key_box, stave) {
   var self = this;
   self._key_box = key_box.querySelector('span');
   self._stave = stave;
};

QuizzWidgets.Boxes.prototype.taggleName = function(octave, name, accidental, flag) {
   var self = this;
   self._key_box.innerHTML = flag ? (name+accidental) : '?';
};

QuizzWidgets.Boxes.prototype.taggleSymbol = function(octave, name, accidental, flag) {
   var self = this;
   if (flag) {
     self._stave.drawBeat([{name: name, accidental: accidental, octave: octave}], 4);
   } else {
      self._stave.clear();
   }
};

QuizzWidgets.Boxes.prototype.reset = function() {
   var self = this;
   self._stave.clear();
   self._key_box.innerHTML = '?';
};






QuizzWidgets.SimpleStave = function(stave) {
   var self = this;
   self._stave = stave;
   self.reset();
};

QuizzWidgets.SimpleStave.prototype.reset = function() {
   var self = this;
   self._sequence = self._makeSequence(4).concat(self._makeSequence(5));
   self._stave.drawSequence(self._sequence);
};

QuizzWidgets.SimpleStave.prototype.taggleName = function(octave, name, accidental, flag) {
   var self = this;
   for (var i = 0; i < self._sequence.length; ++i) {
      if ((self._sequence[i].notes[0].name == name.toLowerCase()) && (self._sequence[i].notes[0].octave == octave)) {
         self._sequence[i].annotation = flag ? {text: name, position: 10} : null;
         break;
      }
   }
   self._stave.drawSequence(self._sequence);
};

QuizzWidgets.SimpleStave.prototype.taggleSymbol = function(octave, name, accidental, flag) {
   var self = this;
   for (var i = 0; i < self._sequence.length; ++i) {
      if ((self._sequence[i].notes[0].name == name.toLowerCase()) && (self._sequence[i].notes[0].octave == octave)) {
         self._sequence[i].notes[0].color = flag ? 'red' : 'black';
         break;
      }
   }
   self._stave.drawSequence(self._sequence);
};

QuizzWidgets.SimpleStave.prototype._makeSequence = function(octave) {
   return [
            {notes: [{name: 'c', octave: octave}], duration: 4},
            {notes: [{name: 'd', octave: octave}], duration: 4},
            {notes: [{name: 'e', octave: octave}], duration: 4},
            {notes: [{name: 'f', octave: octave}], duration: 4},
            {notes: [{name: 'g', octave: octave}], duration: 4},
            {notes: [{name: 'a', octave: octave}], duration: 4},
            {notes: [{name: 'b', octave: octave}], duration: 4},
         ];
};
 
}(window.QuizzWidgets = window.QuizzWidgets || {}));
