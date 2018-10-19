import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { BaseAddress } from '../../classes/address/BaseAddress';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';

@Component({
    selector: 'order',
    templateUrl: './order.component.html'
})
export class OrderComponent {
    private payment: Payment;
    private orderIdExists: boolean = true;
    private orderId: string;

    private paymentStatuses: { [statusCode: number]: string } = {
        0: 'Authorized',
        1: 'Unknown',
        2: 'Captured',
        3: 'Unknown',
        4: 'Unknown',
        5: 'Unknown',
        6: 'Unknown',
        7: 'Unknown',
        8: 'Unknown',
        9: 'Unknown'
    };

    constructor(private activatedRoute: ActivatedRoute, private http: Http, @Inject('BASE_URL') private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.checkoutSummaryService.toggleSideBar(false);
        this.activatedRoute.params.subscribe(
            async (params: any) => {
                /*let paymentToken = localStorage.getItem(params['id']);
                if (paymentToken) {
                    this.getPaymentDetails(paymentToken);
                } else {
                    this.orderIdExists = false;
                    console.log(this.orderId, this.orderIdExists)
                }*/
                this.orderId = params['id'];
                let payment: Payment = await this.getPaymentDetails(this.orderId);
                payment.source.billingAddress = await this.getShopAddress(payment.source.billingAddress);
                payment.status = this.getVerbosePaymentStatus(<number>payment.status);
                payment.shipping.address = await this.getShopAddress(payment.shipping.address);
                this.payment = payment;
                console.log(this.payment);
            }
        );
    }

    private getVerbosePaymentStatus(statusCode: number): string {
        return this.paymentStatuses[statusCode];
    }

    private paymentIsSuccessful(): boolean {
        if (['Authorized', 'Captured'].indexOf(<string>this.payment.status) > -1) {
            return true;
        } else {
            return false;
        }
    }

    private async getShopAddress(address: BaseAddress): Promise<any> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return new Promise(resolve => {
            this.http.get(`${this.baseUrl}api/Shop/CountryName/${address.country}`, requestOptions)
                .take(1)
                .subscribe(
                (response: Response) => {
                    address.country = <string>response.text();
                    resolve(address);
                },
                (error: any) => console.error(error))
        })
    }

    private async getPaymentDetails(paymentToken: string): Promise<any> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return new Promise(resolve => {
            this.http.get(`${this.baseUrl}api/Checkout/GetPaymentDetails/${paymentToken}`, requestOptions)
                .take(1)
                .subscribe(
                (response: Response) => {
                    resolve(<Payment>response.json());
                },
                (error: any) => {
                    console.error(error);
                    this.orderIdExists = false;
                })
        })
    }
}

class Payment {
    amount: number;
    currency: string;
    requestedOn: string;
    status: number | string;
    source: Source;
    shipping: Shipping;
}

class Shipping {
    address: BaseAddress;
    phone: object;
}

class Source {
    billingAddress: BaseAddress;
    scheme: string;
    last4: string;
}

class GetBillingAddress {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    state: string;
    zip: string;
}
