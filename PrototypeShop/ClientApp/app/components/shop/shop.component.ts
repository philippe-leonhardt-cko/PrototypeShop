import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Http } from '@angular/http';
import { Product } from '../product/product';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';


@Component({
    selector: 'shop',
    templateUrl: './shop.component.html'
})

export class ShopComponent implements OnInit, OnDestroy {
    private products: Product[] = [];
    private cart: Cart;
    private subscriptions: Subscription[] = [];
    public productsForm: FormGroup;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private http: Http, @Inject('BASE_URL') private baseUrl: string, private formBuilder: FormBuilder) {
        this.productsForm = this.formBuilder.group({
            "products": this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.makeSubscriptions();
        this.http.get(this.baseUrl + 'api/SampleData/GetProducts/')
            .subscribe(
                (products: any) => {
                    this.products = products.json() as Product[];
                    let productsFA = this.productsForm.get('products') as FormArray;
                    this.products.forEach((product: Product) => productsFA.push(this.createProduct(product)));
            },
            (error: any) => console.error(error));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let cartSubscription: Subscription = this.checkoutSummaryService.cart$.subscribe(
            (cart: Cart) => {
                this.cart = cart;
            });
        this.subscriptions.push(cartSubscription);
    }

    private createProduct(product: Product): FormGroup {
        return this.formBuilder.group({
            "product": product,
            "quantity": new FormControl("1", Validators.min(1)),
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "tags": product.tags,
            "vat": product.vat
        });
    }

    private addProduct(productToAdd: Product, quantity: string) {
        let productExistsInCart = this.cart.products.find(product => product.id == productToAdd.id) != undefined;
        if (productExistsInCart) {
            this.cart.increaseProductQuantity(productToAdd, parseInt(quantity));
        } else {
            productToAdd.quantity = parseInt(quantity);
            this.cart.addProduct(productToAdd);
        }
    }
}