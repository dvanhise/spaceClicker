
function gameStuff(){
  this.resourceHub = new ResourceHolder(resourceDefinitions);
  this.upgradeHub = new UpgradeHolder(upgradeDefinitions);
  this.workerHub = new WorkerHolder(workerDefinitions);
  
  
  this.eventList = [];
  this.eventAccessDict = {};
  this.currentEvents = 0;

  for (eventDef of eventDefinitions) {
    var newEvent = new Event(eventDef.id, eventDef.name, eventDef.description, eventDef.effect, eventDef.effectFunction, 
      eventDef.thumbnail, eventDef.choices, eventDef.availabilityTrigger, eventDef.freq);
    this.eventList.push(newEvent);
    this.eventAccessDict[eventDef.id.toString()] = newEvent;
  }

}


//Display------------------------------------------------------------

gameStuff.prototype.updateResourceDisplay = function() {
  updateResourceLocations("resourceSection", this.resourceHub.resourceList);
  updateCountDisplay("countSection", this.resourceHub.resourceList);
}

gameStuff.prototype.updateUpgradeDisplay = function() {
  this.upgradeHub.testForAvailability(this.resourceHub);
  updateUpgradePurchaseDisplay("upgradeStore", this.resourceHub, this.upgradeHub);
  updateOwnedUpgradeDisplay("purchasedUpgrades", this.upgradeHub);
}

gameStuff.prototype.updateWorkerDisplay = function() {
  this.workerHub.testForAvailability(this.resourceHub);
  updateWorkerPurchaseDisplay("workerStore", this.workerHub, this.resourceHub);
  updateUnusedWorkerSpace("unassignedworkerpool", this.workerHub.workerList)
}


gameStuff.prototype.testForAvailability = function() {
  this.workerHub.testForAvailability(this.resourceHub);
  this.upgradeHub.testForAvailability(this.resourceHub);
}


gameStuff.prototype.priceCheck = function() {
  this.workerHub.priceCheck(this.resourceHub);
  this.upgradeHub.priceCheck(this.resourceHub);
}



//Variable initialization----------------------------------------------

gameStuff.prototype.setUpgrade = function(upgradeId) {
  var a = this.upgradeHub.getUpgradeFromId(upgradeId);
  a.purchased = true;
  a.available = true;
}


gameStuff.prototype.setResourceCount = function(resName, count) {
  this.resourceHub.getResourceFromName(resName).setCount(count);
}

gameStuff.prototype.setWorker = function(workerId, status) {
  this.workerHub.getWorkerFromId(workerId).setStatus(status, this.resourceHub);
}


//Player interaction---------------------------------------------------

gameStuff.prototype.resourceClick = function(resName) {
  this.resourceHub.getResourceFromName(resName).click(this);
  this.resourceHub.updateResourceCounts();
}


gameStuff.prototype.purchaseUpgrade = function(upgradeId) {
  var upgrade = this.upgradeHub.getUpgradeFromId(upgradeId);
  if (this.resourceHub.canBuy(upgrade.cost) && upgrade.available && !upgrade.purchased) {
    upgrade.purchaseUpgrade();
    this.resourceHub.chargeCost(upgrade.cost);
    this.updateResourceVariables();
    this.resourceHub.updateResourceCounts();
  }
}


gameStuff.prototype.sellUpgrade = function(upgradeId) {

}


gameStuff.prototype.purchaseWorker = function(workerId) {
  var worker = this.workerHub.getWorkerFromId(workerId);
  if (this.resourceHub.canBuy(worker.cost) && worker.available && !worker.purchased) {
    worker.purchase();
    this.resourceHub.chargeCost(worker.cost);
    this.resourceHub.updateResourceCounts();
  }
}


// move the worker to a new resource pool, newRes = null if moving to unassigned pool
gameStuff.prototype.reassignWorker = function(workerId, newRes) {
  var worker = this.workerHub.getWorkerFromId(workerId);
  var targetResource = (newRes == null) ? null : this.resourceHub.getResourceFromName(newRes);
  
  if (worker.currentAssignment != targetResource) {
    
    if (worker.currentAssignment != null) {
      worker.currentAssignment.removeWorker(worker);
    }
    
    if (targetResource != null) {
      targetResource.addWorker(worker);
      worker.currentAssignment = targetResource;
    } else {
      worker.currentAssignment = null;
    }
  }
}


// see if event triggers
gameStuff.prototype.eventCheck = function() {

  if (this.currentEvents < 1) {
    this.checkEventAvailability();
    
  
  }
  // are max events not already occuring
    // RNG is new event should start
      // make selection
}

// player makes event choice


gameStuff.prototype.resetGame = function() {
  //clear everything
  this.upgradeHub.resetUpgrades();
  this.resourceHub.resetResources();
  this.workerHub.resetWorkers();
  
  //reevaluate resources
  this.updateResourceVariables();
  
  //regenerate the displays
  this.updateResourceDisplay();
  this.updateUpgradeDisplay();
}


//Other----------------------------------------------------------------

gameStuff.prototype.checkEventAvailability = function() {
  for (event of this.eventList) {
    if (!event.available && event.availabilityTrigger(this.resourceHub.resourceList)) {
      event.available = true;
    }
  }
}


gameStuff.prototype.workerClick = function() {
  for (resource of this.resourceHub.resourceList) {
    for (worker of resource.assignedWorkers) {
      if (worker.clickCheck()) {
        resource.click(this);
        this.resourceHub.updateResourceCounts();
      }
    }
  }
}


gameStuff.prototype.updateResourceVariables = function() {
  this.resourceHub.clearVariables();
  this.upgradeHub.updateResources(this.resourceHub);
  this.resourceHub.recalculateVariables();
}


// can the worker be assigned to the resource?
gameStuff.prototype.workerIdResourceMatch = function(workerId, resource) {
  var worker = this.workerHub.getWorkerFromId(workerId);
  return (worker.restrictions.indexOf(resource.name) != -1);
}

