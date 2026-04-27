import { config } from '../core/config';
import logger from '../core/logger';
import { db } from '../core/database';
import { VERSION } from '../core/constants';

export const AI_MODELS = [
    { id: 'tencent/hy3-preview:free', name: 'Tencent HY3 (Free)', description: 'Advanced global intelligence network.' },
    { id: 'minimax/minimax-m2.5:free', name: 'MiniMax m2.5 (Free)', description: 'Fast and powerful deductive reasoning.' },
    { id: 'google/gemma-4-26b-a4b-it:free', name: 'Gemma 4 26B (Free)', description: 'Massive context comprehension and logic.' }
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
            return "❌ **NEURAL LINK FAILURE**: No OpenRouter keys detected in the Titan core configuration. Please contact the sector administrator.";
        }

        // Fetch user settings
        const settings = await db.fetchOne('SELECT selected_model, system_prompt FROM user_ai_settings WHERE user_id = $1', [userId]);
        const modelId = settings?.selected_model || 'tencent/hy3-preview:free';
        const systemPrompt = settings?.system_prompt || `You are Astra, a powerful AI assistant powered by the Titan v${VERSION} protocol. You are helpful, tactical, and concise. You assist users exclusively in DMs.`;

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
            const reply = data.choices && data.choices[0] && data.choices[0].message.content ? data.choices[0].message.content : 'No response from Neural Network.';

            // Update usage stats
            await db.execute(
                'INSERT INTO user_ai_settings (user_id, usage_count, last_used) VALUES ($1, 1, $2) ON CONFLICT(user_id) DO UPDATE SET usage_count = user_ai_settings.usage_count + 1, last_used = $3',
                [userId, new Date().toISOString(), new Date().toISOString()]
            );

            return reply;

        } catch (error: any) {
            const errorMessage = error?.message || String(error);
            
            // Check for rate limit or quota errors
            if ((errorMessage.includes('429') || errorMessage.includes('quota')) && retryCount < this.keys.length) {
                logger.warn(`🚀 AI Sentinel: Key index ${this.currentKeyIndex} exhausted. Cycling to next frequency...`);
                this.getNextKey();
                return this.generateResponse(userId, prompt, retryCount + 1);
            }

            logger.error(`🚨 AI Sentinel Critical Error: ${errorMessage}`);
            return `⚠️ **NEURAL ANOMALY DETECTED**: The intelligence engine encountered an error. \n\`\`\`${errorMessage}\`\`\``;
        }
    }

    public static async setUserModel(userId: string, modelId: string): Promise<boolean> {
        if (!AI_MODELS.find(m => m.id === modelId)) return false;
        
        await db.execute(
            'INSERT INTO user_ai_settings (user_id, selected_model) VALUES ($1, $2) ON CONFLICT(user_id) DO UPDATE SET selected_model = $3',
            [userId, modelId, modelId]
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
                    return { index: i, status: 'ACTIVE' as const, message: 'Neural link established with OpenRouter.' };
                } else if (response.status === 429) {
                    return { index: i, status: 'QUOTA' as const, message: 'Rate limit or Quota exceeded.' };
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
