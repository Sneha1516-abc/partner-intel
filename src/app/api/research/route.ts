import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// Note: This requires GEMINI_API_KEY to be set in .env.local
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, companyUrl, companyCategory, ecosystemContext } = body;

    if (!companyName) {
      return NextResponse.json(
        { success: false, error: 'Company name is required' },
        { status: 400 }
      );
    }

    let overview = `${companyName} is a cloud-native platform that provides scalable storage and compute for analytics workloads, serving enterprise customers.\nThey typically partner with data infrastructure platforms through technology integrations and joint go-to-market initiatives.\nTheir target customers are data teams who need flexible, performant analytics capabilities.\nPartnership integrations usually focus on data ingestion, transformation, or visualization tools.`;

    let strategy = `Position Condense as the real-time streaming layer that feeds ${companyName}'s analytical capabilities.\nFocus on the pain point that traditional batch ETL creates stale data, while Condense delivers continuous processing.\nEmphasize the BYOC model as complementary to security-conscious enterprise customers who want to maintain data control.\nLead with joint customer use cases around operational analytics, dashboards, and event-driven decision making.`;

    let gtmStrategy = `Target ${companyName}'s Solutions Architects and Data Engineering teams. Pitch: "Enhance ${companyName}'s real-time capabilities with Zeliot Condense. Ingest streaming data from any source directly into your platform, enabling immediate analytics and powering real-time applications, without complex infrastructure management."\nHighlight the 'BYOC' advantage of Condense. Pitch: "Leverage Zeliot Condense to bring your existing real-time data streams securely into ${companyName}, deployed on your preferred cloud (AWS, Azure, GCP). Reduce latency and operational overhead for your streaming data initiatives."\nFocus on joint customer success stories. Pitch: "See how companies are already using Zeliot Condense and ${companyName} together to unlock real-time insights and build next-generation data applications. Let us show you a tailored demo of seamless, high-throughput data ingestion."\nEngage ${companyName}'s Marketplace and Partner teams. Pitch: "Zeliot Condense is the missing piece for real-time data. Integrate Condense to provide customers with a robust, easy-to-deploy solution for real-time data ingestion, expanding your ecosystem and value proposition."`;

    // Make real API call if we have the Gemini key
    if (genAI) {
      try {
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

        if (parsed.overview && Array.isArray(parsed.overview)) {
          overview = parsed.overview.join('\n');
        }
        if (parsed.strategy && Array.isArray(parsed.strategy)) {
          strategy = parsed.strategy.join('\n');
        }
        if (parsed.gtmStrategy && Array.isArray(parsed.gtmStrategy)) {
          gtmStrategy = parsed.gtmStrategy.join('\n');
        }
      } catch (aiError) {
        console.error('Gemini API Error (falling back to mock data):', aiError);
        // The strategy and synergy variables will remain as the default mocked data
      }
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
  } catch (error) {
    console.error('Error generating research:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate research. Ensure your API key is valid.' },
      { status: 500 }
    );
  }
}
