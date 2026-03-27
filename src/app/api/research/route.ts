import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client dynamically inside the request to ensure env vars are loaded
export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is completely missing from environment variables.');
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY is missing. Please add it to your Vercel Environment Variables and REDEPLOY.' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const body = await request.json();
    const { companyName, companyUrl, companyCategory, ecosystemContext } = body;

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    You are an expert Go-To-Market and Corporate Strategy consultant working for Zeliot.
    Zeliot's flagship product is "Condense". Condense simplifies streaming data architecture, enabling building and scaling of real-time applications. It supports BYOC (Bring Your Own Cloud) deployments across GCP, AWS, and Azure. It has various 'Connectors' to pull real-time data from sources securely.

    Your goal is to research and analyze the target company "${companyName}" ${companyUrl ? `(website: ${companyUrl})` : ''} 
    ${companyCategory ? `\nCategory: ${companyCategory}` : ''}
    ${ecosystemContext ? `\nEcosystem Context: ${ecosystemContext}` : ''}
    and find partnership strategies and synergies specifically between Zeliot Condense and this company.
    
    You must return STRICTLY a JSON object with exactly three keys: "overview", "strategy", and "gtmStrategy".
    - "overview": an array of 3-4 strings (each string is one concise bullet point explaining the company, who they target, and their ecosystem).
    - "strategy": an array of 3-4 strings (each string is one concise bullet point detailing the approach strategy for Condense and synergies).
    - "gtmStrategy": an array of 3-4 strings detailing a highly accurate, practical GTM outreach strategy. EVERY string MUST strictly follow this exact format: "Target [Specific Persona/Team] OR Focus on [Specific Aspect] OR Highlight [Feature]. Pitch: \\"[Highly detailed, 2-3 sentence quoted pitch emphasizing deep value]\\"". MAKE IT DETAILED AND PERSUASIVE.
    
    Keep it professional, highly specific to what ${companyName} actually does in the real world, and highly actionable. Return plain text strings for the array elements, do not use markdown asterisks.
  `;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    let overview = '';
    let strategy = '';
    let gtmStrategy = '';

    if (parsed.overview && Array.isArray(parsed.overview)) {
      overview = parsed.overview.join('\n');
    }
    if (parsed.strategy && Array.isArray(parsed.strategy)) {
      strategy = parsed.strategy.join('\n');
    }
    if (parsed.gtmStrategy && Array.isArray(parsed.gtmStrategy)) {
      gtmStrategy = parsed.gtmStrategy.join('\n');
    }

    return NextResponse.json({
      success: true,
      data: {
        name: companyName,
        url: companyUrl || '',
        category: companyCategory || '',
        ecosystemContext: ecosystemContext || '',
        overview,
        strategy,
        gtmStrategy
      }
    });
  } catch (error: any) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { success: false, error: 'AI Generation Failed. Please check if your Gemini API key is valid and has quota.' },
      { status: 500 }
    );
  }
}
