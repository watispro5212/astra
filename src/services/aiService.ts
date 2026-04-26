import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../core/config';
import logger from '../core/logger';
import { db } from '../core/database';
import { VERSION } from '../core/constants';

export const AI_MODELS = [
    { id: 'gemini-1.5-flash', name: 'Titan Flash (Fast)', description: 'Optimized for speed and rapid tactical response.' },
    { id: 'gemini-1.5-pro', name: 'Titan Pro (Deep)', description: 'Advanced reasoning for complex strategy and analysis.' },
    { id: 'gemini-1.0-pro', name: 'Titan Legacy', description: 'Stable, reliable intelligence for standard protocols.' }
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
            return "❌ **NEURAL LINK FAILURE**: No AI API keys detected in the Titan core configuration. Please contact the sector administrator.";
        }

        // Fetch user settings
        const settings = await db.fetchOne('SELECT selected_model, system_prompt FROM user_ai_settings WHERE user_id = ?', userId);
        const modelId = settings?.selected_model || 'gemini-1.5-flash';
        const systemPrompt = settings?.system_prompt || `You are Astra, a powerful AI assistant powered by the Titan v${VERSION} protocol. You are helpful, tactical, and concise. You assist users exclusively in DMs.`;

        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ 
                model: modelId,
                systemInstruction: systemPrompt 
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Update usage stats
            await db.execute(
                'INSERT INTO user_ai_settings (user_id, usage_count, last_used) VALUES (?, 1, ?) ON CONFLICT(user_id) DO UPDATE SET usage_count = user_ai_settings.usage_count + 1, last_used = ?',
                userId, new Date().toISOString(), new Date().toISOString()
            );

            return text;

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
            'INSERT INTO user_ai_settings (user_id, selected_model) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET selected_model = ?',
            userId, modelId, modelId
        );
        return true;
    }
    public static async checkKeys(): Promise<{ index: number; status: 'ACTIVE' | 'ERROR' | 'QUOTA'; message: string }[]> {
        const checkPromises = this.keys.map(async (key, i) => {
            try {
                const genAI = new GoogleGenerativeAI(key);
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                await model.generateContent('ping');
                return { index: i, status: 'ACTIVE' as const, message: 'Neural link established.' };
            } catch (error: any) {
                const msg = error?.message || String(error);
                const status = (msg.includes('429') || msg.includes('quota')) ? 'QUOTA' : 'ERROR';
                return { index: i, status: status as any, message: msg };
            }
        });
        
        return Promise.all(checkPromises);
    }
}
