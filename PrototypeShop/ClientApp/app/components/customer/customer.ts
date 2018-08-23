import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { BillingAddress } from '../address/BillingAddress';
import { ShippingAddress } from '../address/ShippingAddress';

export class Customer {
    private _shippingToBillingAddress: boolean = true;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private _email?: string, private _firstName?: string, private _lastName?: string, private _billingAddress?: BillingAddress, private _shippingAddress?: ShippingAddress) {
        this.billingAddress = new BillingAddress();
        this.shippingAddress = new ShippingAddress();
    }

    get email(): string | undefined {
        return this._email;
    }

    set email(email: string | undefined) {
        this._email = email;
        if (this._email) {
            this.checkoutSummaryService.updateCustomerEmail(this._email as string);
        }
    }

    get firstName(): string | undefined {
        return this._firstName;
    }

    set firstName(firstName: string | undefined) {
        this._firstName = firstName;
    }

    get lastName(): string | undefined {
        return this._lastName;
    }

    set lastName(lastName: string | undefined) {
        this._lastName = lastName;
    }

    get fullName(): string | undefined {
        if (this._firstName && this._lastName) {
            return `${this._firstName} ${this._lastName}`;
        } else {
            return undefined;
        }
        
    }

    get billingAddress(): BillingAddress | undefined {
        return this._billingAddress;
    }

    set billingAddress(billingAddress: BillingAddress | undefined) {
        this._billingAddress = billingAddress;
    }

    get shippingAddress(): ShippingAddress | undefined {
        return this._shippingAddress;
    }

    set shippingAddress(shippingAddress: ShippingAddress | undefined) {
        this._shippingAddress = shippingAddress;
    }

    get shippingToBillingAddress(): boolean {
        return this._shippingToBillingAddress;
    }

    set shippingToBillingAddress(shippingToBillingAddress: boolean) {
        this._shippingToBillingAddress = shippingToBillingAddress;
    }
}