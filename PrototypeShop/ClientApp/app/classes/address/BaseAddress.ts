export class BaseAddress {
    isPrimaryBillingAddress: boolean = false;
    isPrimaryShippingAddress: boolean = false;
    isTemplateAddress: boolean = false;

    addressLine1: string = "";
    addressLine2: string = "";
    zip: string = "";
    city: string = "";
    state: string = "";
    country: string = "";
}