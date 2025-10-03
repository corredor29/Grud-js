# 🌍 Proyecto Gestor de Entidades

Este proyecto es una aplicación **SPA (Single Page Application)** en **HTML, CSS y JavaScript (Web Components)** que permite gestionar jerárquicamente diferentes entidades: **Países, Regiones, Ciudades, Compañías y Sucursales**.

El flujo está diseñado de manera **progresiva**: al registrar la primera entidad en cada nivel, la aplicación puede avanzar automáticamente al siguiente gestor (comportamiento controlado para evitar ciclos).

---

## 🚀 Tecnologías usadas

- **HTML5**
- **CSS3** (con **Bootstrap** para estilos rápidos)
- **JavaScript (ES6+)**
  - Web Components (`customElements.define`)
  - `fetch` API para llamadas HTTP
- **JSON Server** como backend simulado

---

## ⚙️ Instalación

1. Clona el repositorio o descarga el proyecto.

2. Instala **JSON Server** (si no lo tienes ya):

   ```bash
   npm install -g json-server
   ```

3. Inicia el servidor:

   ```bash
   json-server --watch db.json --port 3000
   ```

4. Abre el proyecto en el navegador (sirve el `index.html` con un servidor estático o abriéndolo directamente según tu entorno):

   ```
   http://localhost:5500/index.html
   ```

   *(Ajusta el puerto/URL según cómo sirvas tus archivos estáticos.)*

---

## 📖 Funcionalidades

### 1. Gestor de Países

- Registrar país.
- Editar país.
- Eliminar país.
- Mostrar/ocultar lista.
- ⚡ Al registrar el **primer país**, el flujo puede avanzar a Regiones.

### 2. Gestor de Regiones

- Seleccionar país asociado.
- Registrar región.
- Editar región.
- Eliminar región.
- Mostrar/ocultar lista.
- ⚡ Al registrar la **primera región**, el flujo puede avanzar a Ciudades.

### 3. Gestor de Ciudades

- Seleccionar país y región asociada.
- Registrar ciudad.
- Editar ciudad.
- Eliminar ciudad.
- Mostrar/ocultar lista.
- ⚡ Al registrar la **primera ciudad**, el flujo puede avanzar a Compañías.

### 4. Gestor de Compañías

- Registrar compañía con:
  - Nombre
  - UKNiu
  - Dirección
  - Email
  - Ciudad asociada
- Editar compañía.
- Eliminar compañía.
- Mostrar/ocultar lista.
- ⚡ Al registrar la **primera compañía**, el flujo puede avanzar a Sucursales.

### 5. Gestor de Sucursales (Branches)

- Registrar sucursal asociada a una compañía.
- Editar sucursal.
- Eliminar sucursal.
- Mostrar/ocultar lista.

---

## 📑 Flujo de la Aplicación

1. Inicio en **Países**.  
2. Al registrar el **primer país**, la aplicación puede avanzar a **Regiones**.  
3. Al registrar la **primera región**, avanza a **Ciudades**.  
4. Al registrar la **primera ciudad**, avanza a **Compañías**.  
5. Al registrar la **primera compañía**, avanza a **Sucursales**.

> Nota: el avance automático se ha implementado con una condición (por ejemplo, `if (this.countries.length === 1) { ... }`) para evitar bucles no deseados cuando el usuario agrega más registros o edita/borra.

---

## 🗄️ Estructura de ejemplo del `db.json`

```json
{
  "countries": [
    { "id": 1, "name": "Colombia" }
  ],
  "regions": [
    { "id": 1, "name": "Antioquia", "countryId": 1 }
  ],
  "cities": [
    { "id": 1, "name": "Medellín", "countryId": 1, "regionId": 1 }
  ],
  "companies": [
    { "id": 1, "name": "TechCorp", "UKNiu": "12345", "address": "Calle 10 #5", "email": "info@techcorp.com", "cityId": 1 }
  ],
  "branches": [
    { "id": 1, "name": "Sucursal Centro", "companyId": 1, "address": "Carrera 7 #20", "phone": "3001234567" }
  ]
}
```

---

## 🛠️ Buenas prácticas y notas

- Validar los formularios en el front (revisar campos vacíos, formato de email, etc.).  
- En producción, reemplazar JSON Server por un backend real con autenticación y validaciones del lado servidor.  
- Considerar manejar estados y navegación con un router simple si la aplicación crece.  
- Evitar manipular `innerHTML` sin control, preferir crear elementos y enlazar eventos para mayor seguridad y rendimiento.

---

## ✅ Conclusión

Este proyecto demuestra cómo construir un **sistema jerárquico de gestión** usando Web Components y un backend simulado (JSON Server). Su diseño permite extender fácilmente validaciones, autenticación y conexión a un backend real.

---

👨‍💻 Desarrollado por: **Felipe Corredor Silva**