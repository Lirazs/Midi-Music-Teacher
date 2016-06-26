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



}(window.QuizzWidgets = window.QuizzWidgets || {}));
