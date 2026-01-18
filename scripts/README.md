This folder contains small standalone scripts.

generate-recipe.ts
- Uses the `ai` package and `zod` to generate a structured recipe object.
- Usage:

  ```bash
  pnpm run generate:recipe
  ```

Environment
- The `ai` package requires an API key. Common env var names used by various providers are:

  - AI_API_KEY
  - ANTHROPIC_API_KEY
  - OPENAI_API_KEY
  - AI_KEY
  - API_KEY

  The scripts and service will accept any of these and normalize to `AI_API_KEY`.

  Example (zsh):

  ```bash
  export AI_API_KEY=your_key_here
  ```

Model selection
- By default the script and service use Mistral (`mistralai/mistral-7b`). To override the model, set the `AI_MODEL` env var, for example:

  ```bash
  export AI_MODEL=mistralai/mistral-7b
  # or another provider/model string supported by the `ai` package
  ```

Be careful not to commit secrets to version control. For CI, add the key to repository secrets and reference it in the workflow.
