using System.Windows;

namespace ReactHunter.Dummy
{
    internal class DummyApplication
    {

        private Application Dummy = Application.Current;

        internal Form1 MainForm { get; set; }

        internal DummyApplication(Form1 mainForm)
        {
            this.MainForm = mainForm;
        }

        private void OnDummyExit(object sender, ExitEventArgs e)
        {
            Dummy.Shutdown();
            MainForm.Close();
        }

        internal void Initialise()
        {
            if (Dummy == null)
            {
                Dummy = new Application { ShutdownMode = ShutdownMode.OnExplicitShutdown };
            }

            Dummy.Exit += OnDummyExit;
        }

        internal void Shutdown() 
        { 
            if (Dummy != null) Dummy.Shutdown(); 
        }

    }
}
