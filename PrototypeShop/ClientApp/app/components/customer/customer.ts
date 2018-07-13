import { Address } from '../address/address';

export class Customer {
    public email: string;
    public firstName: string;
    public lastName: string;
    public billingAddress: Address;
    public shippingAddress: Address;
}