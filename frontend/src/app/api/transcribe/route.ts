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
  timestamp: string;
  day: string;
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

    const now = new Date();
    const currentDateTime = now.toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

    const prompt = `The current date and time is: ${currentDateTime}.
    Parse this transaction description into JSON, focusing on extracting any time/date references:

    Examples of time references to handle:
    - "spent $20 at McDonald's yesterday at 8pm" = subtract 1 day from current date
    - "bought coffee this morning at 9am" = today at 9am
    - "paid $50 for gas last Tuesday around noon" = most recent past Tuesday at 12pm
    - "spent $100 on groceries two days ago at 3pm" = subtract 2 days from current date
    - "lunch today at 1pm cost $15" = today at 1pm
    - "Friday" = if today is Saturday and user says Friday, use yesterday's date

    Format the response as:
    {
      "description": "name of the expense (maximum two words)",
      "amount": number only (no currency symbols),
      "type": "expense" or "income",
      "category": one of ["Food", "Transportation", "Housing", "Utilities", "Entertainment", "Healthcare", "Education", "Other"],
      "relative_date": any mentioned date reference (e.g., "yesterday", "Friday", "two days ago"),
      "relative_time": any mentioned time (e.g., "8pm", "morning", "noon")
    }

    Transaction description: "${transcription.text}"

    Parse time references carefully and set logical default times for common scenarios:
    - Morning = 9:00 AM
    - Afternoon = 2:00 PM
    - Evening = 6:00 PM
    - Night = 8:00 PM
    - Lunch = 12:00 PM
    - Dinner = 6:00 PM
    - If no time context, use current time

    Respond only with the JSON object, no additional text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const content = chatCompletion.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from language model');
    }

    // Helper function to calculate the date
    const calculateDate = (relativeDate: string): Date => {
      const now = new Date();
      const lowerRef = relativeDate.toLowerCase();
      
      // Handle "yesterday"
      if (lowerRef.includes('yesterday')) {
        return new Date(now.setDate(now.getDate() - 1));
      }
      
      // Handle "X days ago"
      const daysAgoMatch = lowerRef.match(/(\d+)\s*days?\s*ago/);
      if (daysAgoMatch) {
        return new Date(now.setDate(now.getDate() - parseInt(daysAgoMatch[1])));
      }
      
      // Handle day names
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      for (const day of days) {
        if (lowerRef.includes(day)) {
          const targetDay = days.indexOf(day);
          const currentDay = now.getDay();
          let diff = currentDay - targetDay;
          if (diff <= 0) diff += 7; // If the day is ahead or today, get last week's occurrence
          return new Date(now.setDate(now.getDate() - diff));
        }
      }
      
      return now;
    };

    // Clean and parse the response
    const cleanedContent = content.trim().replace(/```json|```/g, '');
    const parsedJson = JSON.parse(cleanedContent);
    
    // Calculate the actual date and time
    const transactionDate = calculateDate(parsedJson.relative_date || '');
    
    // Parse time if provided
    if (parsedJson.relative_time) {
      const timeMatch = parsedJson.relative_time.match(/(\d+)(?::(\d+))?\s*(am|pm|noon|morning|afternoon|evening|night)/i);
      if (timeMatch) {
        let hour = 0;
        let minute = 0;
        
        if (timeMatch[3].toLowerCase() === 'noon') {
          hour = 12;
        } else if (timeMatch[3].toLowerCase() === 'morning') {
          hour = 9;
        } else if (timeMatch[3].toLowerCase() === 'afternoon') {
          hour = 14;
        } else if (timeMatch[3].toLowerCase() === 'evening') {
          hour = 18;
        } else if (timeMatch[3].toLowerCase() === 'night') {
          hour = 20;
        } else {
          hour = parseInt(timeMatch[1]);
          if (timeMatch[3].toLowerCase() === 'pm' && hour !== 12) hour += 12;
          if (timeMatch[3].toLowerCase() === 'am' && hour === 12) hour = 0;
          minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        }
        
        transactionDate.setHours(hour, minute);
      }
    }

    const parsedTransaction = {
      description: parsedJson.description,
      amount: parsedJson.amount.toString(),
      transaction_type: parsedJson.type,
      category: parsedJson.category,
      date: transactionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      timestamp: transactionDate.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };

    return NextResponse.json({ 
      transcription: transcription.text,
      parsedTransaction
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json({ error: 'Error processing audio' }, { status: 500 });
  }
}