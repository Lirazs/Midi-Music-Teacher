(function(Common) {

Common.initDeviceList = function(devices, element) {
   var inputs = devices.inputs();
   for (var i = 0; i < inputs.length; ++i) {
      var ID = 'midi_input_' + i.toString();
      var led_type = (inputs[i].state == 'connected')? 'green' : 'red';
      var title = inputs[i].name + ' (' + inputs[i].version + ')';
      element.innerHTML += "<li><div id="+ID+" class='led "+led_type+"'></div><span class='device-name'>"+title+"</span></li>";
      devices.watchInput(inputs[i].port, function(port, state) {
         if (state == 'connected') {
            element.querySelector('#'+ID).classList.remove('red');
            element.querySelector('#'+ID).classList.add('green');
         } else {
            element.querySelector('#'+ID).classList.remove('green');
            elementlist.querySelector('#'+ID).classList.add('red');
         }
      });
   }    
};





Common.feedbackCorrect = function(elementID) {
   document.getElementById(elementID).querySelector('.feedback').classList.remove('none');
   document.getElementById(elementID).querySelector('.feedback').classList.remove('wrong');
   document.getElementById(elementID).querySelector('.feedback').classList.add('correct');
};

Common.feedbackWrong = function(elementID) {
   document.getElementById(elementID).querySelector('.feedback').classList.remove('none');
   document.getElementById(elementID).querySelector('.feedback').classList.remove('correct');
   document.getElementById(elementID).querySelector('.feedback').classList.add('wrong');
};

Common.feedbackNone = function(elementID) { 
   document.getElementById(elementID).querySelector('.feedback').classList.remove('wrong');
   document.getElementById(elementID).querySelector('.feedback').classList.remove('correct');
   document.getElementById(elementID).querySelector('.feedback').classList.add('none');
};


}(window.Common = window.Common  || {}));
