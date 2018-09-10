import { Component, OnInit, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [CheckoutSummaryService]
})
export class AppComponent {
    private cart: Cart = new Cart(this.http, this.baseUrl, this.checkoutSummaryService);

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.checkoutSummaryService.setCart(this.cart);
    }
}
