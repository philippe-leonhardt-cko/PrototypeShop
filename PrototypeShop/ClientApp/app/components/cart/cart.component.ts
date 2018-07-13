import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Cart } from './cart';
import { Product } from '../product/product';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';


@Component({
    selector: 'cart',
    templateUrl: './cart.component.html'
})

export class CartComponent {
    public cart: Cart = new Cart(true);
    private http: Http;
    private baseUrl: string;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.addMockProductsAsync();
    }

    private addProduct(product: Product) {
        this.cart.addProduct(this.http, this.baseUrl, this.checkoutSummaryService, product);
    }

    private async addMockProductsAsync() {
        this.addProduct(new Product("100.100.023", 1));
        this.addProduct(new Product("200.090.070", 1));
        this.addProduct(new Product("300.250.011", 1));
    }
}