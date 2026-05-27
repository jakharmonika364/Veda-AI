import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { LLMQuestionPaperOutputSchema, type LLMQuestionPaperOutput } from '@vedaai/shared';
import { env } from '../config/env';
import type { IAssignment } from '../models/Assignment';

// ─── Provider Interface ───────────────────────────────────────────────────────

interface LLMProvider {
  complete(prompt: string, imageBase64?: string, mimeType?: string): Promise<string>;
}

class AnthropicProvider implements LLMProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }

  async complete(prompt: string, imageBase64?: string, mimeType?: string): Promise<string> {
    const content: Anthropic.MessageParam['content'] = imageBase64
      ? [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: (mimeType ?? 'image/jpeg') as 'image/jpeg' | 'image/png',
              data: imageBase64,
            },
          },
          { type: 'text', text: prompt },
        ]
      : prompt;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content }],
    });

    const block = response.content[0];
    if (block.type !== 'text') throw new Error('Unexpected LLM response type');
    return block.text;
  }
}

class OpenAIProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async complete(prompt: string, imageBase64?: string, mimeType?: string): Promise<string> {
    const content: OpenAI.ChatCompletionContentPart[] = imageBase64
      ? [
          { type: 'image_url', image_url: { url: `data:${mimeType ?? 'image/jpeg'};base64,${imageBase64}` } },
          { type: 'text', text: prompt },
        ]
      : [{ type: 'text', text: prompt }];

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content }],
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content ?? '';
  }
}

class GroqProvider implements LLMProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async complete(prompt: string, imageBase64?: string, mimeType?: string): Promise<string> {
    if (imageBase64) {
      // Step 1: vision model extracts image content as text
      const extractRes = await this.client.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: `data:${mimeType ?? 'image/jpeg'};base64,${imageBase64}` },
              },
              {
                type: 'text',
                text: 'Describe every piece of content visible in this image in full detail. Include all text, headings, topics, concepts, definitions, formulas, and any other information. Be thorough and accurate — this will be used to generate exam questions.',
              },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 4096,
      });
      const extractedText = extractRes.choices[0]?.message?.content ?? '';

      // Step 2: inject extracted text into prompt, use JSON-mode text model
      const textPrompt = prompt.replace(
        /An image of study material has been provided\.[^\n]*/,
        `The following content was extracted from the uploaded image — base ALL questions on it:\n\n${extractedText}`,
      );

      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: textPrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 8192,
      });
      return response.choices[0]?.message?.content ?? '';
    }

    // Text-only — JSON mode
    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 8192,
    });

    return response.choices[0]?.message?.content ?? '';
  }
}

function createLLMProvider(): LLMProvider {
  if (env.LLM_PROVIDER === 'openai') return new OpenAIProvider();
  if (env.LLM_PROVIDER === 'groq') return new GroqProvider();
  return new AnthropicProvider();
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    MCQ: 'Multiple Choice Questions',
    Short: 'Short Answer Questions',
    Diagram: 'Diagram/Graph-Based Questions',
    Numerical: 'Numerical Problems',
  };
  return labels[type] ?? type;
}

export function buildPrompt(assignment: IAssignment, hasImage: boolean, textContent?: string, schoolName?: string): string {
  const questionSummary = assignment.questionTypes
    .map(
      (qt) =>
        `- ${getQuestionTypeLabel(qt.type)}: ${qt.count} questions × ${qt.marksPerQuestion} marks each`,
    )
    .join('\n');

  const totalMarks = assignment.questionTypes.reduce(
    (sum, qt) => sum + qt.count * qt.marksPerQuestion,
    0,
  );

  let sourceInstruction = '';
  if (textContent) {
    sourceInstruction = `\nIMPORTANT: The following text content has been provided as study material. You MUST generate ALL questions DIRECTLY based on the topics, concepts, and information in this text. Do not invent unrelated topics.\n\n--- STUDY MATERIAL START ---\n${textContent}\n--- STUDY MATERIAL END ---`;
  } else if (hasImage) {
    sourceInstruction = `\nIMPORTANT: An image of study material has been provided. You MUST read it carefully and generate ALL questions DIRECTLY based on the topics, concepts, and content visible in that image. Do not invent unrelated topics.`;
  }

  return `You are an expert question paper generator for the Indian school curriculum (CBSE/ICSE standard).
Generate a complete, high-quality question paper based on the following requirements.${sourceInstruction}

Question Type Requirements:
${questionSummary}
Total Marks: ${totalMarks}
Due Date Context: ${assignment.dueDate.toISOString().split('T')[0]}
${assignment.additionalInfo ? `\nAdditional Instructions from Teacher:\n${assignment.additionalInfo}` : ''}

CRITICAL RULES — follow every one exactly:
1. Questions must be age-appropriate for Indian school students (Class 8-12 level unless specified).
2. Distribute difficulty: ~40% Easy, ~40% Moderate, ~20% Challenging.
3. Each section has a clear title (Section A, B, …) and an instruction line.
4. ${schoolName ? `School name MUST be exactly: "${schoolName}"` : 'School name must be a realistic Indian school name.'}
5. Marks per question must exactly match the specified marksPerQuestion.
6. The answerKey must have one entry for every question.
${textContent ? '7. Base ALL questions on the provided study material text above.' : hasImage ? '7. Base ALL questions on the content visible in the uploaded image.' : ''}

⚠️  MCQ RULE (MANDATORY): Every question in a Multiple Choice section MUST have an "options" field containing an array of EXACTLY 4 strings. Each string is one answer choice in plain text (do NOT prefix with A/B/C/D). The question "text" field contains only the question stem — no options embedded in the text. Omitting "options" from any MCQ question is an error.

⚠️  NON-MCQ RULE: Short, Diagram, and Numerical questions must NOT have an "options" field.

Return ONLY a raw JSON object — no markdown fences, no explanation, no trailing text. Use this exact structure:

{"schoolName":"string","subject":"string","className":"string","timeAllowed":"string","maxMarks":0,"sections":[{"title":"Section A","instruction":"string","questionType":"MCQ","questions":[{"number":1,"text":"Question stem here?","difficulty":"Easy","marks":1,"options":["First choice","Second choice","Third choice","Fourth choice"]},{"number":2,"text":"Another question?","difficulty":"Moderate","marks":1,"options":["Choice one","Choice two","Choice three","Choice four"]}]},{"title":"Section B","instruction":"string","questionType":"Short Answer","questions":[{"number":3,"text":"Explain this concept.","difficulty":"Easy","marks":3}]}],"answerKey":[{"questionNumber":1,"answer":"Second choice"},{"questionNumber":2,"answer":"Choice three"},{"questionNumber":3,"answer":"Brief model answer here."}]}`;
}

