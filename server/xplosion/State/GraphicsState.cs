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
        }

        public uint Quarter { get; set; }

        public uint ScoreL { get; set; }
        public uint ScoreR { get; set; }

        public Timeouts TimeoutsL { get; set; }
        public Timeouts TimeoutsR { get; set; }

        public Possession Possession { get; set; }

        public bool Flag { get; set; }

        public uint Downs { get; set; }
        public string Gains { get; set; }
    }
}