using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace PrototypeShop.Controllers
{
    [Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static IEnumerable<Product> Products = new List<Product>
        {
            new Product()
            {
                Id = "100.100.023",
                Name = "Microscope",
                Price = 24999
            },
            new Product()
            {
                Id = "200.090.070",
                Name = "Swiss Knife",
                Price = 3595
            },
            new Product()
            {
                Id = "300.250.011",
                Name = "Wooden Puzzle",
                Price = 1466
            }
        };

        [HttpGet("[action]/{id}")]
        public Product GetProduct(string id)
        {
            return Products.Where(product => product.Id == id).Single();
        }

        public class Product
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public int Price { get; set; }
        }
    }
}
