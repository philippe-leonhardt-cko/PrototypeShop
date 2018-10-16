import { Component, Input, OnDestroy } from '@angular/core';
import { Customer } from '../../classes/customer/customer';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html'
})
export class NavMenuComponent implements OnDestroy {
    @Input() customer: Customer;
    @Input() customerDetailsComplete: boolean;
    private subscriptions: Subscription[] = [];
    private sideBarOpen: boolean;

    constructor(private checkoutSummaryService: CheckoutSummaryService) {
        let sideBarOpenSubscription: Subscription = this.checkoutSummaryService.sideBar$.subscribe(
            (sideBarOpen: boolean) => {
                this.sideBarOpen = sideBarOpen;
            });
        this.subscriptions.push(sideBarOpenSubscription);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    toggleSideBar() {
        this.sideBarOpen = !this.sideBarOpen;
        this.checkoutSummaryService.toggleSideBar(this.sideBarOpen);
    }
}
