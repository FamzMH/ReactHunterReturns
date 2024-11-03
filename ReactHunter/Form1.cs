using Nancy.Hosting.Self;
using SmartHunter.Core;
using SmartHunter.Game;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ReactHunter
{
    public partial class Form1 : Form
    {

        private const String ProcessName = "MonsterHunterWorld";

        public Form1()
        {
            InitializeComponent();
        }

        private static bool IsMHWOpen()
        {
            return Process.GetProcessesByName(ProcessName).Length > 0;
        }

        private static bool MHWAliveFor10Seconds()
        {
            Process game = Process.GetProcessesByName(ProcessName)[0];
            TimeSpan runtime = DateTime.Now - game.StartTime;
            return runtime > TimeSpan.FromSeconds(10.0);
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Console.SetOut(new TextBoxWriter(this.textBox1));
        }

        private async void Form1_Shown(object sender, EventArgs e)
        {
            if (!IsMHWOpen()) Log.WriteLine("Please start MHW");
            
            while (!IsMHWOpen()) await Task.Delay(1 * 1000);

            if (!MHWAliveFor10Seconds())
            {
                Log.WriteLine("MHW was just started");
                Log.WriteLine("Waiting for 10 seconds to give the game time to load");
                await Task.Delay(10 * 1000);
            }

            //Start MonsterHunterMemoryUpdater
            var m_MemoryUpdater = new MhwMemoryUpdater();

            //Start WebApi
            HostConfiguration config = new HostConfiguration();
            config.RewriteLocalhost = true;
            var host = new NancyHost(config, new Uri(Config.Get().ApiHost));
            host.Start();
            Log.WriteLine("Api Start On " + Config.Get().ApiHost);
        }
    }
}
