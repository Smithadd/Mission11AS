using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Models;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()      // Allow all origins (you can customize this if needed)
              .AllowAnyMethod()     // Allow any HTTP method (GET, POST, etc.)
              .AllowAnyHeader();    // Allow any header
    });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add the DbContext with SQLite configuration
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

var app = builder.Build();

// Enable CORS globally
app.UseCors("AllowAllOrigins");  // This ensures CORS policy is applied to all requests

// Enable HTTPS Redirection
app.UseHttpsRedirection();

// Enable Authorization middleware
app.UseAuthorization();

// Set up the Swagger UI (for API documentation)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Map the controllers
app.MapControllers();

// Run the application, ensuring it listens on both HTTP and HTTPS
app.Run();
