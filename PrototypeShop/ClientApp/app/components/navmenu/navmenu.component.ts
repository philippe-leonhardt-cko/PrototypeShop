import { Component, Input } from '@angular/core';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    public shop: IShop;
    @Input() cartTotal: number;

    constructor() {
        this.shop = {
            name: "Checkout.com Shop"
        } as IShop;
    }
}

interface IShop {
    name: string;
}
