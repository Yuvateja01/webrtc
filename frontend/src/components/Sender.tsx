import {useEffect,useState} from "react"



export const Sender = ()=>{
     const [socket,setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen = () =>{
            socket.send(JSON.stringify({type:'sender'}))
        }
        setSocket(socket)
    },[]);

    async function startSendingVideo(){
        if(!socket) return;
        const peerConnection = new RTCPeerConnection();

        peerConnection.onnegotiationneeded = async ()=>{
            console.log("negotiation")
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket?.send(JSON.stringify({type:'createOffer',sdp:peerConnection.localDescription}));
        }
        

        peerConnection.onicecandidate = (event)=>{
            console.log(event)
            if(event.candidate){
                socket.send(JSON.stringify({type:'iceCandidate',candidate:event.candidate}))
            }
        }
        

        socket.onmessage = async(event) =>{
            const data = JSON.parse(event.data);
            if(data.type === 'createAnswer'){
                await peerConnection.setRemoteDescription(data.sdp)
            }
            else if(data.type === 'iceCandidate'){
                peerConnection.addIceCandidate(data.candidate)
            }
        }

   navigator.mediaDevices.getUserMedia({video:true,audio:false}).then((stream) => {
    // Do something with the stream
    console.log("Camera access granted", stream);
     peerConnection.addTrack(stream.getVideoTracks()[0]);
  })
  .catch((error) => {
    console.error("Error accessing camera: ", error);
  });
       
    }
   return  <div>
    <button onClick={startSendingVideo}>Send Video</button>
   </div>
}