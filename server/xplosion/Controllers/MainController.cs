using System;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json;
using xplosion.State;
using System.Timers;

namespace xplosion.Controllers
{
    public class StateUpdate
    {
        public List<StateUpdateEntry> Updates { get; set; }
    }

    public class StateUpdateEntry
    {
        public enum UpdateKey
        {
            In, 

            Quarter,

            ScoreL, ScoreR,

            TimeoutsL, TimeoutsR,

            Possession,

            Downs, Gains,

            Flag, Touchdown,

            NameL, NameR,
            
            SetsL, SetsR,
            
            ClockRemaining, ClockPlaying, ClockVisible,
        }

        public UpdateKey Key { get; set; }

        public string Value { get; set; }
    }

    [Route("api/[controller]")]
    [EnableCors("AllowAllOrigins")]

    public class MainController : Controller
    {
        //private static readonly LoggingContext Logger;

        [JsonIgnore]
        private static System.Timers.Timer _tickTimer;
        
        static MainController()
        {
            //Logger = new LoggingContext();
            
            _tickTimer = new System.Timers.Timer(1000);
            _tickTimer.Elapsed += (a, b) =>
            {
                lock (GraphicsState.Instance)
                {
                    if (GraphicsState.Instance.ClockPlaying && GraphicsState.Instance.ClockRemaining > 0)
                    {
                        GraphicsState.Instance.ClockRemaining -= 1;
                        
                        string stateStr = JsonConvert.SerializeObject(GraphicsState.Instance);
                        WebsocketMiddleware.SendToAllAsync(stateStr);
                    }
                }
            };
            _tickTimer.Start();
        }

        // GET api/main
        [HttpGet]
        [EnableCors("AllowAllOrigins")]
        public GraphicsState Get()
        {
            // return JsonConvert.SerializeObject(GraphicsState.Instance);
            return GraphicsState.Instance;
        }

        // POST api/main
        [HttpPost]
        public GraphicsState Post([FromBody]StateUpdate update)
        {
            if (update != null && update.Updates != null)
            {
                Console.WriteLine("Got {0} updates", update.Updates.Count);
                var tempState = HandleState(update);

                string stateStr = JsonConvert.SerializeObject(tempState);
                WebsocketMiddleware.SendToAllAsync(stateStr);

                System.IO.File.WriteAllText(@"./state.json", stateStr);
            }

            // Log to database
            /*
            Logger.Add(new GraphicsEntry
            {
                Change = JsonConvert.SerializeObject(update),
                Time = DateTime.Now,
            });
            Logger.SaveChanges();
            */

            return Get();
        }

        private static GraphicsStateWithTriggers HandleState(StateUpdate update)
        {
            lock (GraphicsState.Instance)
            {
                GraphicsState state = GraphicsState.Instance;
                var triggers = new Dictionary<string, string>();

                foreach (StateUpdateEntry entry in update.Updates)
                {
                    Console.WriteLine("Got {0}", entry.Key);
                    switch (entry.Key)
                    {
                        case StateUpdateEntry.UpdateKey.In:
                            HandleBool(entry, v => state.In = v);
                            break;

                        case StateUpdateEntry.UpdateKey.Quarter:
                            HandleUint(entry, v => state.Quarter = v, 4);
                            break;

                        case StateUpdateEntry.UpdateKey.ScoreL:
                            HandleUint(entry, v => state.ScoreL = v);
                            break;
                        case StateUpdateEntry.UpdateKey.ScoreR:
                            HandleUint(entry, v => state.ScoreR = v);
                            break;

                        case StateUpdateEntry.UpdateKey.TimeoutsL:
                            HandleEnum<Timeouts>(entry, v => state.TimeoutsL = v);
                            break;
                        case StateUpdateEntry.UpdateKey.TimeoutsR:
                            HandleEnum<Timeouts>(entry, v => state.TimeoutsR = v);
                            break;

                        case StateUpdateEntry.UpdateKey.Possession:
                            HandleEnum<Possession>(entry, v => state.Possession = v);
                            break;

                        case StateUpdateEntry.UpdateKey.Flag:
                            triggers.Add("flag", "1");
                            break;

                        case StateUpdateEntry.UpdateKey.Downs:
                            HandleUint(entry, v => state.Downs = v);
                            break;
                        case StateUpdateEntry.UpdateKey.Gains:
                            state.Gains = entry.Value;
                            break;

                        case StateUpdateEntry.UpdateKey.Touchdown:
                            triggers.Add("touchdown", entry.Value);
                            break;

                        case StateUpdateEntry.UpdateKey.NameL:
                            state.NameL = entry.Value;
                            break;
                        case StateUpdateEntry.UpdateKey.NameR:
                            state.NameR = entry.Value;
                            break;
                            
                        case StateUpdateEntry.UpdateKey.SetsL:
                            HandleUint(entry, v => state.SetsL = v);
                            break;
                        case StateUpdateEntry.UpdateKey.SetsR:
                            HandleUint(entry, v => state.SetsR = v);
                            break;
                        
                        case StateUpdateEntry.UpdateKey.ClockRemaining:
                            HandleUint(entry, v => state.ClockRemaining = v);
                            break;
                        case StateUpdateEntry.UpdateKey.ClockPlaying:
                            HandleBool(entry, v => state.ClockPlaying = v);
                            break;
                        case StateUpdateEntry.UpdateKey.ClockVisible:
                            HandleBool(entry, v => state.ClockVisible = v);
                            break;

                        default:
                            Console.WriteLine("Unhandled update key {0}", entry.Key);
                            break;
                    }
                }

                return new GraphicsStateWithTriggers(state, triggers);
            }
        }

        private static void HandleUint(StateUpdateEntry entry, Action<uint> setter, uint max = 999999)
        {
            try
            {
                uint val = UInt32.Parse(entry.Value);
                if (val > max)
                    throw new ArgumentOutOfRangeException(entry.Key.ToString());

                setter(val);
            }
            catch (Exception e)
            {
                Console.WriteLine("Invalid {0} value: {1}", entry.Key, entry.Value);
                Console.WriteLine(e.StackTrace);
            }
        }

        private static void HandleEnum<T>(StateUpdateEntry entry, Action<T> setter) where T : struct, IComparable, IConvertible, IFormattable
        {
            try
            {
                T val = (T)(object)Int32.Parse(entry.Value);

                if (!Enum.IsDefined(typeof(T), val))
                    throw new ArgumentOutOfRangeException(entry.Key.ToString());

                setter(val);
            }
            catch (Exception e)
            {
                Console.WriteLine("Invalid {0} value: {1}", entry.Key, entry.Value);
                Console.WriteLine(e.StackTrace);
            }
        }

        private static void HandleBool(StateUpdateEntry entry, Action<bool> setter)
        {
            try
            {
                setter(bool.Parse(entry.Value));
            }
            catch (Exception e)
            {
                Console.WriteLine("Invalid {0} value: {1}", entry.Key, entry.Value);
                Console.WriteLine(e.StackTrace);
            }
        }
    }
}
