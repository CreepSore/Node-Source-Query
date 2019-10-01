# Node-Source-Query  
### ⚙ A Node Source-Query emulator ⚙  

### Dependencies
* [smart-buffer](https://www.npmjs.com/package/smart-buffer)

### 🖼 Screenshots 🖼
![ScreenShot1](https://github.com/CreepSore/Node-Source-Query/blob/master/.resources/screenshot_main.png)
![ScreenShot2](https://github.com/CreepSore/Node-Source-Query/blob/master/.resources/screenshot_players.png)

  
### How to Use:  
#### 🔨 Installation 🔨

1. Get the Repository  
  `git clone https://github.com/CreepSore/Node-Source-Query.git`
2. Configurate the [Config-File](https://github.com/CreepSore/Node-Source-Query/blob/master/config/config.json) at /config/config.json
3. Start it  
  `npm start`

#### ⚙ Config ⚙  
- 🔗 ***Connection*** 🔗
  - **port**
    Port that the Query uses to listen
  - **mask**
    Address-Mask that the Query uses to filter a specific Address(-Group)
    
- 📝 ***Serverdata*** 📝
  - **appid**  
    This ID gets used by the Steam-Server-Browser to open the correct Game. This can be spoofed by setting the ID to one of the Game-IDs. I recommend using [SteamDB](https://steamdb.info/apps/) to find out which game has which ID.  
  - **environment**  
    The OS-Environment that gets sent to the Client.  
    *w = windows*  
    *l = linux*  
    *m = mac*  
  - **servertype**  
    The Servertype that gets sent to the Client.  
    *d = dedicated*  
    *l = Non-Dedicated*  
    *p = Source-TV-Relay*  
  - **hostname**  
    The Server-Name that gets sent to the Client.  
  - **gamename**  
    The Game-Name that gets sent to the Client.  
  - **mapname**  
    The Map-Name that gets sent to the Client.  
  - **foldername**  
    ?  
  - **playercount**  
    The Playercount that gets sent to the Client.  
  - **maxplayers**  
    The maximum Playercount that gets sent to the Client.  
  - **botcount**  
    The Botcount that gets sent to the Client. Used to determine wether or not to show the Bot-Icon in the Browser.  
  - **isVAC**  
    Used to set the Valve Anti-Cheat Security on or off.  
  - **isPrivate**  
    Used to set the Server Password-Protected  
  - **players**  
    Array of Players that gets sent to the Client. Default-Order = Biggest to Smallest Score  
    *index = id of the player*  
    *name = name of the player*  
    *score = score of the player*  
    *time =  time since player is on the server*  
