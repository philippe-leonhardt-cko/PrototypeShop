import { Component } from '@angular/core';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    public shop: IShop;

    constructor() {
        this.shop = {
            name: "Best Secret"
        } as IShop;
    }
}

interface IShop {
    name: string;
}
