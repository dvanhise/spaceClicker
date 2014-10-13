
function UpgradeHolder(upgradeDefs){

  this.upgrades = [];

  for (def of upgradeDefs){
    var a = new Upgrade(def["id"], def["name"], def["description"], def["thumbnail"], def["cost"], def["onUpdate"], def["availabilityTrigger"]);
    this.upgrades.push(a);
  }
  
  this.upgradeAccessDict = {};
  
  for (var upgrade of this.upgrades){
    this.upgradeAccessDict[upgrade.id.toString()] = upgrade;
  }
  
}


UpgradeHolder.prototype.getUpgradeFromId = function(id) {
  return this.upgradeAccessDict[id.toString()];
}


UpgradeHolder.prototype.updateResources = function(resourceList) {
  for (var upgrade of this.upgrades){
    if (upgrade.purchased){
      upgrade.onUpdate(resourceList);
    }
  }
}


UpgradeHolder.prototype.testForAvailability = function(resList) {
  for (var upgrade of this.upgrades){
    // if the upgrade has not been purchased and is not already available
    if (!upgrade.purchased && !upgrade.available){
      if (upgrade.availabilityTrigger(resList)){
        upgrade.available = true;
        
        var section = document.getElementById("upgradeStore");
        var upgradeElement = upgrade.createElementForStore();
      
        setStoreElementAttributes(upgradeElement, resList.canBuy(upgrade.cost));
        
        section.appendChild(upgradeElement);
      }
    }
  }
}


UpgradeHolder.prototype.priceCheck = function(resList) {
  for (var upgrade of this.upgrades) {
    if (upgrade.available && !upgrade.purchased) {
      upgradeElement = document.getElementById("upgrade" + upgrade.id.toString());
      setStoreElementAttributes(upgradeElement, resList.canBuy(upgrade.cost));
    }
  }
}


UpgradeHolder.prototype.resetUpgrades = function(){
  for (var upgrade of this.upgrades){
    upgrade.reset();
  }
}




///////////////////////////////////////////////////////////
// upgrade class


function Upgrade(id, name, description, thumbnail, cost, onUpdate, availabilityTrigger){
  this.id = id;
  this.cost = cost;
  this.name = name;
  this.description = description;
  this.thumbnail = thumbnail;

  this.onUpdate = onUpdate;
  this.availabilityTrigger = availabilityTrigger;
  this.available = false;
  this.purchased = false;

  // to add later: icon, flavor text
  
}

Upgrade.prototype.reset = function() {
  this.available = false;
  this.purchased = false;
}


Upgrade.prototype.purchaseUpgrade = function() {
  this.purchased = true;
  
  // remove the upgrade from the store
  var section = document.getElementById("upgradeStore");
  var upgradeElement = document.getElementById("upgrade" + this.id.toString());
  section.removeChild(upgradeElement);
  
  // add it to the list of purchased upgrades
  section = document.getElementById("purchasedUpgrades");
      
  var upgradeElement = this.createElementForPurchased();
  section.appendChild(upgradeElement);
}


Upgrade.prototype.sellUpgrade = function() {
  this.purchased = false;
  
  // remove upgrade from the purchased area
  var section = document.getElementById("purchasedUpgrades");
  var upgradeElement = document.getElementById("upgrade" + this.id.toString());
  section.removeChild(upgradeElement);
  
  
  // add it back to the upgrade store
  section = document.getElementById("upgradeStore");
  upgradeElement = this.createElementForStore();
  section.appendChild(upgradeElement);
}


Upgrade.prototype.createElementForStore = function() {
  var upgradeElement = document.createElement("img");
  upgradeElement.setAttribute("src", staticFileDir + this.thumbnail);
  upgradeElement.setAttribute("id", "upgrade" + this.id.toString());
  upgradeElement.setAttribute("onclick", "game.purchaseUpgrade(" + this.id.toString() + ")");
  upgradeElement.setAttribute("onMouseOver", "showTooltip(this)");
  upgradeElement.setAttribute("onMouseOut", "hideTooltip()");
  
  return upgradeElement;
}


Upgrade.prototype.createElementForPurchased = function() {
  var upgradeElement = document.createElement("img");
  upgradeElement.setAttribute("src", staticFileDir + this.thumbnail);
  upgradeElement.setAttribute("id", "upgrade" + this.id.toString());
  upgradeElement.setAttribute("onclick", "game.sellUpgrade(" + this.id.toString() + ")");
  upgradeElement.setAttribute("onMouseOver", "showTooltip(this)");
  upgradeElement.setAttribute("onMouseOut", "hideTooltip()");
  
  return upgradeElement;
}


Upgrade.prototype.createTooltip = function() {
  var tooltipList = [];
  
  tooltipList.push(this.name + ' (upgrade)');
  
  var costStr = '';
  for (var res in this.cost) {
    if (this.cost[res] != 0) {
      costStr += res + ':' + this.cost[res].toString() + ' ';
    }
  }
  tooltipList.push(costStr);

  tooltipList.push(this.description);
  
  return tooltipList;
}

