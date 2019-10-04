import { TouchBarTextComponent } from './types';
declare class TouchBarText implements TouchBarTextComponent {
    id: string;
    private text;
    constructor(text: string);
    replaceText(text: string): void;
    createInstance(): string;
}
export default TouchBarText;
