import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Cart } from './cart';
import { Product } from '../product/product';


@Component({
    selector: 'cart',
    templateUrl: './cart.component.html'
})

export class CartComponent {
    public cart: Cart = new Cart(true);
    private http: Http;
    private baseUrl: string;

    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.http = http;
        this.baseUrl = baseUrl;
        this.addMockProductsAsync();
    }

    private async addMockProductsAsync() {
        this.cart.addProduct(this.http, this.baseUrl, new Product("100.200.300", 1));
        this.cart.addProduct(this.http, this.baseUrl, new Product("010.500.200", 1));
        this.cart.addProduct(this.http, this.baseUrl, new Product("500.000.100", 3));
    }
}