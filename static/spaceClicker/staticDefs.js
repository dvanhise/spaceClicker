// RESOURCES

var resourceDefinitions = [
  {
    "name":           "credits",
    "buttonName":     "creditsButton",
    "buttonText":     "Mine SpaceCoins",
    "buttonVisible":  true,
    "displayName":    "creditsDisplay",
    "displayText":    "Credits"
  },
  {
    "name":           "food",
    "buttonName":     "foodButton",
    "buttonText":     "Harvest Food",
    "buttonVisible":  true,
    "displayName":    "foodDisplay",
    "displayText":    "Food(kg)"
  },
  {
    "name":           "metal",
    "buttonName":     "metalButton",
    "buttonText":     "Scavenge Metal",
    "buttonVisible":  true,
    "displayName":    "metalDisplay",
    "displayText":    "Metal(kg)"
  },
  {
    "name":           "energy",
    "buttonName":     "energyButton",
    "buttonText":     "Generate Energy",
    "buttonVisible":  true,
    "displayName":    "energyDisplay",
    "displayText":    "Energy(MJ)"
  },
  {
    "name":           "artifacts",
    "buttonName":     "artifactsButton",
    "buttonText":     "Unearth Xeno-artifacts",
    "buttonVisible":  false,
    "displayName":    "artifactsDisplay",
    "displayText":    "Xeno-artifacts"
  },
  {
    "name":           "weapons",
    "buttonName":     "weaponsButton",
    "buttonText":     "Build Weapons",
    "buttonVisible":  false,
    "displayName":    "weaponsDisplay",
    "displayText":    "Crates of weaponry"
  },
  {
    "name":           "biocomponents",
    "buttonText":     "Synthesize Biocompenents",
    "buttonName":     "biocomponentsButton",
    "buttonVisible":  false,
    "displayName":    "biocomponentsDisplay",
    "displayText":    "Biological samples"
  },
  {
    "name":           "rareElements",
    "buttonName":     "rareElementsButton",
    "buttonText":     "Mine Rare Elements",
    "buttonVisible":  false,
    "displayName":    "rareElementsDisplay",
    "displayText":    "Rare elements(kg)"
  }
];


// UPGRADES

var upgradeDefinitions = [
  {
    "id": 1,
    "name": "New GPU",
    "description": "+1 base credits per click",
    "thumbnail": "upgrades/upgrade3.png",
    "cost": { credits:10, food:0, metal:0, energy:0, artifacts:0, weapons:0, biocomponents:0, rareElements:0 },
    "onUpdate": 
      function(resList){
        resList.credits.base += 1.0;
      },
    "availabilityTrigger": 
      function(resList){
        return (resList.credits.getCount() > 20);
      }
  },
  {
    "id": 2,
    "name": "Food replicator",
    "description": "+3 base food per click, uses 1 energy per click",
    "thumbnail": "upgrades/upgrade4.png",
    "cost": { credits:0, food:0, metal:10, energy:10, artifacts:0, weapons:0, biocomponents:0, rareElements:0 },
    "onUpdate": 
      function(resList){
        resList.food.base += 3.0;
        resList.food.onClickEvents.push( function(game){ game.resourceHub.energy.count -= 1; } );
      },
    "availabilityTrigger": 
      function(resList){
        return true;
      }
  }

];


// WORKERS

var workerDefinitions = [
  {
    "id": 1,
    "name": "Scrap-bot",
    "description": "does stuff with things",
    "thumbnail": "workers/worker1.png",
    "clickFreq": 2,
    "restrictions": [ "food", "metal", "energy", "weapons" ],
    "cost": { credits:20, food:0, metal:20, energy:20, artifacts:0, weapons:0, biocomponents:0, rareElements:0 },
    "availabilityTrigger":
    function(resList){
      return true;
    }
  },
  {
    "id": 2,
    "name": "Starving Steve",
    "description": "He's so hungry",
    "thumbnail": "workers/worker2.png",
    "clickFreq": 3,
    "restrictions": [ "credits", "food", "metal", "biocomponents" ],
    "cost": { credits:20, food:40, metal:0, energy:0, artifacts:0, weapons:0, biocomponents:0, rareElements:0 },
    "availabilityTrigger":
      function(resList){
        return (resList.food.getCount() >= 20);
      }
  }

];



// EVENTS

var eventDefinitions = [
  {
    "id": 1,
    "name": "Plasma Storm",
    "description": "The system's star emits a large solar flare turning the planet's atmosphere into a disruptor of charged plasma",
    "effect": "Reduces global generation of energy, becomes more powerful over time",
    "effectFunction": 
      function(resList, time) {
        resList.energy.globalMultiplier -= .01*((time < 50) ? time : 50);
      },
    "thumbnail": "temp",
    "choices": [
      {
        "id": 1,
        "description": "Nuke the storm to fix the problem",
        "requirement":
          function(resList) {
            return (resList.energy.getCount >= 30); 
          },
        "onSelect":
          function(resList) {
            resList.energy.count -= 30; 
          }
      },
      {
        "id": 2,
        "description": "Pay it to go away",
        "requirement":
          function(resList) {
            return (resList.credits.getCount >= 30); 
          },
        "onSelect":
          function(resList) {
            resList.credits.count -= 30; 
          }
      }
    ],
    "availabilityTrigger":
      function(resList) {
        return true;
      },
    "frequency": 5
  }
];
