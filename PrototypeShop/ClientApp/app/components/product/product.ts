export class Product {
    id: string;
    name: string;
    vat: number;
    price: number;
    quantity: number;
    description: string;
    tags: string[];

    constructor(id: string, quantity: number) {
        this.id = id;
        this.quantity = quantity;
    }
}