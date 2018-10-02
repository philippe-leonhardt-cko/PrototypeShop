import { Timestamp } from "rxjs";
import { Injectable } from "@angular/core";
import { CheckoutSummaryService } from "../../services/checkoutsummary.service";

@Injectable()

export class LogEntry {
    public timestamp: Timestamp<any>;
    public message: string;

    constructor(checkoutSummaryService: CheckoutSummaryService, message: string) {
        this.timestamp = new Timestamp(Date.now(), 0);
        this.message = message;
        console.info(message);
        if (checkoutSummaryService) {
            checkoutSummaryService.log(this.timestamp, this.message);
        }
    }
}