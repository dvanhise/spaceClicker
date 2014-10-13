
function Event(id, name, description, effect, effectFunc, thumbnail, choices, availabilityTrigger, freq) {

  this.id = id;
  this.name = name;
  this.description = description;
  this.effect = effect;
  this.effectFunction = effectFunc;
  this.thumbnail = thumbnail;
  this.choices = choices;
  this.availabilityTrigger = availabilityTrigger;
  this.frequency = freq;
  
  this.time = 1;
  this.active = false;
  this.available = false;

}


Event.prototype.activate = function() {

}


Event.prototype.takeAction = function(actionId) {

}