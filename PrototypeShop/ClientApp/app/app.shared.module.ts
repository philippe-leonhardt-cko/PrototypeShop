import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { ShopComponent } from './components/shop/shop.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerComponent } from './components/customer/customer.component';
import { BillingSummaryComponent } from './components/customer/billingSummary.component';
import { ShippingSummaryComponent } from './components/customer/shippingSummary.component';
import { CustomerSummaryComponent } from './components/customer/customerSummary.component';
import { CartComponent } from './components/cart/cart.component';
import { CartSummaryComponent } from './components/cart/cartSummary.component';
import { SummaryComponent } from './components/summary/summary.component';
import { CheckoutSolutionComponent } from './components/cko-solution/cko-solution.component';
import { CheckoutJsComponent } from './components/cko-solution/cko-js/cko-js.component';
import { CheckoutFramesComponent } from './components/cko-solution/cko-frames/cko-frames.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';

import { CheckoutSolutionDirective } from './directives/checkout-solution.directive';
import { SummaryDirective } from './directives/summary.directive';

import { SecondsToTimePipe } from './pipes/SecondsToTime.pipe';

@NgModule({
    declarations: [
        AppComponent,
        ShopComponent,
        NavMenuComponent,
        DashboardComponent,
        CartComponent,
        CartSummaryComponent,
        CustomerComponent,
        LoginComponent,
        BillingSummaryComponent,
        ShippingSummaryComponent,
        CustomerSummaryComponent,
        CheckoutSolutionComponent,
        CheckoutJsComponent,
        CheckoutFramesComponent,
        SummaryComponent,
        OrderComponent,
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
            {
                path: '',
                redirectTo: '/shop',
                pathMatch: 'full'
            },
            {
                path: 'shop',
                children: [
                    {
                        path: '',
                        component: ShopComponent
                    },
                    {
                        outlet: 'contextMenu',
                        path: '',
                        component: CartComponent
                    }                    
                ]
            },
            {
                path: 'customer',
                children: [
                    {
                        path: '',
                        component: CustomerComponent
                    },
                    {
                        outlet: 'contextMenu',
                        path: '',
                        component: LoginComponent
                    }
                ]
            },
            {
                path: 'summary',
                children: [
                    {
                        path: '',
                        component: SummaryComponent
                    },
                    {
                        outlet: 'contextMenu',
                        path: '',
                        component: CheckoutSolutionComponent
                    }
                ]
            },
            {
                path: 'order/:id',
                component: OrderComponent
            },
            {
                path: '**',
                redirectTo: '/shop'
            }
        ])
    ],
    exports: [SummaryDirective],
    entryComponents: [CheckoutFramesComponent, CheckoutJsComponent]
})
export class AppModuleShared {
}
