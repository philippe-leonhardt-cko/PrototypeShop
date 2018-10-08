import { CheckoutSummaryService } from "../../services/checkoutsummary.service";
import { Customer } from "../../classes/customer/customer";

export interface ICheckoutSolutionComponent {
    customer: Customer | undefined;
    customerAgreesWithGtc: boolean;
    checkoutSummaryService: CheckoutSummaryService | undefined;
}