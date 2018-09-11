import { Component, OnInit, OnDestroy, Type, ComponentFactoryResolver, ViewChild, ComponentFactory, ViewContainerRef, Input, ComponentRef } from "@angular/core";
import { CheckoutFramesComponent } from "../cko-frames/cko-frames.component";
import { CheckoutSolutionDirective } from "../../directives/checkout-solution.directive";
import { CheckoutJsComponent } from "../cko-js/cko-js.component";
import { CheckoutSummaryService } from "../../services/checkoutsummary.service";
import { Subscription } from "rxjs";
import { Cart } from "../cart/cart";
import { ICheckoutSolutionComponent } from "./cko-solution.interface";

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

    @Input() cart: Cart;
    @Input() paymentToken: string;
    @Input() customerDetailsComplete: boolean;
    @ViewChild(CheckoutSolutionDirective) checkoutSolutionHost: CheckoutSolutionDirective;

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

        console.log(this.checkoutSolutionHost);
        let viewContainerRef: ViewContainerRef = this.checkoutSolutionHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef: ComponentRef<ICheckoutSolutionComponent> = viewContainerRef.createComponent(componentFactory);
        let componentInstance: ICheckoutSolutionComponent = (<ICheckoutSolutionComponent>componentRef.instance);
        componentInstance.cart = this.cart;
        componentInstance.paymentToken = this.paymentToken;
        componentInstance.customerDetailsComplete = this.customerDetailsComplete;
    }

    private makeSubscriptions() {
        let checkoutSolutionSubscription = this.checkoutSummaryService.checkoutSolutionSource$.subscribe(
            (solution: string) => {
                this.solution = this.solutions[solution];
                this.loadComponent();
            }
        );
        this.subscriptions.push(checkoutSolutionSubscription);
    }
}