using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Checkout;
using Checkout.Common;
using Checkout.Payments;
using Checkout.Tokens;
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace PrototypeShop.Checkout
{
    [Route("api/[controller]")]
    public class CheckoutController : Controller
    {
        static CheckoutApi api = CheckoutApi.Create(
            secretKey: Environment.GetEnvironmentVariable("CKO_SECRET_KEY"),
            publicKey: Environment.GetEnvironmentVariable("CKO_PUBLIC_KEY"),
            useSandbox: true
            );

        static async Task<string> GetCountryAlpha2Code(string countryName)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage res = await client.GetAsync($"https://restcountries.eu/rest/v2/name/{countryName}"))
            using (HttpContent content = res.Content)
            {
                string data = await content.ReadAsStringAsync();
                List<Country> countries = JsonConvert.DeserializeObject<List<Country>>(data);
                return countries[0].Alpha2Code;
            }
        }

        [HttpGet("[action]/{id}")]
        public async Task<GetPaymentResponse> GetPaymentDetails(string id)
        {
            GetPaymentResponse getPaymentResponse = await api.Payments.GetAsync(id);
            return getPaymentResponse;
        }

        [HttpPost("[action]")]
        public async Task<string> CardTokenRequest([FromBody] Order order)
        {
            CardTokenRequest cardTokenRequest = new CardTokenRequest
            (
                number: "4242424242424242",
                expiryMonth: 6,
                expiryYear: 2022
            ){
                Name = order.Customer.Name,
                BillingAddress = order.Cart.BillingDetails
            };
            cardTokenRequest.BillingAddress.Country = await GetCountryAlpha2Code(cardTokenRequest.BillingAddress.Country);
            CardTokenResponse cardTokenResponse = await api.Tokens.RequestAsync(cardTokenRequest);
            return cardTokenResponse.Token;
        }

        [HttpPost("[action]")]
        public async Task<(string reference, string paymentId)> ChargeWithCardToken([FromBody] Order order)
        {

            PaymentRequest<TokenSource> paymentRequest = new PaymentRequest<TokenSource>
            (
                source: new TokenSource(order.CardToken),
                currency: order.Cart.Currency,
                amount: order.Cart.Value
            )
            {
                Reference = Guid.NewGuid().ToString(),
                Customer = new Customer()
                {
                Name = order.Customer.Name,
                Email = order.Customer.Email
                },
                Shipping = order.Cart.ShippingDetails            
            };
            paymentRequest.Shipping.Address.Country = await GetCountryAlpha2Code(paymentRequest.Shipping.Address.Country);
            PaymentResponse paymentResponse = await api.Payments.RequestAsync(paymentRequest);
            return (reference: paymentRequest.Reference, paymentId: paymentResponse.Payment.Id);
        }
    }

    public class Cart
    {
        public int Value { get; set; }
        public string Currency { get; set; }
        public Address BillingDetails { get; set; }
        public ShippingDetails ShippingDetails { get; set; }
    }

    public class Order
    {
        public Cart Cart { get; set; }
        public Customer Customer { get; set; }
        public string CardToken { get; set; }
    }

    public class Country
    {
        public string Name { get; set; }
        public string Alpha2Code { get; set; }
    }
}
