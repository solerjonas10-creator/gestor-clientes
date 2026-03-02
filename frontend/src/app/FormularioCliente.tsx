"use client";

import { useState, useEffect } from "react";

interface FormularioClienteProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (message?: string, success?: boolean) => void;
    initialData?: { id?: number; nombre?: string; email?: string };
}

export default function FormularioCliente({ isOpen, onClose, onSuccess, initialData }: FormularioClienteProps) {
    const [errors, setErrors] = useState<{ nombre?: string; email?: string }>({});
    const [nombreValue, setNombreValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // limpiar errores y cargar datos iniciales cada vez que se abre el formulario
    useEffect(() => {
        if (isOpen) {
            setErrors({});
            // si hay datos iniciales (para edición), cargarlos en los campos
            setNombreValue(initialData?.nombre ?? "");
            setEmailValue(initialData?.email ?? "");
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({}); // limpiar errores previos
        setIsSubmitting(true);
        
        const clienteData: any = {
            nombre: nombreValue,
            email: emailValue
        };

        // determinar si es creación o edición
        const isEdit = initialData && initialData.id !== undefined;
        const url = isEdit
            ? `https://localhost:7057/clientes-api/Clientes/${initialData.id}/editar`
            : "https://localhost:7057/clientes-api/Clientes/crear";
        const method = isEdit ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clienteData)
            });

            if (response.ok) {
                onSuccess?.();
                onClose();
            } else {
                // intentar parsear errores de validación
                try {
                    const errorArray = await response.json();
                    const newErrors: { nombre?: string; email?: string } = {};
                    errorArray.forEach((err: any) => {
                        const prop = err.propertyName?.toString().toLowerCase();
                        if (prop === "nombre") newErrors.nombre = err.errorMessage;
                        if (prop === "email") newErrors.email = err.errorMessage;
                    });
                    setErrors(newErrors);
                } catch (jsonErr) {
                    console.error("Error al parsear errores de validación", jsonErr);
                }
            }
        } catch (error) {
            console.error("Error al enviar formulario", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {initialData && initialData.id ? "Editar Cliente" : "Nuevo Cliente"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            id="nombre"
                            required
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={nombreValue}
                            onChange={(e) => setNombreValue(e.target.value)}
                        />
                        {errors.nombre && (
                            <p className="text-red-500 mt-1 text-sm">{errors.nombre}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 border rounded disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                            className="px-4 py-2 border rounded hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting && (
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                            )}
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}