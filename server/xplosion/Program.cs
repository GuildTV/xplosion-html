using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
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
