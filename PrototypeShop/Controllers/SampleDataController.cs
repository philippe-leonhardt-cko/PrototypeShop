using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace PrototypeShop.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static List<Product> Products = new List<Product>
        {
            new Product()
            {
                Id = "100.100.023",
                Name = "Microscope",
                Pricing = new Pricing()
                {
                    Gross = 24999,
                    TaxPercent = 19
                },
                Description = "See down to the smallest detail. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt purus sed ligula euismod ornare porta et ex. Suspendisse at tellus facilisis, porttitor turpis nec, iaculis tortor. Cras in facilisis mauris, sit amet ullamcorper massa.",
                Tags = new List<string>{ "#Excell" }
            },
            new Product()
            {
                Id = "200.090.070",
                Name = "Pocket Knife",
                Pricing = new Pricing()
                {
                    Gross = 3595,
                    TaxPercent = 19
                },
                Description = "Be prepared for any kind of task. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt purus sed ligula euismod ornare porta et ex. Suspendisse at tellus facilisis, porttitor turpis nec, iaculis tortor. Cras in facilisis mauris, sit amet ullamcorper massa.",
                Tags = new List<string>{ "#Aspire" }
            },
            new Product()
            {
                Id = "100.100.024",
                Name = "Microscope XL",
                Pricing = new Pricing()
                {
                    Gross = 34999,
                    TaxPercent = 19
                },
                Description = "See down to the molecular level. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt purus sed ligula euismod ornare porta et ex. Suspendisse at tellus facilisis, porttitor turpis nec, iaculis tortor. Cras in facilisis mauris, sit amet ullamcorper massa.",
                Tags = new List<string>{ "#Excell" }
            },
            new Product()
            {
                Id = "300.250.011",
                Name = "Wooden Puzzle",
                Pricing = new Pricing()
                {
                    Gross = 1466,
                    TaxPercent = 19
                },
                Description = "Every piece matters. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis tincidunt purus sed ligula euismod ornare porta et ex. Suspendisse at tellus facilisis, porttitor turpis nec, iaculis tortor. Cras in facilisis mauris, sit amet ullamcorper massa.",
                Tags = new List<string>{ "#Unite" }
            }
        };

        [HttpGet("[action]")]
        public List<Product> GetProducts()
        {
            return Products;
        }

        [HttpGet("[action]/{id}")]
        public Product GetProduct(string id)
        {
            return Products.Where(product => product.Id == id).Single();
        }

        public class Product
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public Pricing Pricing { get; set; }
            public string Description { get; set; }
            public List<string> Tags { get; set; }
        }

        public class Pricing
        {
            public int Gross { get; set; }
            public int TaxPercent { get; set; }
            public int Net
            {
                get
                {
                    return Gross / (100 + TaxPercent) * 100;
                }
            }
            public int TaxNominal
            {
                get
                {
                    return Gross - Net;
                }
            }
        }
    }
}
