from django.shortcuts import get_object_or_404
from django.http import Http404, HttpResponse
from django.template import RequestContext, loader
from django.utils import timezone
from django.conf import settings
from spaceClicker.models import Player, GameState
import datetime, uuid, random, struct, json



def main(request):
  response = HttpResponse()

  # check for session cookie (Mmmm cookies)
  if 'game_session' in request.COOKIES:
    userId = request.COOKIES['game_session']

    try:
      # see if the cookieId is registered
      playerInfo = Player.objects.get(userId=userId)
      userState = "Previous user"
      
    except:
      # create new entry in database, keep same cookie
      playerInfo = createNewUser(userId)
      userState = "No user data found"
  
  else:
    # create new entry in database
    userId = uuid.uid4().hex
    playerInfo = createNewUser(userId)
    userState = "New user"
    
    
  # set or refresh the cookie
  setUserCookie(response, userId)
  id = playerInfo.userId
  resourceCount = playerInfo.gamestate_set.get()
  
  # generate a list of purchased upgrade IDs
  upgradeString = resourceCount.upgrades
  purchasedUpgradeList = []
  for index, upgradeBool in enumerate(upgradeString):
    if int(upgradeBool) == 1:
      purchasedUpgradeList.append(index)
  
  # generate a list of workerID + status integer tuples
  workerString = resourceCount.workers
  workerStatusList = []
  for index, value in enumerate(workerString):
    if value != '0':
      workerStatusList.append({'id': index, 'status': int(value, 16)})
  
  
  browser = request.META.get('HTTP_USER_AGENT', 'unknown')
    
  context = RequestContext(request, {
    'resCount': resourceCount,
    'upgrades': purchasedUpgradeList,
    'workers': workerStatusList,
    'browser': browser,
    'userId': id,
    'userState': userState
  })

  template = loader.get_template('spaceClicker/main.html')
  response.content = template.render(context)
  return response
  
  
  
def setUserCookie(response, userId):
  # maybe use signed cookies in production(?)
  maxAge = 365 * 24 * 60 * 60  #one year
  expires = datetime.datetime.utcnow() + datetime.timedelta(seconds=maxAge)
  response.set_cookie('game_session', userId, max_age=maxAge, expires=expires)


# takes new UUID as an argument, returns the database object for the player
def createNewUser(userId):
  newPlayer = Player(userId=userId, startDate=timezone.now(), lastActiveDate=timezone.now())
  newPlayer.save()
  newPlayer.gamestate_set.create()  # uses default values
  return newPlayer



def save(request):
  if request.method == 'POST':
    try:
      jsonData = json.loads(request.body)
    
      playerInfo = Player.objects.get(userId=jsonData["playerId"])
      # update last played
      playerInfo.lastActiveDate = timezone.now()
      
      state = playerInfo.gamestate_set.get()
      
      # set resource values
      for resName in ["energy", "credits", "food", "metal", "artifacts", "weapons", "biocomponents", "rareElements"]:
        setattr(state, resName, jsonData["resources"][resName])
        
      # set upgrade values
      upgradeBinary = ['0'] * (settings.MAX_UPGRADES)
      for key in jsonData["upgrades"]:
        if jsonData["upgrades"][key]:
          upgradeBinary[int(key)] = '1'
        
      state.upgrades = ''.join(upgradeBinary)
      
      # set worker values
      workerString = ['0'] * (settings.MAX_WORKERS)
      for key in jsonData["workers"]:
        # convert integer to hex digit string
        if jsonData["workers"][key] >= 0 and jsonData["workers"][key] < 10:
          workerString[int(key)] = chr(jsonData["workers"][key] + 48)
        else:
          workerString[int(key)] = chr(jsonData["workers"][key] + 87)
          
      state.workers = ''.join(workerString)
        
      
      playerInfo.save()
      state.save()

    except:
      return HttpResponse("Save Failed")
  
    return HttpResponse("Saved")
    
  return HttpResponse("Invalid Request Type")

  