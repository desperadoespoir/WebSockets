/**
 * @description la fonction principale   
 * @author Gabriel Paquette 18xxxxx
 * @author Mohamed Saddik 18xxxxx
 * @copyright Ecole Polytechnique de MontrÃ©al & Course LOG2420
 * @version 1.0.0
 */

let nomUtilisateur='';
let msgObs = new MessagesObserver();
let channelObs = new ChannelsObserver();
let socketClient;

commencerClavardage();
enterKeyboard();
focus();

function commencerClavardage() {
    nomUtilisateur = prompt("Entrer votre nom d'utilisateur SVP");
    
    if (nomUtilisateur != null) {
        if (confirm("par défaut vous êtes dans le groupe \"Général\" . clik sur ok pour continuer")) {
         document.getElementById("user").innerHTML =  nomUtilisateur ;
        } 
    }


    socketClient = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username="+nomUtilisateur);
    socketClient.onmessage = function (evt) { onMessage(socketClient, evt) };
    socketClient.onopen = function(event){};
    
}

 onMessage = (socketClient, evt) =>  {
    var evtData = JSON.parse(evt.data);
				document.getElementById("user").innerHTML = nomUtilisateur ;
	
				if(evtData.eventType == "updateChannelsList" ){
					//Afficher les groupes 
					channelObs.afficherLesGroupes(socketClient,evtData.data,nomUtilisateur);
				}
				else if(evtData.eventType == "onMessage" || evtData.eventType == "onError"){
					//Lire le message envoyé par l'utilisateur
					lireMessages(socketClient,evtData);
				}
				else if(evtData.eventType == "onGetChannel"){
					//Afficher tous les messages envoyés dans un groupe
                    msgObs.afficherMessages( nomUtilisateur,evtData.data.messages);
					scrollDown();//dommage ne fonctionne pas a demander
					
				}
				else if(evtData.eventType == "onLeaveChannel" || evtData.eventType == "onJoinChannel" ){
	
				}
}

$(document).ready(function(){
    $("#createChannel").click(function(){
        creerGroupe();
    });
});


lireMessages = (socket, infos) => {
    $("#listDesMessages").empty();
    var msg = new Message("onGetChannel", infos.channelId , infos.data , null, null );
    socket.send(JSON.stringify(msg));
}

/**
 * ffonctionner la touche "Enter" du clavier lorsque l'utilisateur envoie un message au lieu d'utiliser le 'click' de la souris.
 */
     function enterKeyboard()  {
        document.getElementById("msgBox").addEventListener("keyup",function(event){
          event.preventDefault();
          if(event.keyCode ===13){
            document.getElementById("envoyer").click();
          }
        });
    }

/**
 * a revoir a demander.
 */
    function scrollDown () {
        var element = document.getElementById("listDesMessages");// ne fonctionne pas a voir 
        element.scrollTop = element.scrollHeight;
    }

/**
 * Mettre le curseur automatiquement dans le champs de saisir un message.
 */
    function focus () {
        $("#msgBox").focus();
    }
 /**
 * creation des nouveau groupe .
 */

    function creerGroupe() {
        var newChannel = "";
        newChannel = prompt("Entre le nom du groupe");
        
        if(newChannel == ''){	
            alert("un groupe doit avoir un nom. Veuillez entrer un nom!");
            return;
        }
        else{
            $("#listeDesMessages").empty();
            message = new Message("onCreateChannel", null, newChannel, null, null);
            socketClient.send(JSON.stringify(message));
            document.getElementById("current_group_name").innerHTML = '';
            
              // rederige l'utilisateur vers le groupe "Général"
            channelObs.currentChannel = channelObs.channels["Général"];
            channelObs.joindreGroupe(socketClient,channelObs.currentChannel);
        }
    }
