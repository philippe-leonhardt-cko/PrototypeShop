import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[checkout-solution-host]'
})

export class CheckoutSolutionDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}