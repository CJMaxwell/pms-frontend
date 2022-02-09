import { Component, Injector } from '@angular/core';
import { NgxSpinnerTextService } from '@app/shared/ngx-spinner-text.service';

// 5ba7ea
@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>
    <ngx-spinner type="ball-clip-rotate" size="medium" color="#A63A2C">
        <p>{{ngxSpinnerText.currentText}}</p>
    </ngx-spinner>
    `
})
export class RootComponent {
    ngxSpinnerText: NgxSpinnerTextService;
    constructor(_ngxSpinnerText: NgxSpinnerTextService) {
        this.ngxSpinnerText = _ngxSpinnerText;
    }
}
