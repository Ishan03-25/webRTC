import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port: 8080});

let senderSocket: null | WebSocket = null;
let receiverSocket: null | WebSocket = null;

wss.on('connection', function connection(ws){
    ws.on('error', console.error);
    ws.on('message', function message(data: any){
        const message = JSON.parse(data);
        console.log(`Received message: ${message}`);
        if (message.type === 'sender'){
            senderSocket = ws;
            console.log('Sender set');
        } else if (message.type === 'receiver'){
            receiverSocket = ws;
            console.log('Receiver set');
        } else if (message.type === 'createoffer'){
            if (ws !== senderSocket){
                return;
            }
            receiverSocket?.send(JSON.stringify({type: 'createoffer', sdp: message.sdp}));
            console.log('Offer sent to receiver');
        } else if (message.type === 'createanswer'){
            if (ws !== receiverSocket){
                return;
            }
            senderSocket?.send(JSON.stringify({type: 'createanswer', sdp: message.sdp}));
            console.log('Answer sent to sender');
        } else if (message.type === 'iceCandidate'){
            if (ws === senderSocket){
                receiverSocket?.send(JSON.stringify({type: 'iceCandidate', candidate: message.candidate}));
            } else if (ws === receiverSocket){
                senderSocket?.send(JSON.stringify({type: 'iceCandidate', candidate: message.candidate}));
            }
        }
    })
})