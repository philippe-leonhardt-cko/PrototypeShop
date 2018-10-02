export class Product {
    id: string;
    name: string;
    vat: number;
    pricing: Pricing;
    quantity: number;
    description: string;
    tags: string[];

    constructor(id: string, quantity: number = 1) {
        this.id = id;
        this.quantity = quantity;
    }
}

export class Pricing {
    gross: number;
    taxPercent: number;
    net: number;
    taxNominal: number;
}