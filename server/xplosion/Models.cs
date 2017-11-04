using System;
using Microsoft.EntityFrameworkCore;

namespace xplosion
{
    public class LoggingContext : DbContext
    {
        public DbSet<GraphicsEntry> Entries { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=graphics.db");
        }
    }

    public class GraphicsEntry
    {
        public int Id { get; set; }

        public string Change { get; set; }
        public DateTime Time { get; set; }
    }
}
