(function(Midi) {

Midi.Devices = function(onInit) {
   var self = this;
   self._midi = null;
   self._supported = null;

   if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({sysex: false}).then(  function(midi) {
                                                            self._midi = midi;
                                                            self._supported = true;
                                                            if (onInit) {onInit(true);}
                                                         },
                                                         function(msg) {
                                                            self._supported = false;
                                                            if (onInit) {onInit(false, msg);}
                                                         });
   }
};

Midi.Devices.prototype.supported = function() {
   var self = this;
   return self._supported;
};

Midi.Devices.prototype.inputs = function() {
   var self = this;
   if (self._midi) {
      return self._devices(self._midi.inputs);
   }
   return [];
};

Midi.Devices.prototype.outputs = function() {
   var self = this;
   if (self._midi) {
      return self._devices(self._midi.outputs);
   }
   return [];
};

Midi.Devices.prototype.watchInput = function(input_port, onStatus) {
   var self = this;
   if (self._midi) {
      self._midi.inputs.forEach(function(device) {
         if (device.id === input_port) {
            device.onstatechange = function(state_event) {
               onStatus(state_event.port.id, state_event.port.state);
            };
         }
      });
   }
};

Midi.Devices.prototype.unwatchInput = function(input_port) {
   var self = this;
   if (self._midi) {
      self._midi.inputs.forEach(function(device) {
         if (device.id === input_port) {
            device.onstatechange = null;
         }
      });
   }
};

Midi.Devices.prototype.openInput = function(input_port, onNote) {
   var self = this;
   if (self._midi) {
      self._midi.inputs.forEach(function(device) {
         if (device.id === input_port) {
            device.onmidimessage = function(midi_event) {
               onNote(device.id, { time:     midi_event.timeStamp,
                                   command:  midi_event.data[0] >> 4,
                                   channel:  midi_event.data[0] & 0xf,
                                   note:     midi_event.data[1],
                                   velocity: midi_event.data[2] });
            };
         }
      });
   }
};

Midi.Devices.prototype.closeInput = function(input_port) {
   var self = this;
   if (self._midi) {
      self._midi.inputs.forEach(function(device) {
         if (device.id === input_port) {
            device.onmidimessage = null;
            device.close();
         }
      });
   }
};

Midi.Devices.prototype._devices = function(devices) {
   var self = this;

   var results = [];
   for (var curr_device of devices) {
      var device = curr_device[1];
      results.push({ port:           device.id,
                     name:           device.name,
                     manufacturer:   device.manufacturer,
                     version:        device.version,
                     state:          device.state,
                     connection:     device.connection});
   }
   return results;
};



Midi.Controller = function(onInit, onPress, onRelease) {
   var self = this;
   self._devices = new Midi.Devices(function(flag, msg) {
      if (!flag) {
         onInit(false, self._devices, msg);
         return;
      }
      onInit(true, self._devices, '');

      var inputs = self._devices.inputs();
      for (var i = 0; i < inputs.length; ++i) {
         self._devices.openInput(inputs[i].port, function(port, midi_event) {
            var octave_number = Math.floor((midi_event.note-12)/12);
            var note_index = (midi_event.note-12)%12;
            if (midi_event.command == 0x09) { // Note On
               if ((midi_event.velocity < 2) || (midi_event.velocity == 64))  {
                  onRelease(octave_number, note_index);
               } else {
                  onPress(octave_number, note_index);
               }
            } else if (midi_event.command == 0x08) { // Note Off
               onRelease(octave_number, note_index);
            }
         });
      }
   });
};




}(window.Midi = window.Midi || {}));
