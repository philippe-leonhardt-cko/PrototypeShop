import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { ShopComponent } from './components/shop/shop.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerSummaryComponent } from './components/customer/customerSummary.component';
import { OrderComponent } from './components/order/order.component';
import { CartComponent } from './components/cart/cart.component';
import { CartSummaryComponent } from './components/cart/cartSummary.component';
import { CheckoutSolutionComponent } from './components/cko-solution/cko-solution.component';
import { CheckoutJsComponent } from './components/cko-solution/cko-js/cko-js.component';
import { CheckoutFramesComponent } from './components/cko-solution/cko-frames/cko-frames.component';

import { CheckoutSolutionDirective } from './directives/checkout-solution.directive';
import { SummaryDirective } from './directives/summary.directive';

import { SecondsToTimePipe } from './pipes/SecondsToTime.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ShopComponent,
        NavMenuComponent,
        CartComponent,
        CartSummaryComponent,
        OrderComponent,
        CustomerComponent,
        CustomerSummaryComponent,
        CheckoutSolutionComponent,
        CheckoutJsComponent,
        CheckoutFramesComponent,
        SummaryDirective,
        CheckoutSolutionDirective,
        SecondsToTimePipe
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'shop', pathMatch: 'full' },
            { path: 'shop', component: ShopComponent },
            { path: 'customer', component: CustomerComponent },
            { path: 'order', component: OrderComponent },
            { path: '**', redirectTo: 'shop' }
        ])
    ],
    exports: [SummaryDirective],
    entryComponents: [CheckoutFramesComponent, CheckoutJsComponent]
})
export class AppModuleShared {
}
