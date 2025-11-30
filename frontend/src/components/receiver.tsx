import { useEffect, useRef } from "react";

export default function Receiver() {
    const socketRef = useRef<WebSocket | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');
        socketRef.current = socket;
        socket.onopen = () => {
            socket.send(JSON.stringify({type: 'receiver'}));
        }
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createoffer'){
                //Create an answer
                const pc = new RTCPeerConnection();
                pcRef.current = pc;
                pc.setRemoteDescription(message.sdp);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socketRef.current?.send(JSON.stringify({type: 'createanswer', sdp: pc.localDescription}));//sdp: answer
                //Or 
                // const socket = socketRef.current;
                // socket?.send(JSON.stringigfy({type: 'createanswer', sdp: answer}));
            } else if (message.type === 'createanswer'){
                //set the remote description
            } else if (message.type === 'iceCandidate'){
                //add the ice candidate
            }
        }
    }, []);
    return (
        <div>
            Receiver
        </div>
    )
}