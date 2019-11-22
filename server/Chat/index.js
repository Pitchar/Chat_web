var express = require('express');
var Storage = require('../Storage');
var Router = express.Router();

Router.get('/users', function (req, res) {
    Storage.getData('users')
        .then(function (users) {
            res.json(users);
        }).catch(function (error) {
            res.sendStatus(500).json(error);
        });
});

Router.get('/messages', function (req, res) {
    Storage.getData('messages')
        .then(function (messages) {
            res.json(messages);
        }).catch(function (error) {
            res.sendStatus(500).json(error);
        });
});

Router.post('/users', function (req, res) {
    var user = req.body.users;

    Storage.getData('users')
        .then(function (users) {
            return new Promise(function (resolve, reject) {
                Storage.saveData('users', user, users)
                    .then(function (message) {
                        resolve(message);
                    }).catch(function (err) {
                        reject(err);
                    })
            })
        }).then(function (message) {
            res.json(message);
        }).catch(function (err) {
            res.sendStatus(500).json(err);
        })
});

Router.post('/messages', function (req, res) {
    var message = req.body.message;

    Storage.getData('messages')
        .then(function (messages) {
            return new Promise(function (resolve, reject) {
                Storage.saveData('messages', message, messages)
                    .then(function (message) {
                        resolve(message);
                    }).catch(function (err) {
                        reject(err);
                    })
            })
        }).then(function (message) {
            res.json(message);
        }).catch(function (err) {
            res.sendStatus(500).json(err);
        })
});

module.exports = Router;

(function(document, window, undefined, $){
  (function (){
    return Chat = {
      //Todo el codigo
      apiUrl: '/chat',
      $userDataModal: $('#modalCaptura'),
      $btnMessage: $('#$btnMessage'),
      $messageText: $('$messageText'),
      userName: '',

      Init: function(){
        var self = this
        this.fetchUserInfo(function (user){ //fetchUserInfo: sera la enargada de mostrar el modal y pedirle al usuario que ingrese un nombre de usuario.
          self.renderUser(user)// una vez finalizada lo anterior renderUser se encarga de agregar el usuario que acaba de igresar al documento html.
        })
      },
      fetchUserInfo: function(callback){ // se ejecurata cuando termine todas las operaciones.
        var self = this
        this.$userDataModal.openModal()
        var $GuardaInfo = $('.guardaInfo')
        $GuardaInfo.on('click', function(){ // escuchamos el boton de guardar, cuando se activa capturamos el nombre y lo asignamos
          var nombre = $('.nombreUsuario').val()
          var user = [{nombre: nombre, img: 'p2.png'}]
        callback(user) // se ejecuta el callback y finaliza.


        self.joinUser(user[0])// esta funcion se encarga de enviar una peticion http al servidor de formato post a la ruta. #users. para notificar que un nuevo usurio se unio a la conversacion.


          self.userName = nombre
          self.$userDataModal.closeModal()
        })

        self.getInitialUsers() // esta funcion se encarga de hacer una petition http de tipo get a la rura users utilizando ajax de jQuery.
      },
      getInitialUsers: function(){
        var self = this
        var endpoint = self.apiUrl + '/users' //concatenamos al url inicial con el endpoint de los usurios
        self.ajaxRequest(endpoint, 'GET', {})
            .done(function (data){ // mandamos la peticion y cuando lleguen los datos de los usurios los renderizamos.
              var users = data.current
              self.renderUser(users)
            }).fail(function (err){
              console.log(err)
            })
      },
        ajaxRequest: function(url, type, data){ // funcion con el fin de poder ser reutilizable y la peticion sea total mente configurable. ademas que se pueden enviar como argumentos la url, type, y los datos a enviar.
          return $.ajax({
            url: url,
            type: type,
            data: data
          })
        },
        joinUser: function(user){
          var self = this
          var endpoint = self.apiUrl + '/users'
          var userObj = {user: user}
          self.ajaxRequest(endpoint, 'POST', userObj)
              .done(function (confirm){
                console.log(confirm)
              }).fail(function (error){
                alert(error)
              })
        },
        renderUser: function(users){
          var self = this
          var userList = $('.users-list')
          var userTemplate = '<li class="collecion-item avatar">' +
                             '<img src="image/:image:" class="circle">' +
                             '<span class="title">:nombre:</span>' +
                             '<p><img src="image/online.png"/> En linea </p>' +
                             '</li>'
          users.map(function (user){
            var newUser = userTemplate.replace(':image:', 'p2.jpg')
                                      .replace(':nombre', user.nombre)
          })
        },
        watcMessages: function(){
          var self = this
          self.$messageText.on('keypress', function(e){
            if(e.which == 13){
              if($(this),val().trin()!=''){
                var message = {
                  sender: self.userName,
                  text: $(this).val()
                }
                self.renderMessage(message)
                $(this).val('')
              }else{
                e.preventDefault()
              }
            }
          })
          self.$btnMessage.on('click', function(){
            if(self.$messageText.val()!=''){
              var message = {
                sender: self.userName,
                text: $(this).val()
              }
              self.renderMessage(message)
              self.$messageText.val('')
            }
          })
        },
        renderMessage: function(message){
          var self = this
          var tipoMensaje = message.sender == self.userName ? 'recibidos' : 'enviados'
          var messageList = $('.historial-chat')
          var messageTemplate = '<div class=":tipoMensaje:">'+
                                  '<div class="mensaje">'+
                                    '<div class="imagen">'+
                                    '<img src="image/p2.jpg" alt="Contacto"/>'+
                                    '</div'+
                                    '<div class="texto">' +
                                      '<span class="nombre">:nombre:</span><br>'+
                                      '<span>:mensaje:</span>'+
                                    '</div>'+
                                    '<div class="hora">'+
                                      '<span class="numHora">:hora:</span>'+
                                    '</div>'+
                                  '</div>'+
                                '</div>';
          var currentDate = new Date()
          var newMessage = messageTemplate.replace('tipoMensaje', tipoMensaje)
                                          .replace(':nombre:', message.sender)
                                          .replace(':mensaje:', message.text)
                                          .replace(':hora:', currentDate.getHours() +  currentDate.getMinutes())
          messageList.append(newMessage)
          $(".scroller-chat").animate({ scrollTop: $(".scroller-char").get(0).scrollHeight},500)


        }

    }
  })()
  Chat.Init()
})(document, window, undefined, jQuery)
