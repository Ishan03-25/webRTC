import { useEffect, useRef } from "react";

export default function Receiver() {
    const socketRef = useRef<WebSocket | null>(null);
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');
        socketRef.current = socket;
        socket.onopen = () => {
            socket.send(JSON.stringify({type: 'receiver'}));
        }
        const video = document.createElement('video');
        document.body.appendChild(video);
        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createoffer'){
                //Create an answer
                const pc = new RTCPeerConnection();
                pcRef.current = pc;
                pc.setRemoteDescription(message.sdp);
                pc.onicecandidate = (event) => {
                    if (event.candidate){
                        socket?.send(JSON.stringify({type: 'iceCandidate', candidate: event.candidate}));
                    }
                }
                pc.ontrack = (event) => {
                    video.srcObject = new MediaStream([event.track]);
                    video.play();
                }
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
                pcRef.current?.addIceCandidate(message.candidate);
            }
        }
    }, []);
    return (
        <div>
            <h2>Receiver</h2>
            <video ref={videoRef} autoPlay playsInline style={{width: '400px', marginTop: '10px'}} />
        </div>
    )
}