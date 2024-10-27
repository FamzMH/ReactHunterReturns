using Nancy;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ReactHunter.Capture;
using SmartHunter.Game.Data.ViewModels;
using System;
using System.Linq;

namespace ReactHunter.Controller
{
    public class MHWController : NancyModule
    {

        public MHWController(CapturableMonstersFactory capturableMonstersFactory)
        {


            Get("/", x => {
                    return View["Web/index.html"];
                });
            Get("/get", x => {
                var teams = OverlayViewModel.Instance.TeamWidget.Context.Players.ToArray();
                var monsters = OverlayViewModel.Instance.MonsterWidget.Context.Monsters.ToArray();
                var player = OverlayViewModel.Instance.PlayerWidget.Context.StatusEffects.ToArray();

                var capturableMonsters = capturableMonstersFactory.GetCapturableMonsters(monsters).ToArray();

                var jsonSettings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver()
                };

                var response = JsonConvert.SerializeObject(new
                {
                    isSuccess = true,
                    date = DateTime.Now.ToString(),
                    data = new
                    {
                        players = teams,
                        monsters = capturableMonsters,
                        player
                    }
                }, jsonSettings);
                    

                return Response.AsJson(response);
            });
        }

    }
}
