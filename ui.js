(function(Widgets) {

Widgets.set_progress = function(timer_id, caption, rotation) {
   var timer = document.getElementById(timer_id);
   timer.querySelector('.caption').innerHTML = caption;

   var boundary = timer.querySelector('.boundary');
   boundary.querySelector('.halfcirc').style.transform = 'rotate('+Math.floor(rotation*360).toString()+'deg)';
   if (rotation > 0.5) {
      boundary.classList.add('postmiddle');
      boundary.querySelector('.halfcirc.second').style.visibility = 'visible';
   } else {
      boundary.classList.remove('postmiddle');
      boundary.querySelector('.halfcirc.second').style.visibility = 'hidden';
   }
};



Widgets.CountDown = function(seconds, step, on_zero, on_down) {
   var self = this;
   self._seconds = seconds;
   self._step = step;
   self._timer = setInterval(function() {
      self._seconds = Math.max(self._seconds-self._step, 0);
      if (on_down) {
         on_down(self);
      }
      if (self._seconds == 0) {
         self._seconds = 0;
         clearInterval(self._timer);
         if (on_zero) {
            on_zero(self);
         }
      }
   }, step);
};

Widgets.CountDown.prototype.abort = function() {
   var self = this;
   clearInterval(self._timer);
};

Widgets.CountDown.prototype.remaining = function() {
   var self = this;
   return self._seconds;
};


}(window.Widgets = window.Widgets || {}));
