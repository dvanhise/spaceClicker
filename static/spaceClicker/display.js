
var WORKER_DISALLOWED_BORDER = '5px solid red';
var WORKER_ALLOWED_BORDER = '5px solid green';
var WORKER_NORMAL_BORDER = '5px solid black';
var staticFileDir = "/static/spaceClicker/";



function updateUpgradePurchaseDisplay(divName, resourceHub, upgradeHub) {
  //clear out the section first
  var section = document.getElementById(divName);
  section.innerHTML = "";

  var sectionHeader = document.createElement('p');
  sectionHeader.innerHTML = "Upgrade Store: "
  section.appendChild(sectionHeader);
  
  for (var upgrade of upgradeHub.upgrades){
    //not bought, available
    if (!upgrade.purchased && upgrade.available){   
      var upgradeElement = upgrade.createElementForStore();
      setStoreElementAttributes(upgradeElement, resourceHub.canBuy(upgrade.cost));
      
      section.appendChild(upgradeElement);
    }
  }
}



function updateOwnedUpgradeDisplay(divName, upgradeHub) {
  var section = document.getElementById(divName);
  section.innerHTML = "";
  
  var sectionHeader = document.createElement('p');
  sectionHeader.innerHTML = "Purchased Upgrades: "
  section.appendChild(sectionHeader);
  
  for (var upgrade of upgradeHub.upgrades){
    if (upgrade.purchased) {
      var upgradeElement = upgrade.createElementForPurchased();
      
      section.appendChild(upgradeElement);
    }
  }
}



function updateWorkerPurchaseDisplay(divName, workerHub, resourceHub) {
  var section = document.getElementById(divName);
  section.innerHTML = "";
  
  var sectionHeader = document.createElement('p');
  sectionHeader.innerHTML = "Worker Store: "
  section.appendChild(sectionHeader);
  
  for (var worker of workerHub.workerList){
    if (!worker.purchased && worker.available) {
      var workerElement = worker.createElementForStore();
      setStoreElementAttributes(workerElement, resourceHub.canBuy(worker.cost));
      
      section.appendChild(workerElement);
    }
  }
}



function updateUnusedWorkerSpace(divName, workerList) {
  var unassignedSection = document.getElementById(divName);
  unassignedSection.innerHTML = "";
  
  for (worker of workerList) {
    if (worker.currentAssignment == null && worker.purchased) {
      var workerItem = worker.createElementForPurchased();
      unassignedSection.appendChild(workerItem);
    }
  }
}



function updateResourceLocations(divName, resList) {
  var section = document.getElementById(divName);
  section.innerHTML = "";
  
  for (resource of resList){
    if (resource.buttonVisible){
      var newResourceBtn = document.createElement("Button");
      newResourceBtn.setAttribute("id", resource.buttonName);
      newResourceBtn.setAttribute("onclick", "game.resourceClick('" + resource.name + "')");
      
      var resourceBtnText = document.createTextNode(resource.buttonText);
      newResourceBtn.appendChild(resourceBtnText);
      section.appendChild(newResourceBtn);
      
      //create divs for workers
      var workerSection = document.createElement("div");
      workerSection.setAttribute("id", resource.name + "workerpool");
      workerSection.setAttribute("class", "workerSpace");
      workerSection.setAttribute("ondrop", "workerDrop(event)");
      workerSection.setAttribute("ondragover", "allowWorkerDrop(event)");
      
      // list all of the workers in that resource's pool
      for (worker of resource.assignedWorkers) {
        var workerItem = worker.createElementForPurchased();
        workerSection.appendChild(workerItem);
      }
      section.appendChild(workerSection);
    }
  }
}



function updateCountDisplay(divName, resList) {
  var section = document.getElementById(divName);
  section.innerHTML = "";
  
  for (resource of resList){
    var newResDisplay = document.createElement("p");
    newResDisplay.setAttribute("id", resource.displayName);
    
    var displayText = document.createTextNode(resource.displayText + ": " + resource.getCount().toString());
    newResDisplay.appendChild(displayText);
    section.appendChild(newResDisplay);
  }
}


// sets classes for element to be greyed out if it costs too much
function setStoreElementAttributes(element, canAfford) {
  if (canAfford) {
    $(element).disabled = false;
    $(element).removeClass("cannotAfford").addClass("canAfford")
  } else {
    $(element).disabled = true;
    $(element).removeClass("canAfford").addClass("cannotAfford");
  }
}
