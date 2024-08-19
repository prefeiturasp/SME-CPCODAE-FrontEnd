import { Directive, HostListener, Input } from "@angular/core";

@Directive({selector: '[prevent-keys]', host: { '(keydown)': 'onKeyUp($event)' } })
export class PreventKeyseDirective {
    @Input('prevent-keys') preventKeys: any[] = [];

    onKeyUp($event: any) {
        if (this.preventKeys && this.preventKeys.includes($event.keyCode)) {
            $event.preventDefault();
        }
    }
}

@Directive({selector: '[prevent-space]'})
export class PreventSpaceDirective {
    @HostListener('keydown', ['$event'])
    onKeyDown($event: KeyboardEvent) {
        if ($event.key === ' ' || $event.key === 'Spacebar') {
            $event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();

        if (!event || !event.clipboardData)
            return;

        // Acessando o texto do clipboard
        const pastedInput: string = event.clipboardData!.getData('text/plain').replace(/\s/g, '');

        // Inserindo o texto sem espaços no campo de entrada
        document.execCommand('insertText', false, pastedInput);
    }
}