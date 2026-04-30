/**
 * ASTRA STOCK MARKET SERVICE v8.1.0
 * Fun financial simulation for the Astra community.
 */

export interface Stock {
    symbol: string;
    name: string;
    basePrice: number;
    volatility: number;
    description: string;
}

export const STOCKS: Stock[] = [
    { symbol: 'AST',  name: 'Astra Core',        basePrice: 500,  volatility: 0.15, description: 'The main team building Astra.' },
    { symbol: 'SHOP', name: 'Astra Shop',        basePrice: 1200, volatility: 0.08, description: 'Selling items and roles across the world.' },
    { symbol: 'DATA', name: 'Astra Network',     basePrice: 350,  volatility: 0.25, description: 'Connecting servers together safely.' },
    { symbol: 'SUN',  name: 'Solar Energy',      basePrice: 2100, volatility: 0.12, description: 'Clean power for the future.' },
    { symbol: 'MOVE', name: 'Astra Delivery',    basePrice: 150,  volatility: 0.40, description: 'Fast shipping for everyone.' }
];

export class StockMarketService {
    static getPrice(symbol: string, timestamp: number = Date.now()): number {
        const stock = STOCKS.find(s => s.symbol === symbol);
        if (!stock) return 0;

        // Generate a pseudo-random seed constraint per symbol to disjoint the market waves
        const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 864000;
        const sTime = timestamp + hash;

        // Use multiple sine waves for more natural, independent price movement
        const wave1 = Math.sin(sTime / (1000 * 60 * 60 * 4)); // 4 hour cycle
        const wave2 = Math.cos(sTime / (1000 * 60 * 30));     // 30 min cycle
        const wave3 = Math.sin(sTime / (1000 * 60 * 5));      // 5 min noise
        
        const variance = (wave1 * 0.5) + (wave2 * 0.3) + (wave3 * 0.2);
        const finalPrice = stock.basePrice * (1 + (variance * stock.volatility));
        
        return Math.max(10, Math.floor(finalPrice));
    }

    static getTrend(symbol: string): { price: number, trend: string, indicator: string, change: number } {
        const current = this.getPrice(symbol);
        // Compare with price 15 minutes ago
        const past = this.getPrice(symbol, Date.now() - (15 * 60 * 1000));
        
        const diff = current - past;
        const change = (diff / past) * 100;
        const pctText = change.toFixed(2);
        
        if (diff > 0) return { price: current, trend: `+${pctText}%`, indicator: '📈', change };
        if (diff < 0) return { price: current, trend: `${pctText}%`, indicator: '📉', change };
        return { price: current, trend: '0.00%', indicator: '📊', change: 0 };
    }

    static getHistory(symbol: string, points: number = 10): number[] {
        const history: number[] = [];
        const interval = (15 * 60 * 1000) / points; // Sample over last 15 mins
        const now = Date.now();

        for (let i = points - 1; i >= 0; i--) {
            history.push(this.getPrice(symbol, now - (i * interval)));
        }
        return history;
    }
}
