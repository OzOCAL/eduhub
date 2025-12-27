import { generateObject } from 'ai';
import { z } from 'zod';

function resolveApiKey() {
  // try several common env var names. If one is found, normalize to AI_API_KEY which
  // the `ai` package commonly respects.
  const candidates = [
    'AI_API_KEY',
    'ANTHROPIC_API_KEY',
    'OPENAI_API_KEY',
    'AI_KEY',
    'API_KEY',
  ];

  for (const name of candidates) {
    const v = process.env[name];
    if (v && v.trim().length > 0) {
      // normalize
      process.env.AI_API_KEY = v;
      return v;
    }
  }
  return null;
}

async function main() {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.error(
      'Missing AI API key. Set one of AI_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY, AI_KEY or API_KEY in your environment.'
    );
    process.exit(1);
  }

  const schema = z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  });

  try {
    const model = process.env.AI_MODEL ?? 'mistralai/mistral-7b';
    const result = await generateObject({
      model,
      schema,
      prompt: 'Generate a lasagna recipe.',
    });

    // some versions of `generateObject` return the object under `object`
    const generated = (result as any).object ?? (result as any).result ?? result;
    console.log(JSON.stringify(generated, null, 2));
  } catch (err) {
    console.error('Generation failed:', err?.message ?? err);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
