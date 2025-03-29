using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BookstoreAPI.Models
{
    public partial class BookstoreContext : DbContext
    {
        private readonly IConfiguration _configuration;

        // Constructor with configuration injection
        public BookstoreContext(DbContextOptions<BookstoreContext> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public virtual DbSet<Book> Books { get; set; }

        // OnConfiguring to read from the configuration file
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // Use configuration to get the connection string
                optionsBuilder.UseSqlite(_configuration.GetConnectionString("DefaultConnection"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasIndex(e => e.BookId, "IX_Books_BookID").IsUnique();

                entity.Property(e => e.BookId).HasColumnName("BookID");
                entity.Property(e => e.Isbn).HasColumnName("ISBN");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
