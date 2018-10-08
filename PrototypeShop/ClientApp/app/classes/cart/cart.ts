import { Product } from '../product/product';
import { Http, Response } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';
import { Order } from '../order/order';

export class Cart {
    public products: Product[] = [];

    constructor(private http: Http, private baseUrl: string, private order: Order) { }

    public addProduct(requestProduct: Product): Subscription {
        return this.http.get(this.baseUrl + 'api/SampleData/GetProduct/' + requestProduct.id)
            .take(1)
            .subscribe(
                (result: Response) => {
                    let newProduct = <Product>result.json();
                    newProduct.quantity = requestProduct.quantity;
                    this.products.push(newProduct);
                    this.order.calculateTotals();
                },
                (error: any) => {
                    console.error(error);
                }
            )
    }

    private discardProduct(product: Product) {
        let index: number = this.products.indexOf(product, 0);
        if (index > -1) {
            this.products.splice(index, 1);
        }
        this.order.calculateTotals();
    }

    public increaseProductQuantity(productToIncrease: Product, increaseBy?: number) {
        let matchedProduct = <Product>this.products.filter((product: Product) => product.id == productToIncrease.id).pop();
        if (increaseBy == undefined) {
            matchedProduct.quantity++;
        } else {
            matchedProduct.quantity += increaseBy;
        }
        this.order.calculateTotals();
    }

    public decreaseProductQuantity(productToDecrease: Product) {
        if (productToDecrease.quantity == 1) {
            this.discardProduct(productToDecrease);
        } else {
            productToDecrease.quantity--;
        }
        this.order.calculateTotals();
    }

    public updateProductCount(productToUpdate: Product, quantity: string | number) {
        if (typeof quantity == 'string') {
            quantity = parseInt(quantity);
        }
        let matchedProduct = <Product>this.products.filter((product: Product) => product.id == productToUpdate.id).pop();
        if (quantity > 0 && matchedProduct.quantity != quantity) {
            matchedProduct.quantity = quantity;
            this.order.calculateTotals();
        }
    }
}