using GestionDeClientes.API.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using GestionDeClientes.API.Data;

namespace GestorClientes.API.Validators
{
    public class ClienteValidator : AbstractValidator<Cliente>
    {
        private readonly AppDBContext _db;

        public ClienteValidator(AppDBContext db)
        {
            _db = db;
            RuleFor(c => c.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");
            RuleFor(c => c.Email)
                .NotEmpty().WithMessage("El email es obligatorio.")
                .EmailAddress().WithMessage("El email no es válido.")
                .MustAsync(async (model, email, cancellation) =>
                {
                    // Verificamos si existe OTRO cliente con el mismo email pero diferente Id
                    bool existe = await _db.Clientes.AnyAsync(c =>
                        c.Email == email && c.Id != model.Id,
                        cancellation);

                    return !existe;
                })
                .WithMessage("El email ya está registrado.");
        }
    }
}
