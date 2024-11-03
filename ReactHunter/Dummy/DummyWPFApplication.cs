using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace ReactHunter.Dummy
{
    internal class DummyWPFApplication
    {

        private Application DummyApplication = Application.Current;

        internal Form1 MainForm { get; set; }

        internal DummyWPFApplication(Form1 mainForm)
        {
            this.MainForm = mainForm;
        }

        private void OnDummyExit(object sender, ExitEventArgs e)
        {
            DummyApplication.Shutdown();
            MainForm.Close();
        }

        internal void InitialiseDummy()
        {
            if (DummyApplication == null)
            {
                DummyApplication = new Application { ShutdownMode = ShutdownMode.OnExplicitShutdown };
            }

            DummyApplication.Exit += OnDummyExit;
        }

        internal void ShutdownDummy() 
        { 
            if (DummyApplication != null) DummyApplication.Shutdown(); 
        }

    }
}
