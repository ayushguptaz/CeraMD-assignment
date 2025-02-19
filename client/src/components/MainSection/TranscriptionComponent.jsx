import React, { useState, useRef } from 'react';
// const dotenv = require("dotenv");
function TranscriptionComponent() {
  const [status, setStatus] = useState('Not Connected');
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState(false);

  
  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  
  const startRecording = async () => {
    if (recording) return; 

    
    setTranscript('');
    setStatus('Connecting ...');

    try {
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

     
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        alert('Browser does not support audio/webm');
        return;
      }

      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      

     
      socketRef.current = new WebSocket('wss://api.deepgram.com/v1/listen?diarize=true', [
        'token',
        "c3c663a872b2d42e066503e49677f254a217c0fd",
      ]);

     
      socketRef.current.onopen = () => {
        setStatus('Connected');
        mediaRecorderRef.current.start(1000); 
      };

     
      socketRef.current.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const portion = received.channel?.alternatives[0]?.transcript;
        console.log(portion)
        if (portion && received.is_final) {
          setTranscript((prev) => prev + portion + ' ');
        }
      };

    
      socketRef.current.onclose = () => {
        setStatus('Not Connected');
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

     
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0 && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(event.data);
        }
      });

      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setStatus('Microphone error');
    }
  };

 
  const stopRecording = () => {
    if (!recording) return; 

    // 1. Stop the MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
     
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    setRecording(false);
    setStatus('Not Connected');
  };

  return (
    <div>
      <h1></h1>
      <p>Status: {status}</p>
      <p>Transcript: {transcript}</p>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
    </div>
  );
}

export default TranscriptionComponent;
