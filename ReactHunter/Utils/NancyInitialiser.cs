using Nancy.Hosting.Self;
using SmartHunter.Core;
using System;

namespace ReactHunter.Utils
{
    internal static class NancyInitialiser
    {

        internal static void InitialiseNancy()
        {
            HostConfiguration config = new HostConfiguration();
            config.RewriteLocalhost = true;
            var host = new NancyHost(config, new Uri(Config.Get().ApiHost));
            host.Start();
            Log.WriteLine("Api Start On " + Config.Get().ApiHost);
        }

    }
}
