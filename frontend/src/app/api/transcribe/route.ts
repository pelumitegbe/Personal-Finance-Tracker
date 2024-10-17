import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
import fs from 'fs';
import os from 'os';
import path from 'path';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface ParsedTransaction {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  try {
    const buffer = await audioFile.arrayBuffer();
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, 'temp_audio.wav');

    fs.writeFileSync(tempFilePath, Buffer.from(buffer));

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3-turbo",
      response_format: "verbose_json",
    });

    fs.unlinkSync(tempFilePath);

    const currentDateTime = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const prompt = `The current date and time is: ${currentDateTime}.
    Parse the following transaction description into a JSON object with keys: description(which must be concise and relevant), amount, type (income or expense), category, and date. If no specific date is mentioned in the transaction, use the current date provided above. Here's the transaction description:

    "${transcription.text}"

    Respond only with the JSON object, no additional text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.2-11b-text-preview",
      temperature: 0.2,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from language model');
    }

    const parsedTransaction: ParsedTransaction = JSON.parse(content);

    return NextResponse.json({ 
      transcription: transcription.text,
      parsedTransaction: parsedTransaction
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ error: 'Error processing audio' }, { status: 500 });
  }
}