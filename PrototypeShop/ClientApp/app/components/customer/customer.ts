import { Address } from '../address/address';
import { getAllDebugNodes } from '@angular/core/src/debug/debug_node';

export class Customer {
    public email: string;
    public firstName: string;
    public lastName: string;
    public billingAddress: Address = new Address();
    public shippingAddress: Address;
}