using System.Collections.Generic;
using System.Timers;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Newtonsoft.Json;

namespace xplosion.State
{
    public enum Timeouts
    {
        Zero,
        One,
        Two,
        Three,
    }

    public enum Possession
    {
        None,
        Left,
        Right,
    }

    public class GraphicsState
    {
        [JsonIgnore]
        private static GraphicsState _instance;

        public static GraphicsState Instance
        {
            get => _instance ?? (_instance = new GraphicsState());
            set => _instance = value;
        }

        [JsonProperty("in")]
        public bool In { get; set; }

        [JsonProperty("quarter")]
        public uint Quarter { get; set; }

        [JsonProperty("scoreL")]
        public uint ScoreL { get; set; }
        [JsonProperty("scoreR")]
        public uint ScoreR { get; set; }

        [JsonProperty("timeoutsL")]
        public Timeouts TimeoutsL { get; set; }
        [JsonProperty("timeoutsR")]
        public Timeouts TimeoutsR { get; set; }

        [JsonProperty("possession")]
        public Possession Possession { get; set; }

        [JsonProperty("downs")]
        public uint Downs { get; set; }
        [JsonProperty("gains")]
        public string Gains { get; set; } = "";

        [JsonProperty("nameL")]
        public string NameL { get; set; } = "Team L";
        [JsonProperty("nameR")]
        public string NameR { get; set; } = "Team R";

        [JsonProperty("setsL")]
        public uint SetsL { get; set; }
        [JsonProperty("setsR")]
        public uint SetsR { get; set; }
        
        [JsonProperty("clockRemaining")]
        public uint ClockRemaining { get; set; }
        [JsonProperty("clockPlaying")]
        public bool ClockPlaying { get; set; }
        [JsonProperty("clockVisible")]
        public bool ClockVisible { get; set; }
        
    }

    public class GraphicsStateWithTriggers : GraphicsState
    {
        public GraphicsStateWithTriggers(GraphicsState state, Dictionary<string, string> triggers)
        {
            In = state.In;
            Quarter = state.Quarter;
            ScoreL = state.ScoreL;
            ScoreR = state.ScoreR;
            TimeoutsL = state.TimeoutsL;
            TimeoutsR = state.TimeoutsR;
            Possession = state.Possession;
            Downs = state.Downs;
            Gains = state.Gains;

            NameL = state.NameL;
            NameR = state.NameR;
            SetsL = state.SetsL;
            SetsR = state.SetsR;

            ClockRemaining = state.ClockRemaining;
            ClockPlaying = state.ClockPlaying;
            ClockVisible = state.ClockVisible;

            Triggers = triggers;
        }

        [JsonProperty("triggers")]
        public Dictionary<string, string> Triggers { get; set; }
    }
}