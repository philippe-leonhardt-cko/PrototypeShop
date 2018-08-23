import { BaseAddress } from './BaseAddress';

export class ShippingAddress extends BaseAddress {
    public firstName: string | undefined;
    public lastName: string | undefined;

    get fullName(): string | undefined {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        } else {
            return undefined;
        }
    }
}