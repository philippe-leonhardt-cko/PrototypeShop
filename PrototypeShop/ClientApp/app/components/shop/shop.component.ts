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

    private addProduct(i: number) {
        let productToAdd: Product = <Product>(<FormControl>(<FormGroup>(<FormArray>this.productsForm.get('products')).controls[i]).get('product')).value;
        let quantity: any = <any>(<FormControl>(<FormGroup>(<FormArray>this.productsForm.get('products')).controls[i]).get('quantity')).value;
        quantity = !quantity ? 1 : parseInt(quantity);
        let productExistsInCart = this.cart.products.find(product => product.id == productToAdd.id) != undefined;
        if (productExistsInCart) {
            this.cart.increaseProductQuantity(productToAdd, quantity);
        } else {
            productToAdd.quantity = quantity;
            this.cart.addProduct(productToAdd);
        }
        (<FormControl>(<FormGroup>(<FormArray>this.productsForm.get('products')).controls[i]).get('quantity')).setValue('1');
    }

    private keyPress(event: KeyboardEvent) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    private resetInput(quantityInput: HTMLInputElement, i: number) {
        quantityInput.value = '1';
    }
}