"use client";

import { use, useEffect, useState } from "react";
import FormularioCliente from "./FormularioCliente";
import { SkeletonTable, SkeletonSearchBar, SkeletonHeader } from "./SkeletonLoader";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  fechaRegistro: string;
}

export default function Home() {
  // estado para lista de clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  // estados para búsqueda
  const [inputQuery, setInputQuery] = useState("");
  const [busqueda, setBusqueda] = useState("");
  // estados para loading
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // estados para formulario de creación/edición
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  // estados para confirmación de eliminación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // estado para mensajes de éxito/error
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setBusqueda(inputQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputQuery]);


  const cargarClientes = async () => {
    let fetchClientes = "";
    setIsLoading(true);
    try {
      // Si la búsqueda está vacía, se carga la lista completa de clientes, de lo contrario se realiza la búsqueda con el término ingresado
      if (busqueda.trim() === "") {
        fetchClientes = `${baseUrl}/clientes-api/Clientes/listar`;
      } else {
        setIsSearching(true);
        fetchClientes = `${baseUrl}/clientes-api/Clientes/buscar?busqueda=${encodeURIComponent(busqueda)}`;
      }

      const response = await fetch(fetchClientes);
      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando clientes", err);
      setClientes([]);
      setToast({ message: "Error al cargar los clientes", type: "error" });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {

    cargarClientes();
  }, [busqueda]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <SkeletonHeader />
        ) : (
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Lista de clientes</h1>

            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={() => {
                setEditingCliente(null);
                setIsCreateFormOpen(true);
              }}
            >
              Nuevo cliente
            </button>
          </div>
        )}

        {isLoading ? (
          <SkeletonSearchBar />
        ) : (
          <div className="p-4 bg-white border-b flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500"></div>
                Buscando...
              </div>
            )}
          </div>
        )}

        <FormularioCliente
          isOpen={isCreateFormOpen}
          initialData={editingCliente ?? undefined}
          onClose={() => {
            setIsCreateFormOpen(false);
            setEditingCliente(null);
          }}
          onSuccess={(message?: string, success?: boolean) => {
            // recarga inmediata y cierra modal
            cargarClientes();
            setIsCreateFormOpen(false);
            setEditingCliente(null);
            const msg = message ?? (editingCliente ? "Cliente actualizado correctamente" : "Cliente creado correctamente");
            setToast({ message: msg, type: success === false ? "error" : "success" });
          }}
        />

        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-700 border-b">ID</th>
              <th className="p-4 font-semibold text-gray-700 border-b">Nombre</th>
              <th className="p-4 font-semibold text-gray-700 border-b">Email</th>
              <th className="p-4 font-semibold text-gray-700 border-b">Fecha de registro</th>
              <th className="p-4 font-semibold text-gray-700 border-b text-center">Acciones</th>
            </tr>
          </thead>
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : (
            <tbody>
              {clientes.map((cliente: Cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 border-b text-gray-600">{cliente.id}</td>
                  <td className="p-4 border-b text-gray-600">{cliente.nombre}</td>
                  <td className="p-4 border-b text-gray-600">{cliente.email}</td>
                  <td className="p-4 border-b text-gray-600 text-center">
                    {new Date(cliente.fechaRegistro).toLocaleDateString()}
                  </td>
                  <td className="p-4 border-b text-center">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition mr-3" onClick={() => {
                        setEditingCliente(cliente);
                        setIsCreateFormOpen(true);
                      }}>
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition mr-3"
                      onClick={() => {
                        setClienteToDelete(cliente);
                        setConfirmOpen(true);
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

            {confirmOpen && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Confirmar eliminación</h3>
                  <p className="mb-6">¿Está seguro que desea eliminar al cliente <strong>{clienteToDelete?.nombre}</strong>?</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setConfirmOpen(false);
                        setClienteToDelete(null);
                      }}
                      className="mr-2 px-4 py-2 border rounded hover:bg-gray-100 transition"
                      disabled={isDeleting}
                    >
                      NO
                    </button>
                    <button
                      onClick={async () => {
                        if (!clienteToDelete) return;
                        setIsDeleting(true);
                        try {
                          const response = await fetch(
                            `${baseUrl}/clientes-api/Clientes/${clienteToDelete.id}/eliminar`,
                            { method: "DELETE" }
                          );
                          if (response.ok) {
                            // recargar lista y cerrar modal
                            await cargarClientes();
                            setToast({ message: "Cliente eliminado correctamente", type: "success" });
                          } else {
                            console.error("Error al eliminar cliente", response.status);
                            setToast({ message: "Error al eliminar cliente", type: "error" });
                          }
                        } catch (err) {
                          console.error("Error al eliminar cliente", err);
                          setToast({ message: "Error al eliminar cliente", type: "error" });
                        } finally {
                          setIsDeleting(false);
                          setConfirmOpen(false);
                          setClienteToDelete(null);
                        }
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Eliminando..." : "SI"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {toast && (
              <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
                <div className={`px-4 py-3 rounded shadow-md text-white font-medium ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
                  {toast.message}
                </div>
              </div>
            )}

        {!isLoading && clientes.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No se encontraron clientes.
          </div>
        )}

      </div>
    </main>
  );
}