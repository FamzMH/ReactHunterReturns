using ReactHunter.Capture;
using SmartHunter.Game.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactHunter.Capture
{
    public class CapturableMonstersFactory
    {

        private readonly List<CaptureDataItem> CaptureData = LoadCaptureData();

        private static List<CaptureDataItem> LoadCaptureData()
        {
            var rawCaptureData = File.ReadAllText("Capture\\CaptureData.json");
            List<CaptureDataItem> captureData = Newtonsoft.Json.JsonConvert.DeserializeObject<List<CaptureDataItem>>(rawCaptureData);
            return captureData;
        }

        public CapturableMonster[] GetCapturableMonsters(Monster[] monsters)
        {
            CapturableMonster[] capturableMonsters = new CapturableMonster[monsters.Length];

            for (int i = 0; i < monsters.Length; i++)
            {
                Monster monster = monsters[i];
                capturableMonsters[i] = GetCapturableMonster(monster);
            }

            return capturableMonsters;
        }

        private CapturableMonster GetCapturableMonster(Monster monster)
        {
            int capturePercent = GetCapturePercent(monster.Name);
            bool canBeCaptured = capturePercent != 0;
            return new CapturableMonster(monster, canBeCaptured, capturePercent);
        }

        private int GetCapturePercent(String monsterName)
        {
            return CaptureData.Find(x => x.USName == monsterName).Capture;
        }

    }
}
