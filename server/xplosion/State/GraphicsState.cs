using System.Collections.Generic;
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
            get
            {
                if (_instance != null)
                    return _instance;

                return _instance = new GraphicsState();
            }
            set
            {
                _instance = value;
            }
        }

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
    }

    public class GraphicsStateWithTriggers : GraphicsState
    {
        public GraphicsStateWithTriggers(GraphicsState state, Dictionary<string, string> triggers)
        {
            Quarter = state.Quarter;
            ScoreL = state.ScoreL;
            ScoreR = state.ScoreR;
            TimeoutsL = state.TimeoutsL;
            TimeoutsR = state.TimeoutsR;
            Possession = state.Possession;
            Downs = state.Downs;
            Gains = state.Gains;

            Triggers = triggers;
        }

        [JsonProperty("triggers")]
        public Dictionary<string, string> Triggers { get; set; }
    }
}