# WebRTC Video Streaming Application

A real-time peer-to-peer video streaming application built with WebRTC, React, and WebSocket signaling server.

## Features

- Real-time video streaming between peers
- WebSocket-based signaling for peer connection establishment
- Sender and receiver components for video transmission
- ICE candidate exchange for NAT traversal
- STUN server integration for connectivity

## Project Structure

```
webRTC/
├── backend/           # WebSocket signaling server
│   ├── src/
│   │   └── index.ts   # WebSocket server implementation
│   ├── package.json
│   └── tsconfig.json
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── sender.tsx      # Video sender component
│   │   │   └── receiver.tsx    # Video receiver component
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Prerequisites

- Node.js (v20.19+ or v22.12+ recommended)
- npm or yarn
- A modern web browser with WebRTC support (Chrome, Firefox, Edge, Safari)
- Camera access for the sender

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Ishan03-25/webRTC.git
cd webRTC
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The WebSocket signaling server will start on `ws://localhost:8080`

### 2. Start the Frontend Application

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### Setting up a Video Call

1. **Open the Receiver** (in one browser tab):
   - Navigate to `http://localhost:5173/receiver`
   - This establishes the receiver connection and waits for incoming video

2. **Open the Sender** (in another browser tab or window):
   - Navigate to `http://localhost:5173/sender`
   - Click the "Send Video" button
   - Allow camera permissions when prompted
   - The video will be sent to the receiver

3. **Verify Connection**:
   - You should see your video in the sender tab
   - The same video should appear in the receiver tab
   - Check browser console for connection logs (ICE states, connection states)

## How It Works

### WebRTC Flow

1. **Signaling Setup**:
   - Both sender and receiver connect to the WebSocket server
   - Server maintains references to both connections

2. **Offer-Answer Exchange**:
   - Sender creates an offer (SDP) and sends it to the server
   - Server forwards the offer to the receiver
   - Receiver creates an answer (SDP) and sends it back through the server
   - Server forwards the answer to the sender

3. **ICE Candidate Exchange**:
   - Both peers gather ICE candidates for connectivity
   - Candidates are exchanged through the WebSocket server
   - STUN server helps with NAT traversal

4. **Media Streaming**:
   - Once the peer connection is established, video tracks flow directly between peers
   - The WebSocket server is no longer involved in media transmission

## Technologies Used

### Backend
- **ws**: WebSocket library for Node.js
- **TypeScript**: Type-safe JavaScript

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **react-router-dom**: Client-side routing
- **WebRTC API**: Browser API for peer-to-peer communication

## API Reference

### WebSocket Messages

#### Sender → Server
```json
{"type": "sender"}
{"type": "createoffer", "sdp": RTCSessionDescription}
{"type": "iceCandidate", "candidate": RTCIceCandidate}
```

#### Receiver → Server
```json
{"type": "receiver"}
{"type": "createanswer", "sdp": RTCSessionDescription}
{"type": "iceCandidate", "candidate": RTCIceCandidate}
```

#### Server → Clients
- Forwards offers from sender to receiver
- Forwards answers from receiver to sender
- Exchanges ICE candidates between peers

## Troubleshooting

### Video not appearing on receiver

1. **Check browser console** for connection errors
2. **Verify WebSocket connection**: Ensure backend is running on port 8080
3. **Check camera permissions**: Sender needs camera access
4. **Open receiver first**: Always open the receiver tab before the sender
5. **Check STUN server**: Ensure connectivity to `stun:stun.l.google.com:19302`

### Connection States

Monitor these in the browser console:
- `connectionState`: Connection status (connecting, connected, disconnected, failed)
- `iceConnectionState`: ICE connection status (checking, connected, completed)
- `iceGatheringState`: ICE candidate gathering status

### Common Issues

- **Camera not accessible**: Check browser permissions
- **Connection timeout**: Firewall or network restrictions
- **No video on receiver**: Ensure tracks are being added with stream parameter

## Development

### Building for Production

#### Backend
```bash
cd backend
npm run build
node dist/index.js
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Future Enhancements

- [ ] Add audio streaming support
- [ ] Implement TURN server for better connectivity
- [ ] Add multiple peer support (group calls)
- [ ] Screen sharing capability
- [ ] Recording functionality
- [ ] Chat feature
- [ ] Connection quality indicators

## License

MIT

## Author

Ishan03-25

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
