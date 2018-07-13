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
                Name = "Watch",
                Price = 24999
            },
            new Product()
            {
                Id = "200.090.070",
                Name = "Wool Coat (brown)",
                Price = 31995
            },
            new Product()
            {
                Id = "300.250.011",
                Name = "Shoes",
                Price = 17066
            }
        };

        [HttpGet("[action]/{id}")]
        public Product GetProduct(string id)
        {
            return Products.Where(product => product.Id == id).Single();
        }

        public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }

        public class Product
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public int Price { get; set; }
        }
    }
}
