import { Component } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ CheckoutSummaryService ]
})
export class AppComponent {
    public cartTotal: number|null;
    public customerFullName: string|null;

    constructor(private checkoutSummaryService: CheckoutSummaryService) {
        checkoutSummaryService.cartTotal$.subscribe(
            cartTotal => {
                this.cartTotal = cartTotal;
            }
        );
        checkoutSummaryService.customerFullName$.subscribe(
            customerFullName => {
                this.customerFullName = customerFullName;
            }
        );
    }
}
