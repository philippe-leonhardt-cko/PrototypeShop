import { CheckoutSummaryService } from "../../services/checkoutsummary.service";
import { Customer } from "../../classes/customer/customer";

export interface ICheckoutSolutionComponent {
    customer: Customer;
    paymentToken: string;
    customerAgreesWithGtc: boolean;
    checkoutSummaryService: CheckoutSummaryService;
}