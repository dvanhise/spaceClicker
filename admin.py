from django.contrib import admin
from spaceClicker.models import Player, GameState

class PlayerAdmin(admin.ModelAdmin):
    fields = ['userId', 'startDate', 'cookieId']
    
# class GameStateAdmin(admin.ModelAdmin):
    # fields = ['player', 'food', 'credits', 'energy', 'metal']

# Register your models here.
admin.site.register(Player, PlayerAdmin)
#admin.side.register(GameState, GameStateAdmin)
