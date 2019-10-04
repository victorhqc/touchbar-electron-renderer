import { TouchBar } from 'electron';
import { Maybe } from './types';
export declare function setNativeTouchBar(NativeTouchBar: TouchBarType): void;
export declare function getNativeTouchBar(): Maybe<typeof TouchBar>;
export declare type TouchBarType = typeof TouchBar;
