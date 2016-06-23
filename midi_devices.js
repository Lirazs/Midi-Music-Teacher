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


}(window.Midi = window.Midi || {}));
