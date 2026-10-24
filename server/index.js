import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://127.0.0.1:11434';

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);

    if (!response.ok) {
      return res.status(502).json({
        status: 'error',
        message: 'Ollama returned an error.',
      });
    }

    const data = await response.json();
    const models = (data.models ?? []).map((model) => model.name);

    res.json({
      status: 'ok',
      ollama: 'connected',
      models,
    });
  } catch {
    res.status(503).json({
      status: 'error',
      message: 'Cannot connect to Ollama. Make sure Ollama is running.',
    });
  }
});

app.post('/api/chat', async (req, res) => {
  const question = req.body?.question;

  if (typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({
      error: 'Please enter a question.',
    });
  }

  if (question.length > 4000) {
    return res.status(413).json({
      error: 'Your question is too long. Please keep it under 4,000 characters.',
    });
  }

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3.5:4b',
        messages: [
          {
            role: 'system',
            content:
              'You are the AidAtlas AI Adviser. Help students understand university admissions and financial aid. Be clear, practical, and honest. Never invent scholarship deadlines, eligibility rules, or funding guarantees. No scholarship catalogue has been provided to you yet, so clearly say when a specific opportunity needs verification.',
          },
          {
            role: 'user',
            content: question.trim(),
          },
        ],
        stream: false,
      }),
      signal: AbortSignal.timeout(300000),
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `Ollama returned HTTP ${response.status}.`,
      });
    }

    const data = await response.json();

    res.json({
      answer: data.message?.content ?? 'The model returned no answer.',
    });
  } catch (error) {
    const timedOut = error.name === 'TimeoutError';

    res.status(timedOut ? 504 : 503).json({
      error: timedOut
        ? 'The AI took too long to respond. Please try again.'
        : 'Could not reach Ollama. Check that it is running.',
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`AidAtlas AI backend: http://127.0.0.1:${PORT}`);
});