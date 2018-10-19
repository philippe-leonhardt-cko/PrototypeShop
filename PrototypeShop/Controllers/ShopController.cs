using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Checkout.Common;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace PrototypeShop.Controllers
{
    [Route("api/[controller]")]
    public class ShopController : Controller
    {
        private static Customer Philippe = new Customer()
        {
            Id = "Test123",
            Email = "philippe.leonhardt@checkout.com",
            FirstName = "Philippe",
            LastName = "Leonhardt",
            Addresses = new List<ShopAddress>
            {
                new ShopAddress()
                {
                    IsPrimaryBillingAddress = true,
                    IsPrimaryShippingAddress = false,
                    IsTemplateAddress = true,
                    AddressLine1 = "Philippe Leonhardt",
                    AddressLine2 = "Rudi-Dutschke-Straﬂe 26",
                    Zip = "10969",
                    City = "Berlin",
                    State = "Berlin",
                    Country = "Germany"
                },
                new ShopAddress()
                {
                    IsPrimaryBillingAddress = false,
                    IsPrimaryShippingAddress = true,
                    IsTemplateAddress = true,
                    AddressLine1 = "Harry Potter",
                    AddressLine2 = "Privet Drive 4",
                    Zip = "RG12 9FG",
                    City = "Little Whinging",
                    State = "Surrey",
                    Country = "United Kingdom"
                },
                new ShopAddress()
                {
                    IsPrimaryBillingAddress = false,
                    IsPrimaryShippingAddress = false,
                    IsTemplateAddress = true,
                    AddressLine1 = "Bruce Wayne",
                    AddressLine2 = "Wayne Plaza 1",
                    Zip = "60007",
                    City = "Gotham City",
                    State = "Illinois",
                    Country = "USA"
                }
            }
        };

        [HttpPost("[action]")]
        public async Task<AuthenticationResponse> Login([FromBody] AuthenticationRequest credentials)
        {
            AuthenticationResponse authenticationResponse = new AuthenticationResponse();
            bool match = credentials.Email == Philippe.Email;
            authenticationResponse.Authorized = match;
            if (match)
            {
                authenticationResponse.Customer = Philippe;
            }
            authenticationResponse.Authorized = true; //DEBUG
            authenticationResponse.Customer = Philippe; //DEBUG
            return authenticationResponse;
        }

        [HttpGet("[action]/{name}")]
        public async Task<string> CountryAlpha2Code(string name)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage res = await client.GetAsync($"https://restcountries.eu/rest/v2/name/{name}"))
            using (HttpContent content = res.Content)
            {
                string data = await content.ReadAsStringAsync();
                List<Country> countries = JsonConvert.DeserializeObject<List<Country>>(data);
                return countries[0].Alpha2Code;
            }
        }

        [HttpGet("[action]/{code}")]
        public async Task<string> CountryName(string code)
        {
            using (HttpClient client = new HttpClient())
            using (HttpResponseMessage res = await client.GetAsync($"https://restcountries.eu/rest/v2/alpha/{code}"))
            using (HttpContent content = res.Content)
            {
                string data = await content.ReadAsStringAsync();
                Country country = JsonConvert.DeserializeObject<Country>(data);
                return country.Name;
            }
        }
    }

    public class AuthenticationRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class AuthenticationResponse
    {
        public bool Authorized { get; set; }
        public Customer Customer { get; set; }
    }

    public class Customer
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<ShopAddress> Addresses { get; set; }
    }

    public class ShopAddress : Address
    {
        public bool IsPrimaryBillingAddress { get; set; }
        public bool IsPrimaryShippingAddress { get; set; }
        public bool IsTemplateAddress { get; set; }
    }

    public class Country
    {
        public string Name { get; set; }
        public string Alpha2Code { get; set; }
    }
}