// ─── MCQ Answer Key Alignment ────────────────────────────────────────────────

function wordOverlap(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  return b.toLowerCase().split(/\s+/).filter((w) => wordsA.has(w)).length;
}

function alignMcqAnswerKey(result: LLMQuestionPaperOutput): void {
  for (const section of result.sections) {
    const isMcq =
      section.questionType.toLowerCase().includes('mcq') ||
      section.questionType.toLowerCase().includes('multiple');
    if (!isMcq) continue;

    for (const q of section.questions) {
      if (!q.options || q.options.length !== 4) continue;

      const entry = result.answerKey.find((a) => a.questionNumber === q.number);
      if (!entry) continue;

      const answerLower = entry.answer.toLowerCase().trim();

      // Already an exact match — nothing to do
      if (q.options.some((opt) => opt.toLowerCase().trim() === answerLower)) continue;

      // Pick the option with the most word overlap with the current answer
      let bestOpt = q.options[0];
      let bestScore = -1;
      for (const opt of q.options) {
        const score = wordOverlap(answerLower, opt) + wordOverlap(opt, answerLower);
        if (score > bestScore) {
          bestScore = score;
          bestOpt = opt;
        }
      }

      entry.answer = bestOpt;
    }
  }
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export async function generateQuestionPaper(
  assignment: IAssignment,
  imageBase64?: string,
  mimeType?: string,
  textContent?: string,
  schoolName?: string,
): Promise<LLMQuestionPaperOutput> {
  const provider = createLLMProvider();
  const prompt = buildPrompt(assignment, !!imageBase64, textContent, schoolName);

  // Text files go as prompt-only; images go through vision
  const raw = await provider.complete(prompt, imageBase64, mimeType);

  let parsed: unknown;
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM returned invalid JSON: ${raw.slice(0, 200)}`);
  }

  const result = LLMQuestionPaperOutputSchema.parse(parsed);

  // Fill in missing MCQ options with a targeted second call
  const hasMcqType = assignment.questionTypes.some((qt) => qt.type === 'MCQ');
  if (hasMcqType) {
    const missingList: Array<{ sectionIdx: number; qIdx: number; number: number; text: string }> = [];

    result.sections.forEach((section, si) => {
      const isMcq =
        section.questionType.toLowerCase().includes('mcq') ||
        section.questionType.toLowerCase().includes('multiple');
      if (!isMcq) return;
      section.questions.forEach((q, qi) => {
        if (!q.options || q.options.length !== 4) {
          missingList.push({ sectionIdx: si, qIdx: qi, number: q.number, text: q.text });
        }
      });
    });

    if (missingList.length > 0) {
      console.log(`Filling options for ${missingList.length} MCQ question(s) via targeted call...`);

      const optionsPrompt = `Generate exactly 4 multiple-choice answer options for each question below.
One option must be the correct answer; the other three must be plausible but incorrect.
Return ONLY a JSON object — keys are question numbers (as strings), values are arrays of 4 plain strings.
Example: {"1":["Paris","London","Berlin","Madrid"],"5":["Newton","Faraday","Einstein","Bohr"]}

Questions:
${missingList.map((q) => `${q.number}. ${q.text}`).join('\n')}`;

      try {
        const rawOpts = await provider.complete(optionsPrompt); // no image → text-only JSON path
        const cleanedOpts = rawOpts.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
        const optionsMap = JSON.parse(cleanedOpts) as Record<string, unknown>;

        for (const { sectionIdx, qIdx, number } of missingList) {
          const opts = optionsMap[String(number)];
          if (Array.isArray(opts) && opts.length === 4 && opts.every((o) => typeof o === 'string')) {
            // Zod returns plain mutable objects
            (result.sections[sectionIdx].questions[qIdx] as { options?: string[] }).options =
              opts as string[];
          }
        }
      } catch (e) {
        console.warn('Targeted options call failed:', e);
      }

      // Final check — throw if still missing (triggers BullMQ retry)
      const stillMissing = missingList.filter(({ sectionIdx, qIdx }) => {
        const q = result.sections[sectionIdx].questions[qIdx];
        return !q.options || q.options.length !== 4;
      });
      if (stillMissing.length > 0) {
        throw new Error(`Could not generate options for ${stillMissing.length} MCQ question(s).`);
      }
    }
  }

  // Align MCQ answer key entries to the exact text of the closest matching option
  alignMcqAnswerKey(result);

  return result;
}
