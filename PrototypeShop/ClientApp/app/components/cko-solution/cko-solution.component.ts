import { Component, OnDestroy, Type, ComponentFactoryResolver, ViewChild, ComponentFactory, ViewContainerRef, ComponentRef } from "@angular/core";
import { CheckoutFramesComponent } from "./cko-frames/cko-frames.component";
import { CheckoutSolutionDirective } from "../../directives/checkout-solution.directive";
import { CheckoutJsComponent } from "./cko-js/cko-js.component";
import { CheckoutSummaryService } from "../../services/checkoutsummary.service";
import { Subscription } from "rxjs";
import { ICheckoutSolutionComponent } from "./cko-solution.interface";
import { Customer } from "../../classes/customer/customer";
import { PaymentMethod } from "../../classes/payment-method/PaymentMethod";

@Component({
    selector: 'cko-solution',
    templateUrl: './cko-solution.component.html',
})

export class CheckoutSolutionComponent implements OnDestroy {
    private subscriptions: Subscription[] = [];
    private solutions: { [solution: string]: Type<any>; } = {
        'frames': CheckoutFramesComponent,
        'checkout.js': CheckoutJsComponent
    };
    private currentSolution: Type<any> = this.solutions['frames'];
    private paymentMethods: PaymentMethod[] = [
        new PaymentMethod('Credit Card', 'https://freeiconshop.com/wp-content/uploads/edd/creditcard-outline-filled.png', (paymentMethod: PaymentMethod) => { this.currentPaymentMethod = paymentMethod; this.makeCardPayment(); }),
        new PaymentMethod('giropay', 'https://icepay.de/app/uploads/sites/9/2014/10/21.png', (paymentMethod: PaymentMethod) => { this.currentPaymentMethod = paymentMethod; this.makeAlternativePayment(); }),
        new PaymentMethod('iDeal', 'https://camo.githubusercontent.com/18117a75367811cae4a6eb94946b7d10cd27da11/68747470733a2f2f7777772e696465616c2e6e6c2f696d672f73746174697363682f6d6f6269656c2f694445414c5f353132783531322e676966', (paymentMethod: PaymentMethod) => { this.currentPaymentMethod = paymentMethod; this.makeAlternativePayment(); })
        //new PaymentMethod('PayPal', 'https://trak-4.com/wp-content/uploads/2018/08/Paypal.jpg?w=640', () => { })
    ];
    private currentPaymentMethod: PaymentMethod;
    private customer: Customer | undefined;
    private customerDetailsComplete: boolean = false;
    @ViewChild(CheckoutSolutionDirective) checkoutSolutionHost: CheckoutSolutionDirective;
    private checkoutSolutionInstance: ICheckoutSolutionComponent;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private checkoutSummaryService: CheckoutSummaryService) {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
                this.currentSolution = this.solutions[solution];
            });
        this.subscriptions.push(customerSubscription, customerDetailsCompleteSubscription, checkoutSolutionSubscription);
    }

    private makeCardPayment() {
        let componentFactory: ComponentFactory<any> = this.componentFactoryResolver.resolveComponentFactory(this.currentSolution);

        let viewContainerRef: ViewContainerRef = this.checkoutSolutionHost.viewContainerRef;
        viewContainerRef.clear();

        let checkoutSolutionRef: ComponentRef<ICheckoutSolutionComponent> = viewContainerRef.createComponent(componentFactory);
        this.checkoutSolutionInstance = (<ICheckoutSolutionComponent>checkoutSolutionRef.instance);
        this.checkoutSolutionInstance.customer = this.customer;
        this.checkoutSolutionInstance.checkoutSummaryService = this.checkoutSummaryService;
        this.checkoutSolutionInstance.init();
    }

    private makeAlternativePayment() {
        let viewContainerRef: ViewContainerRef = this.checkoutSolutionHost.viewContainerRef;
        viewContainerRef.clear();
    }

    private enablePayment(consentToGtcGiven: boolean) {
        this.checkoutSummaryService.updateCustomerAgreesWithGtc(consentToGtcGiven);
    }
}