import { Product } from '../product/product';
import { Customer } from '../customer/customer';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Input } from '@angular/core';

export class Cart {
    id: string;
    editable: boolean = false;
    products: Product[] = [];
    customer: Customer;
    total: number = 0;
    @Input() checkoutSummaryService: CheckoutSummaryService;

    constructor(editable?: boolean) {
        this.id = "1122334455";
        this.customer = new Customer();
        this.total = this.calculateCartTotal();
        if (editable) {
            this.editable = editable;
        }
    }

    private calculateCartTotal(): number {
        if (this.products.length < 1) {
            return 0;
        } else {
            let prices = this.products.map(product => product.price);
            let quantities = this.products.map(product => product.quantity);
            let totals = prices.map((price, index) => price * quantities[index]);
            let total = totals.reduce((a, b) => a + b);
            try {
                this.checkoutSummaryService.updateCartTotal(total);
            } catch (e) {

            }
            return total;
        }

    }

    public addProduct(http: Http, baseUrl: string, checkoutSummaryService: CheckoutSummaryService, requestProduct: Product) {
        http.get(baseUrl + 'api/SampleData/GetProduct/' + requestProduct.id).subscribe(
            result => {
                let newProduct = result.json() as Product;
                newProduct.quantity = requestProduct.quantity;
                this.products.push(newProduct);
                this.total = this.calculateCartTotal();
            },
            error => console.error(error)
        )
    }

    private discardProduct(product: Product) {
        let index: number = this.products.indexOf(product, 0);
        if (index > -1) {
            this.products.splice(index, 1);
        }
    }

    public increaseProductQuantity(product: Product) {
        product.quantity++;
        this.total = this.calculateCartTotal();
    }

    public decreaseProductQuantity(product: Product) {
        if (product.quantity == 1) {
            if (window.confirm(`Do you really want to discard ${product.name} (${product.id}) from your cart?`)) {
                this.discardProduct(product);
            };
        } else {
            product.quantity--;
        }
        this.total = this.calculateCartTotal();
    }
}