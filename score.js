//<script src="vexflow-min.js"></script>
//   KeySignature:
//	  MAJOR_KEYS:
//	    "C"
//	    "F"
//	    "Bb"
//	    "Eb"
//	    "Ab"
//	    "Db"
//	    "Gb"
//	    "Cb"
//	    "G"
//	    "D"
//	    "A"
//	    "E"
//	    "B"
//	    "F#"
//	    "C#"
//
//	  MINOR_KEYS:
//	    "Am"
//	    "Dm"
//	    "Gm"
//	    "Cm"
//	    "Fm"
//	    "Bbm"
//	    "Ebm"
//	    "Abm"
//	    "Em"
//	    "Bm"
//	    "F#m"
//	    "C#m"
//	    "G#m"
//	    "D#m"
//	    "A#m"


(function(Score) {

Score._makeStave = function(ctx, clef_name, y_position, width, time_signature, key_signature) {
   var stave = new Vex.Flow.Stave(5, y_position, width);
   stave.addClef(clef_name);
   if (time_signature) {
      stave.addTimeSignature(time_signature);
   }
   stave.addKeySignature(key_signature || "C");
   stave.setContext(ctx);
   stave.draw();
   return stave;
};


Score._makeBeat = function(clef_name, notes, duration) {
   var keys = [];
   notes.forEach(function (note_info) {
      keys.push(note_info.name+"/"+(note_info.octave || '4'));
   });
   
   var stave_note = new Vex.Flow.StaveNote({ keys: keys, duration: duration.toString(), clef: clef_name, auto_stem: true });

   for (var i = 0; i < notes.length; ++i) {
      if (notes[i].accidental) {
         stave_note.addAccidental(i, new Vex.Flow.Accidental(notes[i].accidental));
      }
      if (notes[i].color) {
         stave_note.setKeyStyle(i, {strokeStyle: notes[i].color, fillStyle: notes[i].color});
      }
   }
   return stave_note;
};


Score._beatAnnotation = function(ctx, duration, annotation) {
   var annotation = annotation || {text: '', position: 0};
   var text_note = new Vex.Flow.TextNote({ text: annotation.text,
                                           font: {family: 'Arial', size: 10, weight: ''},
                                           duration: duration.toString() }).setLine(annotation.position).setJustification(Vex.Flow.TextNote.Justification.LEFT).setContext(ctx);
   return text_note;
};


Score._makeSequence = function(clef_name, ctx, beats) {
   var stave_notes = [];
   var text_notes = [];
   var total_duration = 0;
   beats.forEach(function (beat_info) {
      stave_notes.push(Score._makeBeat(clef_name, beat_info.notes, beat_info.duration));
      text_notes.push(Score._beatAnnotation(ctx, beat_info.duration, beat_info.annotation));
      total_duration += 32/beat_info.duration;
   });

   return {notes: stave_notes, num_beats: total_duration, beat_value: 32, annotation: text_notes};
};

Score._makeVoices  = function(clef_name, ctx, beats) {
   var seq = Score._makeSequence(clef_name, ctx, beats);
   var voice_notes = new Vex.Flow.Voice({ num_beats: seq.num_beats, beat_value: seq.beat_value, resolution: Vex.Flow.RESOLUTION });
   voice_notes.addTickables(seq.notes);

   var text_notes = new Vex.Flow.Voice({ num_beats: seq.num_beats, beat_value: seq.beat_value, resolution: Vex.Flow.RESOLUTION });
   text_notes.addTickables(seq.annotation);

   return {tones: voice_notes, text: text_notes};
};








Score.Stave = function(canvasId, clef_name, time_signature, key_signature) {
   var self = this;

   self._clef_name = clef_name;
   self._canvas = document.getElementById(canvasId);
   self._renderer = new Vex.Flow.Renderer(self._canvas, Vex.Flow.Renderer.Backends.CANVAS);
   self._ctx = self._renderer.getContext();
   self._width = self._canvas.width-10;
   self._stave = Score._makeStave(self._ctx, clef_name, 10, self._width, time_signature, key_signature);
};

Score.Stave.prototype.clear = function() {
   var self = this;
   self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);
   self._stave.draw();
};


Score.Stave.prototype.drawBeat = function(notes, duration, annotation) {
   var self = this;

   var voice_notes = new Vex.Flow.Voice({ num_beats: 1, beat_value: duration, resolution: Vex.Flow.RESOLUTION });
   voice_notes.addTickables([Score._makeBeat(self._clef_name, notes, duration)]);

   var text_notes = new Vex.Flow.Voice({ num_beats: 1, beat_value: duration, resolution: Vex.Flow.RESOLUTION });
   text_notes.addTickables([Score._beatAnnotation(self._ctx, duration, annotation)]);

   self._draw(voice_notes, text_notes);
};


Score.Stave.prototype.drawSequence = function(beats) {
   var self = this;
   var voices = Score._makeVoices(self._clef_name, self._ctx, beats);
   self._draw(voices.tones, voices.text);
};


Score.Stave.prototype._draw = function(voice, annotation) {
   var self = this;
   self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);
   var formatter = new Vex.Flow.Formatter().joinVoices([voice, annotation]).format([voice, annotation], self._width);
   self._stave.draw();
   voice.draw(self._ctx, self._stave);
   annotation.draw(self._ctx, self._stave);
};




Score.GreatStave = function(canvasId, time_signature, key_signature) {
   var self = this;

   self._canvas = document.getElementById(canvasId);
   self._renderer = new Vex.Flow.Renderer(self._canvas, Vex.Flow.Renderer.Backends.CANVAS);
   self._ctx = self._renderer.getContext();
   self._width = self._canvas.width-10;

   self._treble_stave = Score._makeStave(self._ctx, "treble", 10, self._width, time_signature, key_signature);
   self._bass_stave = Score._makeStave(self._ctx, "bass", 100, self._width, time_signature, key_signature);
   self._brace = new Vex.Flow.StaveConnector(self._treble_stave, self._bass_stave);
   self._brace.setType(Vex.Flow.StaveConnector.type.BRACKET);
   self._brace.setContext(self._ctx);
};

Score.GreatStave.prototype.clear = function() {
   var self = this;
   self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);
   self._treble_stave.draw();
   self._bass_stave.draw();
   self._brace.draw();
};

Score.GreatStave.prototype.sequence = function(treble_beats, bass_beats) {
   var self = this;
   var treble_voices = Score._makeVoices("treble", self._ctx, treble_beats);
   var bass_voices = Score._makeVoices("bass", self._ctx, bass_beats);

   self._ctx.clearRect(0, 0, self._canvas.width, self._canvas.height);

   var formatter = new Vex.Flow.Formatter();
   formatter.joinVoices([treble_voices.tones, treble_voices.text]);
   formatter.joinVoices([bass_voices.tones, bass_voices.text]);
   formatter.format([treble_voices.tones, bass_voices.tones, treble_voices.text, bass_voices.text], self._width);

   self._treble_stave.draw();
   self._bass_stave.draw();
   self._brace.draw();
   treble_voices.tones.draw(self._ctx, self._treble_stave);
   treble_voices.text.draw(self._ctx, self._treble_stave);
   bass_voices.tones.draw(self._ctx, self._bass_stave);
   bass_voices.text.draw(self._ctx, self._bass_stave);
};


}(window.Score = window.Score || {}));

