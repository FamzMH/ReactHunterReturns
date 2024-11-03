using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactHunter.Utils
{
    internal static class MHWProcessUtils
    {

        private const String ProcessName = "MonsterHunterWorld";

        internal static bool IsMHWOpen()
        {
            return Process.GetProcessesByName(ProcessName).Length > 0;
        }

        internal static bool MHWAliveFor10Seconds()
        {
            Process game = Process.GetProcessesByName(ProcessName)[0];
            TimeSpan runtime = DateTime.Now - game.StartTime;
            return runtime > TimeSpan.FromSeconds(10.0);
        }

    }
}
