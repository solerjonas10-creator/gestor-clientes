# Gestor de Clientes

Este proyecto es un sistema básico de gestión de clientes con una interfaz web (frontend) construida en Next.js (React + TypeScript)
y un backend API en C# .NET para manejar la lógica del servidor y la base de datos, la cual es SQLite.
Se utiliza el ORM Entity Framework para modelar la tabla clientes de la base de datos, y se usa la biblioteca **FluentValidation** para validar los datos del cliente

El objetivo es permitir crear, listar, editar, eliminar y buscar clientes desde una interfaz web conectada a una API REST.


## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

**Git**  
**Node.js** (incluye npm)  
**.NET SDK**`


## 1. Clonar el repositorio

Abre una terminal y ejecuta:
git clone https://github.com/solerjonas10-creator/gestor-clientes.git

## 2. Restaurar dependencias del Backend

Abrir la ubicacion del proyecto en una terminal y ejecutar:
cd gestor-clientes/backend
dotnet restore

## 3. Ejecutar el servidor Backend

cd GestorClienter.API
dotnet run

## 4. Abrir una nueva terminal en la raiz del proyecto

cd frontend

## 5. Instalar dependencias del Frontend

npm install

## 6. Ejecutar el servidor Frontend

npm run dev

## 7. Abrir en el navegador http://localhost:3000

## Probar la aplicacion !!
