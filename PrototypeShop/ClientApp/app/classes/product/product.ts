export class Product {
    id: string = "";
    name: string = "";
    pricing: Pricing = new Pricing();
    quantity: number = 0;
    description: string = "";
    tags: string[] = [];

    constructor(id: string, quantity: number = 1) {
        this.id = id;
        this.quantity = quantity;
    }
}

export class Pricing {
    gross: number = 0;
    taxPercent: number = 0;
    net: number = 0;
    taxNominal: number = 0;
}