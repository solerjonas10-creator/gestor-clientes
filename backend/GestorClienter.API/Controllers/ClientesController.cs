using GestionDeClientes.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionDeClientes.API.Models.DTOs;
using GestionDeClientes.API.Models;
using FluentValidation;

namespace GestorClientes.API.Controllers
{
    [ApiController]
    [Route("clientes-api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly AppDBContext _db;
        private readonly IValidator<Cliente> _validator;
        public ClientesController(AppDBContext db, IValidator<Cliente> validator)
        {
            _db = db;
            _validator = validator;
        }

        [HttpGet("listar")]
        public async Task<IActionResult> GetClientes()
        {
            var clientes = await _db.Clientes.ToListAsync();
            return Ok(clientes);
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> GetClientesByText([FromQuery] string busqueda)
        {
            busqueda = busqueda.ToLower();

            var clientes = await _db.Clientes
                .Where(c => c.Nombre.ToLower().Contains(busqueda) || c.Email.ToLower().Contains(busqueda))
                .ToListAsync();

            return Ok(clientes);
        }

        [HttpPost("crear")]
        public async Task<IActionResult> CreateCliente([FromBody] ClienteDTO cliente)
        {
            var nuevoCliente = new Cliente
            {
                Nombre = cliente.Nombre,
                Email = cliente.Email,
                FechaRegistro = DateTime.UtcNow
            };

            var validationResult = await _validator.ValidateAsync(nuevoCliente);

            if (validationResult.IsValid)
            {
                _db.Clientes.Add(nuevoCliente);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetClientes), new { id = nuevoCliente.Id }, nuevoCliente);
            }

            return BadRequest(
                validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
            );
        }

        [HttpPut("{id:int}/editar")]
        public async Task<IActionResult> EditCliente(int id, [FromBody] ClienteDTO cliente)
        {
            // validar Id recibido
            var clienteExistente = await _db.Clientes.FindAsync(id);
            if (clienteExistente == null)
                return NotFound(new { Message = "Cliente no encontrado." });

            clienteExistente.Nombre = cliente.Nombre;
            clienteExistente.Email = cliente.Email;


            var validationResult = await _validator.ValidateAsync(clienteExistente);
            if (validationResult.IsValid)
            {
                await _db.SaveChangesAsync();

                return Ok(new { Message = "Cliente actualizado exitosamente."});
            }

            return BadRequest(
                validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
            );
        }

        [HttpDelete("{id:int}/eliminar")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            // validar Id recibido
            var clienteExistente = await _db.Clientes.FindAsync(id);
            if (clienteExistente == null)
                return NotFound(new { Message = "Cliente no encontrado." });


            _db.Clientes.Remove(clienteExistente);
            await _db.SaveChangesAsync();

            return Ok(new { Message = "Cliente eliminado exitosamente." });
        }
    }
}
