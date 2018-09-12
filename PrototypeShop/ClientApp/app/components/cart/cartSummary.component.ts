import { Component, Input } from '@angular/core';
import { Cart } from '../cart/cart';

@Component({
    selector: 'cart-summary',
    templateUrl: './cartSummary.component.html'
})

export class CartSummaryComponent {
    @Input() cart: Cart;
}