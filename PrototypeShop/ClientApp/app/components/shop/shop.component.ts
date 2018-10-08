import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Http } from '@angular/http';
import { Product } from '../../classes/product/product';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Customer } from '../../classes/customer/customer';


@Component({
    selector: 'shop',
    templateUrl: './shop.component.html'
})

export class ShopComponent implements OnInit, OnDestroy {
    private products: Product[] = [];
    private customer: Customer | undefined;
    private subscriptions: Subscription[] = [];
    public productsForm: FormGroup;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private http: Http, @Inject('BASE_URL') private baseUrl: string, private formBuilder: FormBuilder) {
        this.productsForm = this.formBuilder.group({
            "products": this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.makeSubscriptions();
        this.http.get(this.baseUrl + 'api/SampleData/GetProducts/').subscribe(
            (products: any) => {
                this.products = <Product[]>products.json();
                let productsFA = <FormArray>this.productsForm.get('products');
                this.products.forEach((product: Product) => productsFA.push(this.createProduct(product)));
            },
            (error: any) => console.error(error));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        this.subscriptions.push(customerSubscription);
    }

    private createProduct(product: Product): FormGroup {
        return this.formBuilder.group({
            "product": product,
            "quantity": new FormControl("1", Validators.min(1)),
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "gross": product.pricing.gross,
            "net": product.pricing.net,
            "taxPercent": product.pricing.taxPercent,
            "taxNominal": product.pricing.taxNominal,
            "tags": product.tags
        });
    }

    private addProduct(i: number) {
        let productToAdd: Product = <Product>(<FormControl>(<FormGroup>(<FormArray>this.productsForm.get('products')).controls[i]).get('product')).value;
        let quantity: any = <any>(<FormControl>(<FormGroup>(<FormArray>this.productsForm.get('products')).controls[i]).get('quantity')).value;
        quantity = !quantity ? 1 : parseInt(quantity);
        let productExistsInCart = this.customer!.cart.products.find(product => product.id == productToAdd.id) != undefined;
        if (productExistsInCart) {
            this.customer!.cart.increaseProductQuantity(productToAdd, quantity);
        } else {
            productToAdd.quantity = quantity;
            this.customer!.cart.addProduct(productToAdd);
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