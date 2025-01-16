export {};

declare global {
    interface Window {
        drawPlanetPhase: (
            containerEl: HTMLElement,
            phase: number,
            isWaxing: boolean,
            config?: {
                shadowColour?: string;
                lightColour?: string;
                diameter?: number;
                earthshine?: number;
                blur?: number;
            }
        ) => void;
    }
}