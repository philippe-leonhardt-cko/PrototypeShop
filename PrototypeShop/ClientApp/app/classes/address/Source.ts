import { GetAddress } from "./GetAddress";
import { Phone } from "./Phone";

export class Source {
    type: string;
    id: string;
    billing_address: GetAddress;
    phone: Phone;
}