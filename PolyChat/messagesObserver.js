/**
 * @description MessagesObserver  afficher les messages   
 * @author Gabriel Paquette 18xxxxx
 * @author Mohamed Saddik 18xxxx
 * @copyright Ecole Polytechnique de MontrÃ©al & Course LOG2420
 * @version 1.0.0
 */

class MessagesObserver {
	constructor(){}

/**
 * Afficher tous les messages envoyés dans un groupe. Les messages de l'utilisateur  à droite 
 *	et les messages des autres utilisateurs  à gauche. 
 */
    afficherMessages(nomUtilisateur,messagesArray){
		var localThis = this;
		$("#listDesMessages").empty();
		messagesArray.forEach(message => {  // fonction flecher pour forEach woww
			localThis.afficherMessage(nomUtilisateur, message);
        })
    }
    afficherMessage(nomUtilisateur,message){
        var ul = document.createElement("UL");
        var li = document.createElement("Li");
        var nom= document.createElement("p");
        var temps = document.createElement("p");
        var text = document.createTextNode(message.data);
        var msgExpediteur = document.createTextNode(message.sender);
        var tempExpedition = document.createTextNode(new Date(message.timestamp).toString().substring(0,21));
        ul.appendChild(li);
        li.appendChild(text)
        temps.appendChild(tempExpedition);
        document.getElementById("listDesMessages").appendChild(nom);
		document.getElementById("listDesMessages").appendChild(ul);
        document.getElementById("listDesMessages").appendChild(temps);
       
        ul.classList.add("col-lg-12");
        temps.classList.add("styleTemps");
      
        if (message.sender!== nomUtilisateur){
            nom.classList.add("styleUtilisateur");
            nom.appendChild(msgExpediteur);

            temps.classList.add("messageRecuGauche");
            $(".messageRecuGauche").css({"text-align": "left"});

            li.classList.add("expediteur");
			li.classList.add("col-lg-6");
            $(".expediteur").css({"background-color":"#ffc266" , "border-color":"#ffc266"});
           
           
        }
        else{
            temps.classList.add("messageEnvoyeDroite");
            $(".messageEnvoyeDroite").css({"text-align": "right"});

            li.classList.add("monNomUtilisateur");
			li.classList.add("col-lg-offset-6");
            li.classList.add("col-lg-6");
            $(".monNomUtilisateur").css({"background-color" : "#66a3ff", "color":"white", "border-color":"#66a3ff" });
        }

        li.classList.add("boiteMsg");
    }
}