
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
        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();//sdp
            await pc.setLocalDescription(offer);
            socketRef.current?.send(JSON.stringify({type: 'createoffer', sdp: pc.localDescription}));
        }
        const socket = socketRef.current;

        if (!socket){
            alert('Socket not connected yet');
            return;
        }

        //video/audio
        pc.onicecandidate = (event) => {
            if (event.candidate){
                socket.send(JSON.stringify({type: 'iceCandidate', candidate: event.candidate}));
            }
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createanswer'){
                pc.setRemoteDescription(message.sdp);
            } else if (message.type === 'iceCandidate'){
                pc.addIceCandidate(message.candidate);
            }
        }

        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        pcRef.current?.addTrack(stream.getTracks()[0]);
    }
    return (
        <div>
            Sender
            <button onClick={StartSendingVideo}>Send Video</button>
        </div>
    )
}