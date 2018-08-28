import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { BillingAddress } from '../address/BillingAddress';
import { ShippingAddress } from '../address/ShippingAddress';

export class Customer {
    private _shippingToBillingAddress: boolean = true;
    private _billingAddress: BillingAddress = new BillingAddress();
    private _shippingAddress: ShippingAddress = new ShippingAddress();


    constructor(private checkoutSummaryService: CheckoutSummaryService, private _email?: string, billingAddress?: BillingAddress, shippingAddress?: ShippingAddress) {
        if (billingAddress) {
            this.billingAddress = billingAddress;
        }
        if (shippingAddress) {
            this.shippingAddress = shippingAddress;
        }
    }

    get email(): string | undefined {
        return this._email;
    }

    set email(email: string | undefined) {
        this._email = email;
    }

    get firstName(): string | undefined {
        return this._billingAddress.firstName;
    }

    set firstName(firstName: string | undefined) {
        this._billingAddress.firstName = firstName;
    }

    get lastName(): string | undefined {
        return this._billingAddress.lastName;
    }

    set lastName(lastName: string | undefined) {
        this._billingAddress.lastName = lastName;
    }

    get fullName(): string | undefined {
        if (this._billingAddress.firstName && this._billingAddress.lastName) {
            return `${this._billingAddress.firstName} ${this._billingAddress.lastName}`;
        } else {
            return undefined;
        }
        
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

    get shippingToBillingAddress(): boolean {
        return this._shippingToBillingAddress;
    }

    set shippingToBillingAddress(shippingToBillingAddress: boolean) {
        this._shippingToBillingAddress = shippingToBillingAddress;
    }
}