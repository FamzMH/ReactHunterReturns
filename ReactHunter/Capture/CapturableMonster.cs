using SmartHunter.Game.Data;
using System.Collections.ObjectModel;

namespace ReactHunter.Capture
{
    public class CapturableMonster : Monster
    {

        public CapturableMonster(Monster monster, bool canBeCaptured, int capturePercent) : base(monster.Address, monster.Id, monster.Health.Max, monster.Health.Current, monster.SizeScale, monster.ScaleModifier)
        {
            CanBeCaptured = canBeCaptured;
            CapturePercent = capturePercent;

            Parts = monster.Parts;
            PartSoftens = monster.PartSoftens;
            StatusEffects = monster.StatusEffects;
        }

        public readonly bool CanBeCaptured;

        public readonly int CapturePercent;

        public readonly new ObservableCollection<MonsterPart> Parts;

        public readonly new ObservableCollection<MonsterPartSoften> PartSoftens;

        public readonly new ObservableCollection<MonsterStatusEffect> StatusEffects; 
    }
}
