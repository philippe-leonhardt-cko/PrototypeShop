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
                VAT = 19,
                Price = 24999,
                Description = "See down to the smallest detail.",
                Tags = new List<string>{ "#Excell" }
            },
            new Product()
            {
                Id = "200.090.070",
                Name = "Pocket Knife",
                VAT = 7,
                Price = 3595,
                Description = "Be prepared for any kind of task.",
                Tags = new List<string>{ "#Aspire" }
            },
            new Product()
            {
                Id = "300.250.011",
                Name = "Wooden Puzzle",
                VAT = 7,
                Price = 1466,
                Description = "Every piece matters.",
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
            public int VAT { get; set; }
            public int Price { get; set; }
            public string Description { get; set; }
            public List<string> Tags { get; set; }
        }
    }
}
