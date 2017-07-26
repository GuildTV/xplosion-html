using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using xplosion.State;

namespace xplosion
{
    public class Program
    {
        public static void Main(string[] args)
        {
            LoadState();

            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseUrls("http://*:5000")
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseStartup<Startup>()
                .Build();

        private static void LoadState()
        {
            if (!File.Exists("./state.json"))
                return;

            string stateStr = File.ReadAllText("./state.json");
            GraphicsState.Instance = JsonConvert.DeserializeObject<GraphicsState>(stateStr);
        }
    }
}
