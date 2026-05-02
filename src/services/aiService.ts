import { config } from '../core/config';
import logger from '../core/logger';
import { db } from '../core/database';

export const AI_MODELS = [
    { id: 'tencent/hy3-preview:free',        name: 'Astra Smart',  description: 'Great for general questions and help.' },
    { id: 'minimax/minimax-m2.5:free',        name: 'Astra Fast',   description: 'Very fast — best for quick answers.' },
    { id: 'google/gemma-4-26b-a4b-it:free',   name: 'Astra Expert', description: 'Best for complex problems and logic.' },
    { id: 'z-ai/glm-4.5-air:free',            name: 'GLM 4.5 Air',  description: 'Fast and efficient multilingual model.' },
    { id: 'openrouter/owl-alpha',             name: 'Owl Alpha',    description: 'Advanced reasoning and analysis.' },
    { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen 3',   description: 'High-performance large model.' },
];

export const DEFAULT_AI_MODEL = 'tencent/hy3-preview:free';

// Fallback model rotation when the user's chosen model is rate-limited upstream
const FALLBACK_ORDER = [
    'tencent/hy3-preview:free',
    'minimax/minimax-m2.5:free',
    'google/gemma-4-26b-a4b-it:free',
    'z-ai/glm-4.5-air:free',
    'openrouter/owl-alpha',
    'qwen/qwen3-next-80b-a3b-instruct:free',
];

const SYSTEM_PROMPT = `You are Astra, a friendly and helpful AI assistant built into a Discord bot. You are warm, concise, and easy to talk to. Keep responses under 1800 characters unless the user specifically asks for a long explanation. You help with questions, advice, fun conversations, and general knowledge. You work in Discord DMs.`;

export class AIService {
    private static currentKeyIndex = 0;
    private static readonly keys = config.aiApiKeys;

    private static nextKey(): void {
        if (this.keys.length > 1) {
            this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
        }
    }

    private static get key(): string | null {
        return this.keys.length > 0 ? this.keys[this.currentKeyIndex] : null;
    }

    public static async generateResponse(
        userId: string,
        prompt: string,
        _retryCount = 0,
        _modelOverride?: string
    ): Promise<string> {
        const apiKey = this.key;
        if (!apiKey) {
            return '❌ **No AI key configured.** Ask the server owner to set up the AI system.';
        }

        const settings  = await db.fetchOne('SELECT selected_model, system_prompt FROM user_ai_settings WHERE user_id = ?', userId);
        const userModel = _modelOverride ?? settings?.selected_model ?? 'tencent/hy3-preview:free';
        const sysPrompt = settings?.system_prompt || SYSTEM_PROMPT;

        let responseText: string;
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://astra-bot.app',
                    'X-Title': 'Astra Discord Bot',
                },
                body: JSON.stringify({
                    model: userModel,
                    messages: [
                        { role: 'system',  content: sysPrompt },
                        { role: 'user',    content: prompt.substring(0, 4000) },
                    ],
                }),
            });

            const data: any = await res.json();

            // Handle API-level errors cleanly (don't throw raw JSON at user)
            if (!res.ok || data?.error) {
                const errCode    = data?.error?.code ?? res.status;
                const errMessage = data?.error?.message ?? '';

                // Upstream model rate-limit — rotate to next model in fallback list
                if (errCode === 429 || errMessage.includes('rate-limit') || errMessage.includes('rate limit')) {
                    const fallbackIndex = FALLBACK_ORDER.indexOf(userModel);
                    const nextModel     = FALLBACK_ORDER[fallbackIndex + 1];

                    if (nextModel && _retryCount < FALLBACK_ORDER.length - 1) {
                        logger.warn(`AI: model ${userModel} rate-limited upstream, trying ${nextModel}`);
                        return this.generateResponse(userId, prompt, _retryCount + 1, nextModel);
                    }

                    // All models exhausted — rotate API key and try from the top
                    if (this.keys.length > 1 && _retryCount < this.keys.length + FALLBACK_ORDER.length) {
                        logger.warn(`AI: rotating API key (index ${this.currentKeyIndex})`);
                        this.nextKey();
                        return this.generateResponse(userId, prompt, _retryCount + 1);
                    }

                    return '⏳ **All AI models are busy right now.** This happens when free-tier limits fill up. Try again in a minute!';
                }

                // Auth error
                if (errCode === 401 || errCode === 403) {
                    logger.error(`AI: auth error on key ${this.currentKeyIndex}`);
                    this.nextKey();
                    return '🔑 **AI key issue detected.** The bot owner needs to check the OpenRouter API key.';
                }

                // Generic API error — log detail, return friendly message
                logger.error(`AI error [${errCode}]: ${errMessage.substring(0, 200)}`);
                return `⚠️ **The AI ran into an issue.** Try again in a moment. (Error ${errCode})`;
            }

            responseText = data?.choices?.[0]?.message?.content?.trim() ?? '';
            if (!responseText) return "🤔 I wasn't sure what to say — try asking again!";

        } catch (err: any) {
            logger.error(`AI fetch error: ${err?.message ?? err}`);
            return '⚠️ **Connection issue.** I had trouble reaching the AI. Try again in a second!';
        }

        // Log usage (fire-and-forget — don't block the response)
        db.execute(
            'INSERT INTO user_ai_settings (user_id, usage_count, last_used) VALUES (?, 1, ?) ON CONFLICT(user_id) DO UPDATE SET usage_count = user_ai_settings.usage_count + 1, last_used = ?',
            userId, new Date().toISOString(), new Date().toISOString()
        ).catch(() => {});

        return responseText;
    }

    public static async setUserModel(userId: string, modelId: string): Promise<boolean> {
        if (!AI_MODELS.find(m => m.id === modelId)) return false;
        await db.execute(
            'INSERT INTO user_ai_settings (user_id, selected_model) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET selected_model = ?',
            userId, modelId, modelId
        );
        return true;
    }

    public static async setCustomSystemPrompt(userId: string, customPrompt: string): Promise<void> {
        await db.execute(
            'INSERT INTO user_ai_settings (user_id, system_prompt) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET system_prompt = ?',
            userId, customPrompt, customPrompt
        );
    }

    public static async getUserSettings(userId: string): Promise<{ selected_model?: string; system_prompt?: string } | null> {
        return db.fetchOne('SELECT selected_model, system_prompt FROM user_ai_settings WHERE user_id = ?', userId);
    }

    public static async resetUserSettings(userId: string): Promise<void> {
        await db.execute('DELETE FROM user_ai_settings WHERE user_id = ?', userId);
    }

    public static async checkKeys(): Promise<{ index: number; status: 'ACTIVE' | 'ERROR' | 'QUOTA'; message: string }[]> {
        return Promise.all(this.keys.map(async (k, i) => {
            try {
                const res = await fetch('https://openrouter.ai/api/v1/models', {
                    headers: { 'Authorization': `Bearer ${k}` },
                });
                if (res.ok)              return { index: i, status: 'ACTIVE' as const, message: 'Connected.' };
                if (res.status === 429)  return { index: i, status: 'QUOTA'  as const, message: 'Rate limited.' };
                return { index: i, status: 'ERROR' as const, message: `HTTP ${res.status}` };
            } catch (e: any) {
                return { index: i, status: 'ERROR' as const, message: e?.message ?? String(e) };
            }
        }));
    }
}
