import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { CustomerComponent } from './components/customer/customer.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CartComponent } from './components/cart/cart.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CartComponent,
        FetchDataComponent,
        CustomerComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'customer', component: CustomerComponent },
            { path: 'cart', component: CartComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
