import { Subscription } from "rxjs";
import { CheckoutSummaryService } from "../../services/checkoutsummary.service";
import { TimerObservable } from "rxjs/observable/TimerObservable";

export class PaymentToken {
    public countdown: Subscription;
    private remainingTime: number = 0;
    constructor(public id: string, checkoutSummaryService: CheckoutSummaryService, private lifespanInSeconds: number) {
        this.countdown = new TimerObservable(0, 1000).subscribe(
            (t) => {
                let remainingTime: number = this.lifespanInSeconds - t;
                this.remainingTime = remainingTime;
                checkoutSummaryService.updatePaymentTokenCountdown(this.remainingTime);
                if (remainingTime <= 0) {
                    console.warn(`Payment Token ${this.id} expired.`);
                    this.countdown.unsubscribe();
                }
            }
        );
    }

    get isAlife(): boolean {
        return !this.countdown.closed;
    }
}