import {useEffect} from "react"

export const Receiver = ()=>{
     useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen = () =>{
            socket.send(JSON.stringify({type:'receiver'}))
        }
        
        socket.onmessage = async(event) =>{
            const message = JSON.parse(event.data)
            let peerConnection:RTCPeerConnection | null =  null;
            if(message.type === 'createOffer'){
                peerConnection =  new RTCPeerConnection();

                peerConnection.ontrack = (event) =>{
                    console.log(event)
                    const video = document.createElement('video');
                    document.body.appendChild(video);
                    video.srcObject = new MediaStream([event.track]);
                    video.muted = true
                    video.play();
                }
                peerConnection.onicecandidate = (event)=>{
                console.log(event)
                if(event.candidate){
                    socket.send(JSON.stringify({type:'iceCandidate',candidate:event.candidate}))
                    }
                }
                await peerConnection.setRemoteDescription(message.sdp)
                const answer = await peerConnection.createAnswer()
                await peerConnection.setLocalDescription(answer)
                socket.send(JSON.stringify({type:'createAnswer',sdp:peerConnection.localDescription}));
            }
            else if(message.type === 'iceCandidate'){
                if(peerConnection != null){
                //@ts-ignore
                peerConnection.addIceCandidate(message.candidate)
                }
                
            }
        }
    },[]);


    return <div>Receiver
    </div>
}