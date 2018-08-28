import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerSummaryComponent } from './components/customer/customerSummary.component';
import { OrderComponent } from './components/order/order.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutJsComponent } from './components/cko-js/cko-js.component';
import { SummaryDirective } from './directives/summary.directive';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CartComponent,
        OrderComponent,
        CustomerComponent,
        CustomerSummaryComponent,
        CheckoutJsComponent,
        SummaryDirective
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'cart', pathMatch: 'full' },
            { path: 'cart', component: CartComponent },
            { path: 'customer', component: CustomerComponent },
            { path: 'order', component: OrderComponent },
            { path: '**', redirectTo: 'cart' }
        ])
    ],
    exports: [SummaryDirective]
})
export class AppModuleShared {
}
