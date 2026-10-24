export async function reviewEssayWithAI(essayText, essayType) {
  if (!essayText || essayText.trim().length < 50) {
    return "Please write a bit more before asking for a review! (At least 50 characters).";
  }

  const prompt = `You are an expert college admissions counselor. 
The student is writing an essay for: ${essayType}.
Here is their draft:
"${essayText}"

Please provide 3 short, encouraging, and highly specific bullet points on how they can improve this essay. Focus on storytelling, clarity, and showing (not telling). Keep the total response under 100 words. Do not use any markdown formatting, just plain text bullet points.`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3.5:4b',
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) throw new Error('Ollama failed to respond');
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(error);
    return "⚠️ Could not reach the AI. Make sure Ollama is running in your terminal (ollama run qwen3.5:4b).";
  }
}