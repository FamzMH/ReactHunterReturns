using ReactHunter.Utils;
using ReactHunter.Dummy;
using SmartHunter.Core;
using SmartHunter.Game;
using System;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ReactHunter
{
    public partial class Form1 : Form
    {

        private DummyWPFApplication DummyApplication;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            Console.SetOut(new TextBoxWriter(this.textBox1));

            DummyApplication = new DummyWPFApplication(this);
        }

        private async void Form1_Shown(object sender, EventArgs e)
        {
            if (!MHWProcessUtils.IsMHWOpen()) Log.WriteLine("Please start MHW");
            
            while (!MHWProcessUtils.IsMHWOpen()) await Task.Delay(1 * 1000);

            if (!MHWProcessUtils.MHWAliveFor10Seconds())
            {
                Log.WriteLine("MHW was just started");
                Log.WriteLine("Waiting for 10 seconds to give the game time to load");
                await Task.Delay(10 * 1000);
            }

            var m_MemoryUpdater = new MhwMemoryUpdater();

            DummyApplication.InitialiseDummy();

            NancyInitialiser.InitialiseNancy();
        }

        private void Form1_Closing(object sender, FormClosingEventArgs e)
        {
            DummyApplication.ShutdownDummy();
        }

    }
}
