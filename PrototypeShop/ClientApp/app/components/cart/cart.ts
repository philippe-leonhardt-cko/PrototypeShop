import { Product } from '../product/product';
import { Customer } from '../customer/customer';
import { Http } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';

export class Cart {
    public id: string;
    public products: Product[] = [];
    public customer: Customer;
    public currency: string = 'GBP';
    public total: number = 0;


    constructor(private checkoutSummaryService: CheckoutSummaryService) {
        this.id = '12345';
        this.customer = new Customer(this.checkoutSummaryService);
        this.total = this.calculateCartTotal();
    }

    private calculateCartTotal(): number {
        let cartTotal: number;
        if (this.products.length < 1) {
            cartTotal = 0;
        } else {
            let prices = this.products.map(product => product.price);
            let quantities = this.products.map(product => product.quantity);
            let totals = prices.map((price, index) => price * quantities[index]);
            cartTotal = totals.reduce((a, b) => a + b);
        }
        this.checkoutSummaryService.updateCustomerPageUnlocked(cartTotal > 0);
        return cartTotal;
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
        if (product.quantity == 0) {
            if (window.confirm(`Do you really want to discard ${product.name} (${product.id}) from your cart?`)) {
                this.discardProduct(product);
            };
        } else {
            product.quantity--;
        }
        this.total = this.calculateCartTotal();
    }
}