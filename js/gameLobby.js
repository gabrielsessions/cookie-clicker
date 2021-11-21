
//GAME STATUS NUMBERS
//0 = Lobby is open
//1 = Game in progress

var joinedLobby = false;
var joinedGame = false;
var lobbyCountInterval;

//Checks if there if the lobby is open. If open, the user can join a game.
function joinGameLobby(){
    
    if (!joinedLobby){
        joinedLobby = true;
        
        var interval = window.setInterval(() => {
            gameStatus = myAirtable.getEntryValue("GameStatus");
            if (gameStatus == 0){
                document.getElementById('logonMessage').innerHTML = "Game Satus: Connected to Airtable, Ready to Join a Game!"
                joinGame();
                clearInterval(interval);
            }
            else{
                document.getElementById('logonMessage').innerHTML = "Game Satus: Connected to Airtable, Game Currently in progress. <br> Please wait for the next game.";
            }
            

        }, 100)
        
    }
    
}

//When the looby is open, the user will be able to join the game using a button
function joinGame(){
    var joinGameDiv = document.createElement('div');
    joinGameDiv.setAttribute('id', 'joinGameDiv');
    joinGameDiv.setAttribute('class', 'logon');

    var lobbyCount = document.createElement('h3');
    lobbyCount.setAttribute('id', 'lobbyCount');

    lobbyCountInterval = window.setInterval(() => {
        var numPlayers = myAirtable.getEntryValue('NumPlayers');
        document.getElementById('lobbyCount').innerHTML = "Number of Players in Lobby: " + numPlayers;
    }, 100);

    

    var joinGameButton = document.createElement('button');
    joinGameButton.setAttribute('class', 'button1');
    joinGameButton.setAttribute('id', 'joinGameButton');
    joinGameButton.setAttribute('onclick', 'joinLeaveGame()');
    joinGameButton.innerHTML = "Join Game";

    joinGameDiv.innerHTML += "<br>"

    joinGameDiv.append(lobbyCount);

    joinGameDiv.innerHTML += "<br>"

    joinGameDiv.append(joinGameButton);


    document.body.appendChild(joinGameDiv);

}

//Either the user to join or leave game
function joinLeaveGame(){
    if (myAirtable.getEntryValue('NumPlayers') < 0){
        myAirtable.setEntryValueStrict('NumPlayers', 0);
    }

    //console.log(myAirtable.getEntryValue('NumPlayers') + ", " + joinedGame);
    if (myAirtable.getEntryValue("GameStatus") == 0){

        //If number of players is less than zero, the counter resets to zero
        

        //If in game, button will allow user to leave game
        if (joinedGame){
            joinedGame = false;
            document.getElementById('joinGameButton').innerHTML = "Join Game";
            myAirtable.setEntryValueStrict('NumPlayers', myAirtable.getEntryValue('NumPlayers') - 1);
            document.getElementById("logonMessage").innerHTML = "Game Satus: Connected to Airtable, Waiting to Join Game";

            try{
                document.getElementById('startGameButton').remove();
            }
            catch{

            }
        }

        //If not in game, button will allow user to join the game
        else if (!joinedGame){
            joinedGame = true;

            //Make the first player to join a game the gamemaster
            if (myAirtable.getEntryValue('NumPlayers') == 0){
                gameMasterControls();
            }

            document.getElementById('joinGameButton').innerHTML = "Leave Game";
            myAirtable.setEntryValueStrict('NumPlayers', myAirtable.getEntryValue('NumPlayers') + 1);
            document.getElementById("logonMessage").innerHTML = "Game Satus: Joined Game, Waiting for Game to Start";

            //Constantly check if a game has started:
            checkIfGameStarted();

        }
    }

}


//The gamemaster has the ability to start a game
function gameMasterControls(){

    var startButtonDiv = document.createElement('div');
    startButtonDiv.setAttribute('class', 'logon');
    startButtonDiv.setAttribute('id', 'startGameButton');
    startButtonDiv.innerHTML = "<br>"

    
    var startGameButton = document.createElement('button');
    startGameButton.setAttribute('class', 'button1');
    startGameButton.setAttribute('style', 'text-align:center');
    startGameButton.setAttribute('id', 'startGameButton');
    startGameButton.setAttribute('onclick', 'startGame()');
    startGameButton.innerHTML = "Start Game";

    startButtonDiv.append(startGameButton);
    

    document.body.appendChild(startButtonDiv);
}


function startGame(){
    myAirtable.setEntryValueStrict('GameStatus', 1);
}


function checkIfGameStarted(){
    var gameStartCheck = window.setInterval(() => {
        if (myAirtable.getEntryValue('GameStatus') == 1){
            clearInterval(lobbyCountInterval);
            clearInterval(gameStartCheck);
            try{
                document.getElementById('startGameButton').remove();
            }
            catch{

            }

            document.getElementById('nameForm').remove();
            document.getElementById('joinGameDiv').remove();
            countdown();

        }
    }, 100);
}