using Microsoft.EntityFrameworkCore;
using BookstoreAPI.Models;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Allow Vite dev server (replace if Vite runs on a different port)
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

// Enable CORS globally for the frontend (Vite development server)
app.UseCors("AllowFrontend");  // Apply the "AllowFrontend" policy to all requests

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
