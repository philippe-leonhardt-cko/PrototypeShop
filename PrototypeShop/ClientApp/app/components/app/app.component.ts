import { Component, OnInit, Inject, Input } from '@angular/core';
import { Http } from '@angular/http';

import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Product } from '../product/product';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [CheckoutSummaryService]
})
export class AppComponent implements OnInit {
    private cart: Cart = new Cart(this.checkoutSummaryService);

    public cartTotal: number | null;

    private  mockupProducts: Product[] = [
        new Product("100.100.023", 1),
        new Product("200.090.070", 1),
        new Product("300.250.011", 1)
    ]

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        checkoutSummaryService.setCart(this.cart);

        checkoutSummaryService.cart$.subscribe(
            cart => {
                this.cartTotal = cart.total;
            }
        );
    }

    ngOnInit() {
        this.addMockProductsAsync();
    }

    private async addMockProductsAsync() {
        this.mockupProducts.forEach(product => this.cart.addProduct(this.http, this.baseUrl, this.checkoutSummaryService, product))
    }
}
