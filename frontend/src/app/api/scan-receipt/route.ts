import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";
import sharp from 'sharp';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const receiptImage = formData.get('receipt') as File;

  if (!receiptImage) {
    return NextResponse.json({ error: 'No receipt image provided' }, { status: 400 });
  }

  try {
    // Convert File to Buffer
    const buffer = Buffer.from(await receiptImage.arrayBuffer());

    // Optimize image
    const optimizedImageBuffer = await sharp(buffer)
      .resize(400, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .grayscale()
      .jpeg({ 
        quality: 40,
        mozjpeg: true,
        force: true
      })
      .toBuffer();

    // Convert to base64 and create data URL
    const base64Image = optimizedImageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this receipt and respond ONLY with a JSON object in this exact format:
{
  "store_name": "name of the store or restaurant (if name is not there check the items and choose the most relevant name)",
  "total_amount": final total amount including all taxes and charges (just the number, no currency symbol),
  "category": one of these exact categories: "Food", "Transportation", "Housing", "Utilities", "Entertainment", "Healthcare", "Education", "Other",
  "receipt_date": extract the date if shown on receipt (in YYYY-MM-DD format),
  "receipt_time": extract the time if shown on receipt (in HH:MM AM/PM format)
}

Important: 
1. For total_amount, look for terms like "Total", "Grand Total", "Amount Due", "Final Amount". Include all taxes.
2. For date and time, look for transaction timestamp, printed date/time, or any time reference.
3. If category is not clear, check the items and choose the most relevant category.

Do not include any other text or explanation, just the JSON object.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      model: "llama-3.2-90b-vision-preview",
      temperature: 0.1,
      max_tokens: 200,
      top_p: 1,
      stream: false,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content returned from language model');
    }

    // Clean the response to ensure valid JSON
    const cleanedContent = content.trim().replace(/```json|```/g, '');
    const parsedReceipt = JSON.parse(cleanedContent);

    // Validate the response format
    if (!parsedReceipt.store_name || !parsedReceipt.total_amount || !parsedReceipt.category) {
      throw new Error('Invalid receipt format returned from AI');
    }

    const now = new Date();

    // Try to parse receipt date and time if available
    let finalDate = now;
    if (parsedReceipt.receipt_date) {
      try {
        // Handle multiple date formats
        if (parsedReceipt.receipt_date.includes('/')) {
          // Handle MM/DD/YY format
          const [month, day, year] = parsedReceipt.receipt_date.split('/').map(Number);
          
          // Convert 2-digit year to 4-digit year
          let fullYear: number;
          if (year < 100) {
            fullYear = year < 50 ? 2000 + year : 1900 + year;
          } else {
            fullYear = year;
          }
          
          // Create date with exact values (month is 0-based in JS)
          finalDate = new Date(fullYear, month - 1, day);
          
          // Set time to noon by default
          finalDate.setHours(12, 0, 0, 0);
          
          console.log('Parsed date components:', {
            month,
            day,
            year,
            fullYear,
            resultDate: finalDate.toISOString()
          });
        } 
        // Handle YYYY-MM-DD format
        else if (parsedReceipt.receipt_date.includes('-')) {
          const [year, month, day] = parsedReceipt.receipt_date.split('-').map(Number);
          finalDate = new Date(year, month - 1, day);
          finalDate.setHours(12, 0, 0, 0);
        }

        // Validate the date is valid
        if (isNaN(finalDate.getTime())) {
          console.warn('Invalid date created, using current date');
          finalDate = now;
        }

        // Set time if available
        if (parsedReceipt.receipt_time) {
          const timeMatch = parsedReceipt.receipt_time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (timeMatch) {
            const [_, hours, minutes, period] = timeMatch;
            let hour = parseInt(hours);
            
            // Convert to 24-hour format
            if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
            if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
            
            finalDate.setHours(hour, parseInt(minutes), 0, 0);
          }
        }

        // Only reject future dates
        if (finalDate > now) {
          console.warn('Receipt date is in the future, using current date');
          finalDate = now;
        }

      } catch (error) {
        console.error('Error parsing receipt date/time:', error);
        finalDate = now;
      }
    }

    console.log('Receipt Date Processing:', {
      original: parsedReceipt.receipt_date,
      parsed: finalDate.toISOString(),
      formatted: finalDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: finalDate.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      })
    });

    return NextResponse.json({ 
      parsedReceipt: {
        ...parsedReceipt,
        type: 'expense',
        date: finalDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        timestamp: finalDate.toLocaleTimeString('en-US', { 
          hour: 'numeric',
          minute: '2-digit',
          hour12: true 
        })
      } 
    });
  } catch (error) {
    console.error('Error processing receipt:', error);
    if (error instanceof Error && error.message.includes('rate_limit_exceeded')) {
      return NextResponse.json({ 
        error: 'Image too large. Please try a smaller receipt image.',
        details: error.message
      }, { status: 429 });
    }
    return NextResponse.json({ 
      error: 'Error processing receipt',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 