import { Component, OnDestroy, Type, ComponentFactoryResolver, ViewChild, ComponentFactory, ViewContainerRef, Input, ComponentRef, OnInit } from "@angular/core";
import { CheckoutFramesComponent } from "./cko-frames/cko-frames.component";
import { CheckoutSolutionDirective } from "../../directives/checkout-solution.directive";
import { CheckoutJsComponent } from "./cko-js/cko-js.component";
import { CheckoutSummaryService } from "../../services/checkoutsummary.service";
import { Subscription } from "rxjs";
import { ICheckoutSolutionComponent } from "./cko-solution.interface";
import { Customer } from "../../classes/customer/customer";
import { PaymentToken } from "../../classes/payment-token/PaymentToken";

@Component({
    selector: 'cko-solution',
    templateUrl: './cko-solution.component.html',
})

export class CheckoutSolutionComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private solutions: { [solution: string]: Type<any>; } = {
        'frames': CheckoutFramesComponent,
        'checkout.js': CheckoutJsComponent
    };
    private solution: Type<any> = this.solutions['frames'];

    private customer: Customer | undefined;
    private customerDetailsComplete: boolean = false;
    private customerAgreesWithGtc: boolean = false;
    @ViewChild(CheckoutSolutionDirective) checkoutSolutionHost: CheckoutSolutionDirective | undefined;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private checkoutSummaryService: CheckoutSummaryService) {
        this.makeSubscriptions();
    }

    ngOnInit() {
        this.loadComponent();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private loadComponent() {
        let componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(this.solution);

        let viewContainerRef: ViewContainerRef = this.checkoutSolutionHost!.viewContainerRef;
        viewContainerRef.clear();

        let componentRef: ComponentRef<ICheckoutSolutionComponent> = viewContainerRef.createComponent(componentFactory);
        let componentInstance: ICheckoutSolutionComponent = (<ICheckoutSolutionComponent>componentRef.instance);
        componentInstance.customer = this.customer;
        componentInstance.checkoutSummaryService = this.checkoutSummaryService;
    }

    private makeSubscriptions() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        let customerDetailsCompleteSubscription: Subscription = this.checkoutSummaryService.customerDetailsComplete$.subscribe(
            (customerDetailsComplete: boolean) => {
                this.customerDetailsComplete = customerDetailsComplete;
            });
        let checkoutSolutionSubscription: Subscription = this.checkoutSummaryService.checkoutSolutionSource$.subscribe(
            (solution: string) => {
                this.solution = this.solutions[solution];
                if (this.checkoutSolutionHost) {
                    this.loadComponent();
                }
            });
        this.subscriptions.push(customerSubscription, customerDetailsCompleteSubscription, checkoutSolutionSubscription);
    }

    private configureCheckout(consentGiven: boolean) {
        this.checkoutSummaryService.updateCustomerAgreesWithGtc(consentGiven);
    }
}