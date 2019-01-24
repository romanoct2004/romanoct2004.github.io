// setup local
//const socket = io('http://172.16.160.184:3000');
//const socket = io('http://localhost:3000');

//heroku
const socket = io('https://webrtc2019.herokuapp.com/');


//Khi mo chhuong trinh an phat chat di
$('#idChat').hide();

//Lay danh sach nguoi dung dang online tu bien DANH_SACH_ONLINE
socket.on('DANH_SACH_ONLINE', userInfo => {
    console.log(userInfo);
    $('#idChat').show();
    $('#idRegistration').hide();
    userInfo.forEach( user => {
        const {ten, peerId} = user;
        //Gan danh sach dang online vao the ul tren index
        $('#listUser').append(`<li id="${peerId}">${ten}</li>`);
    });


    //Lay danh sach nguoi dung dang online tu bien CO_NGUOI_DUNG_MOI
    socket.on('CO_NGUOI_DUNG_MOI', user => {
        console.log(user);
        const {ten, peerId} = user;
        //Gan danh sach dang online vao the ul tren index
        $('#listUser').append(`<li id="${peerId}">${ten}</li>`);
    });  

});

//Khi nguoi dung da co roi thi khong cho dang ky nua
socket.on('NGUOI_DUNG_TON_TAI', () => {
    alert('Tai khoan da duoc dang ky');
});
    

function openStream(){
    const config = {
        audio: true,
        video: true
    };

    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

//openStream().then(
//    stream => playStream('localStream',stream)
//);

const peer = new Peer();
//Khi ket noi peer voi server cua peerjs.com thi no tu dong sinh mot id
peer.on('open', id => { 
    $('#mypeer').append(id);
    //Khi click button dang ky
    $('#btnSignUp').click(() => {
        const username = $('#username').val();
        socket.emit('NGUOI_DUNG_DANG_KY', {ten: username, peerId: id });
    });  
});

//caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream().then(
        stream => {
            //play tream cua chinh chung ta
            playStream('localStream', stream);
            const call = peer.call(id,stream);
            //Lang nghe su kien co tream cua nguoi khac
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        }
    );
});

peer.on('call', call => {
    openStream().then(
        stream => {
            call.answer(stream);
            //play tream cua chinh chung ta
            playStream('localStream', stream);
            //Lang nghe su kien co tream cua nguoi khac
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
        }
    );
});

