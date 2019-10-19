/**
 * @description ConnectionHandler 
 * @author Gabriel Paquette 18xxxxx
 * @author Mohamed Saddik 18xxxxx
 * @copyright Ecole Polytechnique de MontrÃ©al & Course LOG2420
 * @version 1.0.0
 */


class ChannelsObserver{

    /**
     * Un contructeur par défaut
     * Attributs : -le channel courant.
     * 				-une liste de tous les channels.
     */
        constructor(){
            this.currentChannel = new Channel();
            this.channels = {};
        }
    
    /**
    * Ajouter tous les channels dans la liste "channels"
    */
        push(channel){
            this.channels[channel.name] = channel;
        }
    
    /**
    * Afficher tous les groupes
    * Nous appelons la fonction push sur chaque channel pour qu'on l'ajoute dans la liste
    * Nous avons démarrer le bind pour le click 
    */
   afficherLesGroupes(socket,listChannel,username){
            var localThis = this;
    
            $("#listDesGroups").empty();
            listChannel.forEach(channel => {
    
                // cette fonction  permet d'afficher chaque groupe
                this.afficherGroupe(channel);
                localThis.push(channel);
                $("#group"+channel.id ).bind( "click", localThis.groupeCourant(socket,channel,username));
            })
        }
    
    /**
    * Par défaut l'utilisateur est un membre dans le groupe "Général".
    * le icones (+)  (-) permet de joindre et quitter le groupe.
    *
    * 
    * */
        groupeCourant(socket,channel,username){
            var localThis = this;
            if(!localThis.currentChannel.id){
                name="Général";
                localThis.currentChannel = localThis.channels[name];
                localThis.joindreGroupe(socket,localThis.currentChannel);
                return;
            }
            else {
                //Quand l'utilisateur clique sur le nom du groupe
                 $("#group"+channel.id ).bind( "click", function(){
                    if(channel.joinStatus == false){
                        alert("il faut s'inscrire au gourpe en clickant sur le bouton (+) SVP");
                    }
                    else{
                        name = $("#group"+channel.id).attr("href");
                        localThis.currentChannel = localThis.channels[name];
                        localThis.joindreGroupe(socket,localThis.currentChannel,username);
                    }
                 });
                 //Quand l'utilisateur clique sur l'icon (+) ou (-) du groupe
                 $("#icon"+channel.id ).bind( "click", function(){
                     if(channel.joinStatus == false){
                        name = $("#group"+channel.id).attr("href");
                        localThis.currentChannel = localThis.channels[name];
                        localThis.switcherPlusVersMoins(localThis.currentChannel);
                        localThis.joindreGroupe(socket,localThis.currentChannel,username);
                        return
                     }
                     else{
                        name = $("#group"+channel.id).attr("href");
                        localThis.currentChannel = localThis.channels[name];
                         localThis.switcherMoinsVersPlus(localThis.currentChannel);
                         localThis.quitterGroupe(socket,localThis.currentChannel,username);
                         return;
                     }
                 });
            }
            localThis.envoyerMessage(socket,channel);
        }
    /**
    * cette  fonction premet de rejoindre un groupe et de changer le groupe courrant.
    */
        joindreGroupe(socket,channel,username){
             $("#listDesMessages").empty();
            $("#msgBox").focus();
             var msg = new Message("onJoinChannel", channel.id , null , username, null );
             socket.send(JSON.stringify(msg));
             document.getElementById("current_group_name").innerHTML = channel.name;
         }
    
    /**
    *  cette fonction permet de quiter le  groupe et réderige l'utilsateur vers le groupe "Général".
    * 
    */
         quitterGroupe(socket,channel,username){
             $("#listDesMessages").empty();
             // Un message est envoyé aux membres pour les informer que l'utilisateur a quitté le groupe.
            var msg1 = new Message("onMessage", channel.id , ''+username+" a quitté le groupe \'"+channel.name+'\'' , username , Date.now());
            var msg2 = new Message("onLeaveChannel", channel.id , null , username, Date.now());	
            socket.send(JSON.stringify(msg1));
            socket.send(JSON.stringify(msg2));
            document.getElementById("current_group_name").innerHTML = '';
            this.currentChannel = this.channels["Général"];
            this.joindreGroupe(socket,this.currentChannel,username);
         }
    
    /**
    *  cette fonction permet d'envoyer un message en cliquant sur le bouton "envoyer" ou en appuyant sur la toucher "Enter" 
    */
         envoyerMessage(socket,channel){
             var localThis=this;
              var doc = document.getElementById("msgBox");
            document.getElementById("envoyer").onclick = function(){
                if(doc.value){
                    var msg = new Message("onMessage", localThis.currentChannel.id , doc.value , null, null);
                    socket.send(JSON.stringify(msg));
                    $("#msgBox").val('');
                }
                else{
                    alert("Saisir un message!");
                }
            }	
         }
    
    /**
    * cette fonctions permet de switcher l'icon entre (+) et (-).
    */
         switcherPlusVersMoins(channel){
            var doc = document.getElementById("icon"+channel.id);
            doc.removeAttribute("style");
            doc.style.color="#367DFE";
    
            doc.classList.remove("glyphicon-plus");
            doc.classList.add("glyphicon-minus");
         }
     /**
    * cette fonctions permet de switcher l'icon entre (-) et (+).
    */
         switcherMoinsVersPlus(channel){
             var doc = document.getElementById("icon"+channel.id);
            doc.removeAttribute("style");
            doc.style.color="#367DFE";
    
            doc.classList.remove("glyphicon-minus");
            doc.classList.add("glyphicon-plus");
         }
    
    /**
    * afficher tous les groupes
    * icone etoile pour groupe par défault 
    * et icone (+)et(-) pour joindre et quitter le groupe 
    */
         afficherGroupe(channel){
                var p = document.createElement("p");
                p.setAttribute("id", "icon"+channel.id);
                p.setAttribute("href", channel.name);
                p.classList.add("glyphicon");
                p.classList.add("pointer");
               		
               
                var bontton = document.createElement("BUTTON");
                bontton.setAttribute("id", "group"+channel.id);
                bontton.setAttribute("href", channel.name);
                var text = document.createTextNode(channel.name);	
                
                var li = document.createElement("li");
                li.classList.add("list-group-item");
                li.appendChild(p);
                li.appendChild(bontton);
                li.appendChild(bontton).appendChild(text);
    
                if(channel.name == "Général"){
                    var defaut ="Défaut";
                    var span = document.createElement("span");
                    var defautG = document.createTextNode(defaut);
                    li.appendChild(span).appendChild(defautG);
    
                    span.classList.add("GroupsForm");
                    p.classList.add("glyphicon-star");
                    p.classList.remove("pointer");	
                    p.style.color="#F6DC12";
                }
    
                else{
                     if(channel.joinStatus ==true){
                        p.classList.add("glyphicon-minus");
                        p.style.color="#F6DC12";
                     }
                     else if(channel.joinStatus ==false){
                          p.classList.add("glyphicon-plus");
                          p.style.color="blue";
                     }
                }
                document.getElementById("listDesGroups").appendChild(li);		
         }
    }