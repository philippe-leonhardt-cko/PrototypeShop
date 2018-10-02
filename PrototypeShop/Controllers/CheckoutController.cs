using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Checkout;
using Checkout.ApiServices.SharedModels;
using Checkout.ApiServices.Tokens.RequestModels;
using Checkout.ApiServices.Tokens.ResponseModels;
using Checkout.ApiServices.Charges.RequestModels;
using Checkout.ApiServices.Charges.ResponseModels;

namespace PrototypeShop.Checkout
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
        public async Task<string> GetPaymentToken([FromBody] Cart cart)
        {
            Console.WriteLine(cart.Value);
            Console.WriteLine(cart.Currency);
            PaymentTokenCreate paymentTokenCreate = new PaymentTokenCreate()
            {
                Value = cart.Value.ToString(),
                Currency = cart.Currency,
                TrackId = Guid.NewGuid().ToString(),
                SuccessUrl = "https://www.checkout.com/checkout?order=success",
                FailUrl = "https://www.checkout.com/checkout?order=fail"
            };
            HttpResponse<PaymentToken> paymentTokenResponse = await CheckoutClient.TokenServiceAsync.CreatePaymentTokenAsync(paymentTokenCreate);
            PaymentToken paymentToken = paymentTokenResponse.Model;
            return paymentToken.Id;
        }

        [HttpPost("[action]")]
        public async Task<Charge> ChargeWithCardToken([FromBody] Order order)
        {
            CardTokenCharge cardTokenCharge = new CardTokenCharge()
            {
                CardToken = order.CardToken,
                Email = order.Customer.Email,
                Currency = order.Cart.Currency,
                Value = order.Cart.Value.ToString(),
                BillingDetails = order.Customer.BillingDetails as Address,
                ShippingDetails = order.Customer.ShippingDetails as Address,
                AutoCapture = "Y"
            };
            HttpResponse<Charge> cardTokenChargeResponse = await CheckoutClient.ChargeServiceAsync.ChargeWithCardTokenAsync(cardTokenCharge);
            Charge charge = cardTokenChargeResponse.Model;
            return charge;
        }
    }

    public interface IAddress
    {
        string AddressLine1 { get; set; }
        string AddressLine2 { get; set; }
        string Postcode { get; set; }
        string City { get; set; }
        string State { get; set; }
        string Country { get; set; }
    }

    public class Address : IAddress
    {
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string Postcode { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }

        public static implicit operator global::Checkout.ApiServices.SharedModels.Address(Address v)
        {
            throw new NotImplementedException();
        }
    }

    public interface ICart
    {
        int Value { get; set; }
        string Currency { get; set; }
    }

    public class Cart : ICart
    {
        public int Value { get; set; }
        public string Currency { get; set; }
    }

    public interface ICustomer
    {
        IAddress BillingDetails { get; set; }
        IAddress ShippingDetails { get; set; }
        string Email { get; set; }
    }

    public class Customer : ICustomer
    {
        public IAddress BillingDetails { get; set; }
        public IAddress ShippingDetails { get; set; }
        public string Email { get; set; }
    }

    public interface IOrder
    {
        ICart Cart { get; set; }
        ICustomer Customer { get; set; }
        string CardToken { get; set; }
    }

    public class Order : IOrder
    {
        public ICart Cart { get; set; }
        public ICustomer Customer { get; set; }
        public string CardToken { get; set; }
    }
}
