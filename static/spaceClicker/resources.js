

function ResourceHolder(resourceDefs){

  this.resourceList = [];
  for (def of resourceDefs){
    var a = new Resource(def["name"], def["buttonName"], def["buttonText"], def["buttonVisible"], def["displayName"], def["displayText"]);
    eval("this." + def['name'] + "=a");
    this.resourceList.push(a);
  }

}



ResourceHolder.prototype.getResourceFromName = function(name){
  for (resource of this.resourceList){
    if (resource.name == name){
      return resource;
    }
  }
}


ResourceHolder.prototype.resetResources = function() {
  for (resource of this.resourceList){
    resource.reset();
  }
}


ResourceHolder.prototype.clearVariables = function() {
  for (resource of this.resourceList){
    resource.clearVars();
  }
}


ResourceHolder.prototype.recalculateVariables = function() {
  for (resource of this.resourceList){
    resource.recalculate();
  }
}


ResourceHolder.prototype.canBuy = function(cost) {
  return (cost.credits <= this.credits.count && 
    cost.food <= this.food.count &&
    cost.metal <= this.metal.count &&
    cost.energy <= this.energy.count &&
    cost.artifacts <= this.artifacts.count &&
    cost.weapons <= this.weapons.count &&
    cost.biocomponents <= this.biocomponents.count &&
    cost.rareElements <= this.rareElements.count);
}


//this function should not be called unless canBuy() has already returned true
ResourceHolder.prototype.chargeCost = function(cost) {
  this.credits.count -= cost.credits;
  this.food.count -= cost.food;
  this.metal.count -= cost.metal;
  this.energy.count -= cost.energy;
  this.artifacts.count -= cost.artifacts;
  this.weapons.count -= cost.weapons;
  this.biocomponents.count -= cost.biocomponents;
  this.rareElements.count -= cost.rareElements;
}


ResourceHolder.prototype.updateResourceCounts = function() {
  for (resource of this.resourceList){
    document.getElementById(resource.displayName).innerHTML = resource.displayText + ": " + resource.getCount().toString();
  }
}


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function Resource(name, buttonName, buttonText, buttonVisible, displayName, displayText){

  this.count = 0.0;
  this.clickIncrement = 1.0;
  this.incrementPerSecond = 0.0;
  this.base = 1.0;
  this.baseMultiplier = 1.0;
  this.globalMultiplier = 1.0;
  
  this.onClickEvents = [];
  
  this.name = name;
  this.buttonName = buttonName;
  this.buttonText = buttonText;
  this.buttonVisible = buttonVisible;
  this.displayName = displayName;
  this.displayText = displayText;
  this.workerPoolId = name + "workerpool";
  
  this.assignedWorkers = [];
}


Resource.prototype.reset = function() {
  this.count = 0.0;
  this.clickIncrement = 1.0;
  this.asignedWorkers = [];
}


Resource.prototype.click = function(game){
  this.count += this.clickIncrement;
  for (thing of this.onClickEvents) {
    thing(game);
  }
}


Resource.prototype.autoGenerate = function(){
  this.count += this.incrementPerSecond;
}


Resource.prototype.getCount = function(){
  return Math.floor(this.count);
}

Resource.prototype.setCount = function(newCount){
  this.count = newCount;
}

Resource.prototype.clearVars = function(){
  this.base = 1.0;
  this.baseMultiplier = 1.0;
  this.globalMultiplier = 1.0;
  this.incrementPerSecond = 0.0;
  this.onClickEvents = [];
}


Resource.prototype.recalculate = function(){
  this.clickIncrement = this.base * this.baseMultiplier * this.globalMultiplier;
}


Resource.prototype.addWorker = function(worker) {
  this.assignedWorkers.push(worker);
}

Resource.prototype.removeWorker = function(worker) {
  var index = this.assignedWorkers.indexOf(worker);
  this.assignedWorkers.splice(index, 1);
}
