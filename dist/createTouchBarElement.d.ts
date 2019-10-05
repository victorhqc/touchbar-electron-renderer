import { ComponentProps, AnyTouchBarComponent, TouchBarType } from './components';
import { Maybe } from './utils';
declare function createTouchBarElement(type: TouchBarType, props: ComponentProps): Maybe<AnyTouchBarComponent>;
export default createTouchBarElement;
