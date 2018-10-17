import { BaseAddress } from '../address/BaseAddress';
import { Order } from '../order/order';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Http } from '@angular/http';

export class Customer {
    private _isLoggedIn: boolean = false;

    public firstName: string = "";
    public lastName: string = "";
    public email: string = "";
    public addresses: Array<BaseAddress> = [];
    public order: Order;

    constructor(http: Http, baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.checkoutSummaryService = checkoutSummaryService;
        this.order = new Order(http, baseUrl, this.checkoutSummaryService, this);
    }

    public logIn(customerData: Customer) {
        this._isLoggedIn = true;
        this.firstName = customerData.firstName;
        this.lastName = customerData.lastName;
        this.email = customerData.email;
        this.addresses = this.sortAddressesAlphabetically(customerData.addresses);
        this.order.setBillingAddress(<BaseAddress>customerData.addresses.find((address: BaseAddress) => <boolean>address.isPrimaryBillingAddress));
        this.order.setShippingAddress(<BaseAddress>customerData.addresses.find((address: BaseAddress) => <boolean>address.isPrimaryShippingAddress));
    }

    public logOut() {
        this._isLoggedIn = false;
        this.clearCustomer();
        this.order.billingAddress.isTemplateAddress = false;
        this.order.shippingAddress.isTemplateAddress = false;
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get fullName(): string {
        return `${this.order.billingAddress.firstName} ${this.order.billingAddress.lastName}`;        
    }

    private clearCustomer() {
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.addresses = [];
    }

    private sortAddressesAlphabetically(addresses: Array<BaseAddress>): Array<BaseAddress> {
        return addresses.sort(
            (a, b) => {
                let nameA = a.firstName!.toUpperCase();
                let nameB = b.firstName!.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
    }
}