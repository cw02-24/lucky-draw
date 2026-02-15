declare module 'spin-wheel' {
  export class Wheel {
    constructor(container: HTMLElement, props: any);
    onRest: (event: { currentIndex: number }) => void;
    spinToItem(index: number, duration: number, spinToCenter: boolean, revolutions: number, direction: number, easing?: any): void;
  }
}
