export class Product {
    id: string;
    name: string;
    price: number;
    quantity: number;

    constructor(id: string, quantity: number) {
        this.id = id;
        this.quantity = quantity;
    }
}