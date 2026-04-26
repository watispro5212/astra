
/**
 * ASTRA STOCK MARKET SERVICE v7.5.0 'Titan'
 * High-fidelity financial simulation engine.
 */

export interface Stock {
    symbol: string;
    name: string;
    basePrice: number;
    volatility: number;
    description: string;
}

export const STOCKS: Stock[] = [
    { symbol: 'AST',  name: 'Astra Tactical',    basePrice: 500,  volatility: 0.15, description: 'Core infrastructure and AI development.' },
    { symbol: 'TITN', name: 'Titan Industries',  basePrice: 1200, volatility: 0.08, description: 'Heavy manufacturing and planetary engineering.' },
    { symbol: 'NRG',  name: 'Neural Grid',       basePrice: 350,  volatility: 0.25, description: 'Global data mesh and synaptic networks.' },
    { symbol: 'VOID', name: 'Void Energy',       basePrice: 2100, volatility: 0.12, description: 'Advanced energy harvesting and storage.' },
    { symbol: 'QNTM', name: 'Quantum Logistics', basePrice: 150,  volatility: 0.40, description: 'Hyper-speed delivery and quantum computing.' }
];

export class StockMarketService {
    static getPrice(symbol: string): number {
        const stock = STOCKS.find(s => s.symbol === symbol);
        if (!stock) return 0;

        const now = Date.now();
        // Use multiple sine waves for more natural price movement
        const wave1 = Math.sin(now / (1000 * 60 * 60 * 4)); // 4 hour cycle
        const wave2 = Math.cos(now / (1000 * 60 * 30));     // 30 min cycle
        const wave3 = Math.sin(now / (1000 * 60 * 5));      // 5 min noise
        
        const variance = (wave1 * 0.5) + (wave2 * 0.3) + (wave3 * 0.2);
        const finalPrice = stock.basePrice * (1 + (variance * stock.volatility));
        
        return Math.max(10, Math.floor(finalPrice));
    }

    static getTrend(symbol: string): { price: number, trend: string, indicator: string } {
        const current = this.getPrice(symbol);
        // Compare with price 15 minutes ago
        const past = this.getHistoricalPrice(symbol, 15);
        
        const diff = current - past;
        const pct = ((diff / past) * 100).toFixed(2);
        
        if (diff > 0) return { price: current, trend: `+${pct}%`, indicator: '📈 BULLISH' };
        if (diff < 0) return { price: current, trend: `${pct}%`, indicator: '📉 BEARISH' };
        return { price: current, trend: '0.00%', indicator: '📊 STABLE' };
    }

    private static getHistoricalPrice(symbol: string, minutesAgo: number): number {
        const stock = STOCKS.find(s => s.symbol === symbol);
        if (!stock) return 0;

        const time = Date.now() - (minutesAgo * 60 * 1000);
        const wave1 = Math.sin(time / (1000 * 60 * 60 * 4));
        const wave2 = Math.cos(time / (1000 * 60 * 30));
        const wave3 = Math.sin(time / (1000 * 60 * 5));
        
        const variance = (wave1 * 0.5) + (wave2 * 0.3) + (wave3 * 0.2);
        const finalPrice = stock.basePrice * (1 + (variance * stock.volatility));
        
        return Math.max(10, Math.floor(finalPrice));
    }
}
