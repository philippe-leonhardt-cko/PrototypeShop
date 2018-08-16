using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Checkout;
using Checkout.ApiServices.SharedModels;
using Checkout.ApiServices.Tokens.RequestModels;
using Checkout.ApiServices.Tokens.ResponseModels;

namespace PrototypeShop.Controllers
{
    [Route("api/[controller]")]
    public class CheckoutController : Controller
    {
        static CheckoutConfiguration configuration = new CheckoutConfiguration()
        {
            PublicKey = Environment.GetEnvironmentVariable("CKO_PUBLIC_KEY"),
            SecretKey = Environment.GetEnvironmentVariable("CKO_SECRET_KEY"),
            DebugMode = true
        };

        ApiClientAsync CheckoutClient = new ApiClientAsync(configuration);

        [HttpPost("[action]")]
        public async Task<string> GetPaymentToken([FromBody] string value)
        {
            PaymentTokenCreate paymentTokenCreate = new PaymentTokenCreate()
            {
                Value = "300",
                Currency = "GBP",
                TrackId = Guid.NewGuid().ToString(),
                SuccessUrl = "https://www.checkout.com/checkout?order=success",
                FailUrl = "https://www.checkout.com/checkout?order=fail"
            };
            HttpResponse<PaymentToken> paymentTokenResponse = await CheckoutClient.TokenServiceAsync.CreatePaymentTokenAsync(paymentTokenCreate);
            PaymentToken paymentToken = paymentTokenResponse.Model;
            return paymentToken.Id;
        }
    }
}
