export interface WalletData {
    holdings: number;
    wallets: number;
    name: string;
  }
  
  export interface CirclePair {
    group: paper.Group;
    solidCircle: paper.Path.Circle;
    transparentCircle: paper.Path.Circle;
    transparentRadius: number;
    originalColors: {
      solid: paper.Color;
      transparent: paper.Color;
    };
  }

declare global {
  interface Window {
    paper: typeof import('paper');
  }
}
