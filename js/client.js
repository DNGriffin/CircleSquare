/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();



Client.sendPos = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('cords', function(y){
  movePlayer(y);
});
