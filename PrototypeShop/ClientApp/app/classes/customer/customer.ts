import { BaseAddress } from '../address/BaseAddress';
import { Order } from '../order/order';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Http } from '@angular/http';

export class Customer {
    public firstName: string = "";
    public lastName: string = "";
    public email: string = "";
    public addresses: Array<BaseAddress> = [];
    public order: Order;
    private _isLoggedIn: boolean = false;


    constructor(http: Http, baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.checkoutSummaryService = checkoutSummaryService;
        this.order = new Order(http, baseUrl, this.checkoutSummaryService, this);
    }

    public logIn() {
        this._isLoggedIn = true;
        this.firstName = this.order.billingAddress.firstName;
        this.lastName = this.order.billingAddress.lastName;
    }

    public logOut() {
        this._isLoggedIn = false;
        this.addresses = [];
        this.order.billingAddress.isTemplateAddress = false;
        this.order.shippingAddress.isTemplateAddress = false;
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get fullName(): string {
        return `${this.order.billingAddress.firstName} ${this.order.billingAddress.lastName}`;        
    }
}