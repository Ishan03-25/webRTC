import { useEffect, useRef } from "react";

export default function Sender(){
    const socketRef = useRef<WebSocket | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');
        socketRef.current = socket;
        socket.onopen = () => {
            socket.send(JSON.stringify({type: 'sender'}));
        }
    }, []);
    async function StartSendingVideo(){
        //Create an offer
        const pc = new RTCPeerConnection();
        pcRef.current = pc;
        const offer = await pc.createOffer();//sdp
        await pc.setLocalDescription(offer);
        const socket = socketRef.current;
        // Either this or below one
        if (!socket){
            return;
        }
        socket.send(JSON.stringify({type: 'createoffer', sdp: pc.localDescription}));
        // socket?.send(JSON.stringify({type: 'createoffer', sdp: offer}));//offer or pc.localDescription
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createanswer'){
                pc.setRemoteDescription(message.sdp);
            }
        }
    }
    return (
        <div>
            Sender
            <button onClick={StartSendingVideo}>Send Video</button>
        </div>
    )
}