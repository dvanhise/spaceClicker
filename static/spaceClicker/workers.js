
function WorkerHolder(workerDefs) {
  this.workerList = []; 
  this.workerAccessDict = {};

  for (wkr of workerDefs){
    var newWorker = new Worker(wkr.id, wkr.name, wkr.description, wkr.thumbnail, wkr.clickFreq, wkr.restrictions, wkr.availabilityTrigger, wkr.cost);
    this.workerList.push(newWorker);
    this.workerAccessDict[wkr.id.toString()] = newWorker;
  }
  
}


WorkerHolder.prototype.getWorkerFromId = function(id) {
  return this.workerAccessDict[id.toString()];
}


WorkerHolder.prototype.testForAvailability = function(resList){
  for (var worker of this.workerList){
    // if the worker has not been purchased and is not already available
    if (!worker.purchased && !worker.available){
      if (worker.availabilityTrigger(resList)){
        worker.available = true;
        
        var section = document.getElementById("workerStore");
        var workerElement = worker.createElementForStore();
        setStoreElementAttributes(workerElement, resList.canBuy(worker.cost));
        
        section.appendChild(workerElement);
      }
    }
  }
}


WorkerHolder.prototype.priceCheck = function(resList) {
  for (var worker of this.workerList) {
    if (worker.available && !worker.purchased) {
      workerElement = document.getElementById("worker" + worker.id.toString());
      setStoreElementAttributes(workerElement, resList.canBuy(worker.cost));
    }
  }

}


WorkerHolder.prototype.resetWorkers = function() {
  for (worker of this.workerList) {
    worker.reset();
  }
}



////////////////////////////////////////////////////////////////////////////////

function Worker(id, name, description, thumbnail, clickFreq, restrictions, availabilityTrigger, cost){

  this.id = id;
  this.name = name;
  this.description = description;
  this.thumbnail = thumbnail;
  this.clickFreq = clickFreq;
  this.restrictions = restrictions;
  this.availabilityTrigger = availabilityTrigger;
  this.cost = cost;
  
  this.clickCounter = 0;
  this.currentAssignment = null;   // points to a resource object or null if unassigned
  this.purchased = false;
  this.available = false;
  this.deleted = false;

}


Worker.prototype.getDbNumber = function() {
  var resourceDbIds = {
    "credits":        3,
    "food":           4,
    "metal":          5,
    "energy":         6,
    "artifacts":      7,
    "weapons":        8,
    "biocomponents":  9,
    "rareElements":   10
  };
  // deleted - 12
  // unassigned - 11
  // does not exist - 0
  // unavailable, unpurchased - 1
  // available, unpurchased - 2
  
  if (this.deleted) {
    return 11;
  } else if (!this.purchased) {
    if (this.available) {
      return 2;
    } else {
      return 1;
    }
  } else {
    if (this.currentAssignment.name === null) {
      return 11;
    } else {
      return resourceDbIds[this.currentAssignment.name];
    }
  }
}


Worker.prototype.setStatus = function(statusNum, resHub) {
  
  if (statusNum == 1) {
    this.available = false;
    this.purchased = false;
  } else if (statusNum == 2) {
    this.available = true;
    this.purchased = false;
  } else if (statusNum >= 3 && statusNum <= 10) {
    var assignedResName;
    switch (statusNum) {
      case 3:
        assignedResName = "credits";
        break;
      case 4:
        assignedResName = "food";
        break;
      case 5:
        assignedResName = "metal";
        break;
      case 6:
        assignedResName = "energy";
        break;
      case 7:
        assignedResName = "artifacts";
        break;
      case 8:
        assignedResName = "weapons";
        break;
      case 9:
        assignedResName = "biocomponents";
        break;
      case 10:
        assignedResName = "rareElements";
        break;
    }
    resource = resHub.getResourceFromName(assignedResName);
    this.currentAssignment = resource;
    resource.addWorker(this);
    
    this.available = true;
    this.purchased = true;
  
  } else if (statusNum == 11) {
    this.available = true;
    this.purchased = true;
    this.currentAssignment = null;
  } else if (statusNum == 12) {
    this.deleted = true;
  } else {
    alert("invalid worker status id");
  }
}


// should get called continually after a set amount of time, returns true if a click should occur
Worker.prototype.clickCheck = function() {
  this.clickCounter++;
  if (this.clickCounter >= this.clickFreq) {
    this.clickCounter = 0;
    return true;
  }
  return false;
}


Worker.prototype.purchase = function() {
  this.purchased = true;
  this.currentAssignment = null;
  
  // remove worker from the store
  var storeSection = document.getElementById("workerStore");
  var workerElement = document.getElementById("worker" + this.id.toString());
  storeSection.removeChild(workerElement);
  
  // add it to the pool of unassigned workers
  var unassignedSection = document.getElementById("unassignedworkerpool");
  workerElement = this.createElementForPurchased();

  unassignedSection.appendChild(workerElement);
}


Worker.prototype.reset = function() {
  this.currentAssignment = null;
  this.purchased = false;
  this.available = false;
  this.deleted = false;
}


Worker.prototype.createElementForStore = function() {
  var workerElement = document.createElement('img');
  workerElement.setAttribute("src", staticFileDir + this.thumbnail);
  workerElement.setAttribute("id", "worker" + this.id.toString());
  workerElement.setAttribute("onclick", "game.purchaseWorker(" + this.id.toString() + ")");
  workerElement.setAttribute("onMouseOver", "showTooltip(this)");
  workerElement.setAttribute("onMouseOut", "hideTooltip()");
  
  return workerElement;
}


Worker.prototype.createElementForPurchased = function() {
  var workerElement = document.createElement('img');
  workerElement.setAttribute("src", staticFileDir + this.thumbnail);
  workerElement.setAttribute("id", "worker" + this.id.toString());
  workerElement.setAttribute("draggable", "true");
  workerElement.setAttribute("ondragstart", "workerDragStart(event)");
  workerElement.setAttribute("ondragend", "workerDragEnd(event)");
  workerElement.setAttribute("onMouseOver", "showTooltip(this)");
  workerElement.setAttribute("onMouseOut", "hideTooltip()");
  
  return workerElement;
}


Worker.prototype.createTooltip = function() {
  var tooltipList = [];
  
  tooltipList.push(this.name + ' (worker)');
  
  var costStr = '';
  for (var res in this.cost) {
    if (this.cost[res] != 0) {
      costStr += res + ':' + this.cost[res].toString() + ' ';
    }
  }
  tooltipList.push(costStr);

  tooltipList.push(this.description);
  tooltipList.push("Restrictions: " + this.restrictions.join(', '));
  
  return tooltipList;
}

