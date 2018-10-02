using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PrototypeShop.Controllers
{
    [Route("api/[controller]")]
    public class ShopController : Controller
    {
        private static ICustomer Philippe = new Customer()
        {
            Id = "Test123",
            Email = "philippe.leonhardt@checkout.com",
            FirstName = "Philippe",
            LastName = "Leonhardt",
            Addresses = new List<IAddress>
            {
                new Address()
                {
                    IsPrimaryBillingAddress = true,
                    IsPrimaryShippingAddress = false,
                    IsTemplateAddress = true,
                    FirstName = "Philippe",
                    LastName = "Leonhardt",
                    CompanyName = "Checkout GmbH",
                    StreetName = "Rudi-Dutschke-Straﬂe",
                    HouseNumber = "26",
                    AdditionalAddressLine = null,
                    Postcode = "10969",
                    City = "Berlin",
                    Municipality = "Berlin",
                    Country = "Germany"
                },
                new Address()
                {
                    IsPrimaryBillingAddress = false,
                    IsPrimaryShippingAddress = true,
                    IsTemplateAddress = true,
                    FirstName = "Harry",
                    LastName = "Potter",
                    CompanyName = null,
                    StreetName = "Privet Drive",
                    HouseNumber = "4",
                    AdditionalAddressLine = "The cupboard under the stairs",
                    Postcode = "RG12 9FG",
                    City = "Little Whinging",
                    Municipality = "Surrey",
                    Country = "United Kingdom"
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
    }

    public class AuthenticationRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class AuthenticationResponse
    {
        public bool Authorized { get; set; }
        public ICustomer Customer { get; set; }
    }

    public class Customer : ICustomer
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public List<IAddress> Addresses { get; set; }
    }

    public class Address : IAddress
    {
        public bool IsPrimaryBillingAddress { get; set; }
        public bool IsPrimaryShippingAddress { get; set; }
        public bool IsTemplateAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CompanyName { get; set; }
        public string StreetName { get; set; }
        public string HouseNumber { get; set; }
        public string AdditionalAddressLine { get; set; }
        public string Postcode { get; set; }
        public string City { get; set; }
        public string Municipality { get; set; } 
        public string Country { get; set; }
    }

    public interface ICustomer
    {
        string Id { get; set; }
        string Email { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        List<IAddress> Addresses { get; set; }
    }

    public interface IAddress
    {
        bool IsPrimaryBillingAddress { get; set; }
        bool IsPrimaryShippingAddress { get; set; }
        bool IsTemplateAddress { get; set; }
        string FirstName { get; set; }
        string LastName { get; set; }
        string CompanyName { get; set; }
        string StreetName { get; set; }
        string HouseNumber { get; set; }
        string AdditionalAddressLine { get; set; }
        string Postcode { get; set; }
        string City { get; set; }
        string Municipality { get; set; }
        string Country { get; set; }
    }
}
