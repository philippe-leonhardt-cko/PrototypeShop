import { BillingAddress } from '../address/BillingAddress';
import { ShippingAddress } from '../address/ShippingAddress';
import { BaseAddress } from '../address/BaseAddress';
import { Cart } from '../cart/cart';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Http } from '@angular/http';

export class Customer {
    public addresses: Array<BaseAddress> = [];
    public cart: Cart;
    private checkoutSummaryService: CheckoutSummaryService;
    private _isLoggedIn: boolean = false;
    private _email: string;
    private _billingAddress: BillingAddress = new BillingAddress();
    private _shippingAddress: ShippingAddress = this.billingAddress;


    constructor(http: Http, baseUrl: string, checkoutSummaryService: CheckoutSummaryService) {
        this.checkoutSummaryService = checkoutSummaryService;
        this.cart = new Cart(http, baseUrl, this.checkoutSummaryService, this);
    }

    public logIn() {
        this._isLoggedIn = true;
    }

    public logOut() {
        this._isLoggedIn = false;
        this.addresses = [];
        this.billingAddress = new BillingAddress();
        this.shippingAddress = this.billingAddress;
    }

    public shippingToBillingAddress(isDesired: boolean) {
        if (isDesired) {
            this.shippingAddress = this.billingAddress;
        } else {
            this.newShippingAddress();
        }
        this.checkoutSummaryService.updateShippingToBillingAddress(isDesired);
    }

    public newBillingAddress() {
        this.billingAddress = new BillingAddress();
    }

    public newShippingAddress() {
        this.shippingAddress = new ShippingAddress();
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = email;
    }

    get firstName(): string {
        return this._billingAddress.firstName;
    }

    set firstName(firstName: string) {
        this._billingAddress.firstName = firstName;
    }

    get lastName(): string {
        return this._billingAddress.lastName;
    }

    set lastName(lastName: string) {
        this._billingAddress.lastName = lastName;
    }

    get fullName(): string {
        return `${this._billingAddress.firstName} ${this._billingAddress.lastName}`;        
    }

    get billingAddress(): BillingAddress {
        return this._billingAddress;
    }

    set billingAddress(billingAddress: BillingAddress) {
        this._billingAddress = billingAddress;
    }

    get shippingAddress(): ShippingAddress {
        return this._shippingAddress;
    }

    set shippingAddress(shippingAddress: ShippingAddress) {
        this._shippingAddress = shippingAddress;
    }
}