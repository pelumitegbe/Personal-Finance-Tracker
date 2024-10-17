import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from 'lucide-react';

interface AudioRecorderProps {
  onTransactionComplete: (transaction: {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
  }) => void;
  onError: (error: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTransactionComplete, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = sendAudioToApi;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      onError('Failed to access microphone. Please ensure you have given permission to use the microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToApi = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Received transcription from API:", data.transcription);
      console.log("Parsed transaction:", data.parsedTransaction);
      
      // Validate the parsed transaction
      if (!data.parsedTransaction.type || !['income', 'expense'].includes(data.parsedTransaction.type)) {
        console.error("Invalid transaction type:", data.parsedTransaction.type);
        onError("Invalid transaction type received from API");
        return;
      }

      onTransactionComplete(data.parsedTransaction);
    } catch (error) {
      console.error('Error sending audio to API:', error);
      onError(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Button
      onClick={toggleRecording}
      className={`p-2 ${isRecording ? 'bg-red-500' : 'bg-primary'} text-primary-foreground hover:bg-primary/90`}
    >
      {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </Button>
  );
};

export default AudioRecorder;