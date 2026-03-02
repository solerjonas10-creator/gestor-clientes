using FluentValidation;
using GestionDeClientes.API.Data;
using GestionDeClientes.API.Models;
using GestorClientes.API.Validators;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SQLiteConnection")));

builder.Services.AddControllers();

// registrando el validador
builder.Services.AddScoped<IValidator<Cliente>, ClienteValidator>();

builder.Services.AddCors(options =>
    options.AddPolicy("PermitirNextJS", policy =>
    {
        // Permitir solicitudes desde el frontend de Next.js en localhost:3000
        policy.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
    })
);

var app = builder.Build();  

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Mapear controladores para que las rutas de los controllers estén disponibles
app.MapControllers();

// Aplicar migraciones al arrancar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDBContext>();
    db.Database.Migrate();
}

app.UseCors("PermitirNextJS");

app.Run();
