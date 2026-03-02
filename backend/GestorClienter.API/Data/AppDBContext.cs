using Microsoft.EntityFrameworkCore;
using GestionDeClientes.API.Models;

namespace GestionDeClientes.API.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {
        }
        public DbSet<Cliente> Clientes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cliente>().HasIndex(c => c.Email).IsUnique();

            base.OnModelCreating(modelBuilder);
        }
    }
}
