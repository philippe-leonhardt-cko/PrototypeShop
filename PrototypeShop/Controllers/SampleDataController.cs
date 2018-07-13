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
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private static IEnumerable<Product> Products = new List<Product>
        {
            new Product()
            {
                Id = "100.200.300",
                Name = "Shoes",
                Price = 14900
            },
            new Product()
            {
                Id = "010.500.200",
                Name = "Wool Coat",
                Price = 34999
            },
            new Product()
            {
                Id = "500.000.100",
                Name = "White Shirt",
                Price = 2466
            }
        };

        [HttpGet("[action]")]
        public IEnumerable<WeatherForecast> WeatherForecasts()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                DateFormatted = DateTime.Now.AddDays(index).ToString("d"),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            });
        }

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
