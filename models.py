from django.db import models


MAX_UPGRADES = 1000
MAX_WORKERS = 100

class Player(models.Model):
  userId = models.CharField(max_length=32, unique=True)  # Stores a UUID
  startDate = models.DateTimeField('First time played')
  lastActiveDate = models.DateTimeField('Most recent time played')
  
  def __unicode__(self):
    return self.userId


class GameState(models.Model):
  player = models.ForeignKey(Player, unique=True)
  energy = models.IntegerField(default=0)
  food = models.IntegerField(default=0)
  credits = models.IntegerField(default=0)
  metal = models.IntegerField(default=0)
  artifacts = models.IntegerField(default=0)
  weapons = models.IntegerField(default=0)
  biocomponents = models.IntegerField(default=0)
  rareElements = models.IntegerField(default=0)
  
  upgrades = models.CharField(max_length=MAX_UPGRADES, default='0'*MAX_UPGRADES)
  workers = models.CharField(max_length=MAX_WORKERS, default='0'*MAX_WORKERS)
  def __unicode__(self):
    return str([self.energy, self.food, self.credits, self.metal, self.artifacts, self.weapons, self.biocomponents, self.rareElements])