using System;
using System.Linq;
using System.Reflection;

namespace xplosion.Util
{
    public static class EnumExtensions
    {
        public static bool IsValid<T>(this T src) where T : IComparable, IConvertible, IFormattable
        {
            if (!typeof(T).GetTypeInfo().GetCustomAttributes<FlagsAttribute>().Any())
                return Enum.IsDefined(typeof(T), src);

            // Is a flags, handle seperately
            return Convert.ToInt32(src) < Enum.GetValues(typeof(T)).Cast<int>().Max() * 2;

        }
    }
}