import { Component, Input } from '@angular/core';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    public shop: IShop;
    @Input() cartTotal: number;
    @Input() customerFullName: string;

    constructor() {
        this.shop = {
            name: "Best Secret"
        } as IShop;
    }
}

interface IShop {
    name: string;
}
