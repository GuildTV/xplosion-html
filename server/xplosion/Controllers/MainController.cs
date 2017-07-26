using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json;
using xplosion.State;

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
            Quarter,

            ScoreL, ScoreR,

            TimeoutsL, TimeoutsR,

            Possession,

            Downs, Gains,

            Flag,
        }

        public UpdateKey Key { get; set; }

        public string Value { get; set; }
    }

    [Route("api/[controller]")]
    [EnableCors("AllowAllOrigins")]

    public class MainController : Controller
    {
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
            // Console.WriteLine(value);
            try
            {
                // StateUpdate update = JsonConvert.DeserializeObject<StateUpdate>(value);
                if (update != null && update.Updates != null)
                    Console.WriteLine("Got {0} updates", update.Updates.Count);
                HandleState(update);
            }
            catch (Exception e)
            {
                // TODO
            }

            return Get();
        }

        private void HandleState(StateUpdate update)
        {
            lock (GraphicsState.Instance)
            {
                GraphicsState state = GraphicsState.Instance;

                foreach (StateUpdateEntry entry in update.Updates)
                {
                    Console.WriteLine("Got {0}", entry.Key);
                    switch (entry.Key)
                    {
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
                            HandleBool(entry, v => state.Flag = v);
                            break;

                        case StateUpdateEntry.UpdateKey.Downs:
                            HandleUint(entry, v => state.Downs = v);
                            break;
                        case StateUpdateEntry.UpdateKey.Gains:
                            state.Gains = entry.Value;
                            break;

                        default:
                            Console.WriteLine("Unhandled update key {0}", entry.Key);
                            break;
                    }
                }
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
