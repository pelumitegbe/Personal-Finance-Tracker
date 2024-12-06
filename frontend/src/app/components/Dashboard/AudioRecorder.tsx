import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onTransactionComplete: (transaction: any) => void;
  onError: (error: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTransactionComplete, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      onError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.parsedTransaction) {
        const transaction = {
          description: data.parsedTransaction.description,
          amount: parseFloat(data.parsedTransaction.amount),
          transaction_type: data.parsedTransaction.transaction_type,
          category: data.parsedTransaction.category,
        };
        onTransactionComplete(transaction);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      onError('Error processing audio');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={toggleRecording}
        disabled={isProcessing}
        variant="ghost"
        data-testid="mic-button"
        className={`
          relative w-12 h-12 p-0 rounded-full transition-all duration-300 shadow-lg
          flex items-center justify-center
          ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}
          ${isProcessing ? 'bg-gray-400' : ''}
          transform hover:scale-105 active:scale-95
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : isRecording ? (
            <Square className="h-5 w-5 text-white" />
          ) : (
            <Mic className="h-5 w-5 text-white" />
          )}
        </div>
      </Button>
      <p className="text-sm font-medium text-gray-600 mt-2">
        {isProcessing ? 'Processing...' : 
         isRecording ? 'Listening...' : 
         'Tap to speak'}
      </p>
    </div>
  );
};

export default AudioRecorder;