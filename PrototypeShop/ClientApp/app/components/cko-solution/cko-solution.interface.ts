﻿import { Cart } from "../cart/cart";

export interface ICheckoutSolutionComponent {
    cart: Cart;
    paymentToken: string;
    customerDetailsComplete: boolean;
}