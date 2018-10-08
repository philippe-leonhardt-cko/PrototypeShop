import { Component, Input, OnInit } from '@angular/core';

import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Router } from '@angular/router';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    @Input() solutions: string[] = [];
    @Input() log: any[] = [];
    @Input() customer: Customer | undefined;
    @Input() paymentTokenId: string | undefined;
    @Input() paymentTokenCountdown: number | undefined;
    @Input() customerDetailsComplete: boolean = false;
    private currentSolution: string | undefined;
    private debugConsoleIsVisible: boolean = false;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private router: Router) { }

    ngOnInit() {
        this.currentSolution = this.solutions[0];
    }

    private setSolution(selectedSolution: string) {
        this.currentSolution = selectedSolution;
        this.checkoutSummaryService.updateCheckoutSolution(this.currentSolution);
    }

    private toggleDebugConsole() {
        this.debugConsoleIsVisible = !this.debugConsoleIsVisible;
    }
}
