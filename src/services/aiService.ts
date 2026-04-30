import { config } from '../core/config';
import logger from '../core/logger';
import { db } from '../core/database';
import { VERSION } from '../core/constants';

export const AI_MODELS = [
    { id: 'tencent/hy3-preview:free', name: 'Astra Smart (Free)', description: 'Good for general questions and help.' },
    { id: 'minimax/minimax-m2.5:free', name: 'Astra Fast (Free)', description: 'Very fast at thinking and answering.' },
    { id: 'google/gemma-4-26b-a4b-it:free', name: 'Astra Expert (Free)', description: 'Best for complex problems and logic.' }
];

export class AIService {
    private static currentKeyIndex = 0;
    private static keys = config.aiApiKeys;

    private static getNextKey(): string | null {
        if (this.keys.length === 0) return null;
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
        return this.keys[this.currentKeyIndex];
    }

    private static getCurrentKey(): string | null {
        if (this.keys.length === 0) return null;
        return this.keys[this.currentKeyIndex];
    }

    public static async generateResponse(userId: string, prompt: string, retryCount = 0): Promise<string> {
        const key = this.getCurrentKey();
        if (!key) {
            return "❌ **BRAIN DISCONNECTED**: I can't find my keys to talk to the AI brain. Please tell the server owner.";
        }

        // Fetch user settings
        const settings = await db.fetchOne('SELECT selected_model, system_prompt FROM user_ai_settings WHERE user_id = ?', userId);
        const modelId = settings?.selected_model || 'tencent/hy3-preview:free';
        const systemPrompt = settings?.system_prompt || `You are Astra, a helpful and friendly AI assistant. You are simple to talk to and you love helping people. You only talk to users in their DMs.`;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${key}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: modelId,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`OpenRouter Error: ${text}`);
            }

            const data: any = await response.json();
            const reply = data.choices && data.choices[0] && data.choices[0].message.content ? data.choices[0].message.content : 'I forgot what I was going to say.';

            // Update usage stats
            await db.execute(
                'INSERT INTO user_ai_settings (user_id, usage_count, last_used) VALUES (?, 1, ?) ON CONFLICT(user_id) DO UPDATE SET usage_count = user_ai_settings.usage_count + 1, last_used = ?',
                userId, new Date().toISOString(), new Date().toISOString()
            );

            return reply;

        } catch (error: any) {
            const errorMessage = error?.message || String(error);
            
            // Check for rate limit or quota errors
            if ((errorMessage.includes('429') || errorMessage.includes('quota')) && retryCount < this.keys.length) {
                logger.warn(`🚀 Astra Brain: Key ${this.currentKeyIndex} is tired. Trying another one...`);
                this.getNextKey();
                return this.generateResponse(userId, prompt, retryCount + 1);
            }

            logger.error(`🚨 Astra AI Error: ${errorMessage}`);
            return `⚠️ **I GOT CONFUSED**: My AI brain had a little trouble. \n\`\`\`${errorMessage}\`\`\``;
        }
    }

    public static async setUserModel(userId: string, modelId: string): Promise<boolean> {
        if (!AI_MODELS.find(m => m.id === modelId)) return false;
        
        await db.execute(
            'INSERT INTO user_ai_settings (user_id, selected_model) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET selected_model = ?',
            userId, modelId, modelId
        );
        return true;
    }
    public static async checkKeys(): Promise<{ index: number; status: 'ACTIVE' | 'ERROR' | 'QUOTA'; message: string }[]> {
        const checkPromises = this.keys.map(async (key, i) => {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/models", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${key}` }
                });
                
                if (response.ok) {
                    return { index: i, status: 'ACTIVE' as const, message: 'Brain is connected and happy.' };
                } else if (response.status === 429) {
                    return { index: i, status: 'QUOTA' as const, message: 'Brain is tired (too many requests).' };
                } else {
                    return { index: i, status: 'ERROR' as const, message: `Status ${response.status}` };
                }
            } catch (error: any) {
                const msg = error?.message || String(error);
                const status = (msg.includes('429') || msg.includes('quota')) ? 'QUOTA' : 'ERROR';
                return { index: i, status: status as any, message: msg };
            }
        });
        
        return Promise.all(checkPromises);
    }
}
