//<script src="vexflow-min.js"></script>

(function(Score) {


Score.Stave = function(canvasId, clef_name, time_signature) {
   var self = this;

   self._clef_name = clef_name;
   self._canvas = document.getElementById(canvasId);
   self._renderer = new Vex.Flow.Renderer(self._canvas, Vex.Flow.Renderer.Backends.CANVAS);
   self._ctx = self._renderer.getContext();
   self._width = self._canvas.width-10;
   self._stave = new Vex.Flow.Stave(0, 0, self._width);
   self._stave.addClef(clef_name);
   if (time_signature) {
      self._stave.addTimeSignature(time_signature);
   }
   self._stave.setContext(self._ctx);
   self._stave.draw();
};

Score.Stave.prototype.clear = function() {
   var self = this;
   self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);
   self._stave.draw();
};


Score.Stave.prototype.drawBeat = function(notes, duration, annotation) {
   var self = this;

   var voice_notes = new Vex.Flow.Voice({ num_beats: 1, beat_value: duration, resolution: Vex.Flow.RESOLUTION });
   voice_notes.addTickables([self._makeBeat(notes, duration)]);

   var text_notes = new Vex.Flow.Voice({ num_beats: 1, beat_value: duration, resolution: Vex.Flow.RESOLUTION });
   text_notes.addTickables([self._beatAnnotation(duration, annotation)]);

   self._draw(voice_notes, text_notes);
};


Score.Stave.prototype.drawSequence = function(beats) {
   var self = this;

   var seq = self._makeSequence(beats);

   var voice_notes = new Vex.Flow.Voice({ num_beats: seq.num_beats, beat_value: seq.beat_value, resolution: Vex.Flow.RESOLUTION });
   voice_notes.addTickables(seq.notes);

   var text_notes = new Vex.Flow.Voice({ num_beats: seq.num_beats, beat_value: seq.beat_value, resolution: Vex.Flow.RESOLUTION });
   text_notes.addTickables(seq.annotation);

   self._draw(voice_notes, text_notes);
};


Score.Stave.prototype._draw = function(voice, annotation) {
   var self = this;
   self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);
   var formatter = new Vex.Flow.Formatter().joinVoices([voice, annotation]).format([voice, annotation], self._width);
   self._stave.draw();
   voice.draw(self._ctx, self._stave);
   annotation.draw(self._ctx, self._stave);
};



Score.Stave.prototype._makeBeat = function(notes, duration) {
   var self = this;

   var keys = [];
   notes.forEach(function (note_info) {
      keys.push(note_info.name+"/"+(note_info.octave || '4'));
   });
   
   var stave_note = new Vex.Flow.StaveNote({ keys: keys, duration: duration.toString(), clef: self._clef_name, auto_stem: true });

   for (var i = 0; i < notes.length; ++i) {
      if (notes[i].accidental) {
         stave_note.addAccidental(i, new Vex.Flow.Accidental(notes[i].accidental));
      }
   }
   return stave_note;
};

Score.Stave.prototype._beatAnnotation = function(duration, annotation) {
   var self = this;
   var annotation = annotation || {text: '', position: 0};
   var text_note = new Vex.Flow.TextNote({ text: annotation.text,
                                           font: {family: 'Arial', size: 10, weight: ''},
                                           duration: duration.toString() }).setLine(annotation.position).setJustification(Vex.Flow.TextNote.Justification.LEFT).setContext(self._ctx);
   return text_note;
};



Score.Stave.prototype._makeSequence = function(beats) {
   var self = this;

   var stave_notes = [];
   var text_notes = [];
   var total_duration = 0;
   beats.forEach(function (beat_info) {
      stave_notes.push(self._makeBeat(beat_info.notes, beat_info.duration));
      text_notes.push(self._beatAnnotation(beat_info.duration, beat_info.annotation));
      total_duration += 32/beat_info.duration;
   });

   return {notes: stave_notes, num_beats: total_duration, beat_value: 32, annotation: text_notes};
};



}(window.Score = window.Score || {}));

