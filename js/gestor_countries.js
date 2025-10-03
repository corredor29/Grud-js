class GestorCountries extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4>Gestor de Países</h4>
          </div>
          <div class="card-body">
            <h5>Registrar País</h5>
            <form id="formCountry">
              <input type="text" class="form-control mb-2" id="countryName" placeholder="Nombre del País">
              <button class="btn btn-primary">Guardar País</button>
            </form>

            <h5 class="mt-4">Listado de Países</h5>
            <button id="toggleCountries" class="btn btn-outline-success mb-2">Mostrar Lista</button>
            <ul id="listaCountries" class="list-group d-none"></ul>
          </div>
        </div>
      </div>
    `;
    this.init();
  }

  async init() {
    this.countries = await this.getData("countries");
    this.renderCountries();

    this.querySelector("#formCountry").addEventListener("submit", this.addCountry.bind(this));
    this.querySelector("#toggleCountries").addEventListener("click", this.toggleCountries.bind(this));
  }

  async getData(endpoint) {
    return await fetch(`http://localhost:3000/${endpoint}`).then(res => res.json());
  }

  async postData(endpoint, data) {
    await fetch(`http://localhost:3000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  async putData(endpoint, id, data) {
    await fetch(`http://localhost:3000/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  async deleteData(endpoint, id) {
    await fetch(`http://localhost:3000/${endpoint}/${id}`, {
      method: "DELETE"
    });
  }

  // 🔥 Nueva función addCountry con flujo controlado
  async addCountry(e) {
    e.preventDefault();
    const name = this.querySelector("#countryName").value.trim();
    if (!name) return;

    await this.postData("countries", { name });
    this.querySelector("#formCountry").reset();

    this.countries = await this.getData("countries");
    this.renderCountries();

    if (this.countries.length === 1) {
      this.dispatchEvent(new CustomEvent("next-step", { detail: "regions", bubbles: true }));
    }
  }

  toggleCountries() {
    const lista = this.querySelector("#listaCountries");
    lista.classList.toggle("d-none");
    this.querySelector("#toggleCountries").textContent =
      lista.classList.contains("d-none") ? "Mostrar Lista" : "Ocultar Lista";
  }

  renderCountries() {
    const lista = this.querySelector("#listaCountries");
    lista.innerHTML = "";

    this.countries.forEach(c => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");

      li.innerHTML = `
        <strong>${c.name}</strong>
        <div class="mt-2">
          <button class="btn btn-sm btn-warning me-2">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </div>
      `;

      // Editar país
      li.querySelector(".btn-warning").addEventListener("click", async () => {
        const newName = prompt("Nuevo nombre del país:", c.name);
        if (!newName) return;
        await this.putData("countries", c.id, { ...c, name: newName });
        this.countries = await this.getData("countries");
        this.renderCountries();
      });

      // Eliminar país
      li.querySelector(".btn-danger").addEventListener("click", async () => {
        if (!confirm(`¿Eliminar el país ${c.name}?`)) return;
        await this.deleteData("countries", c.id);
        this.countries = await this.getData("countries");
        this.renderCountries();
      });

      lista.appendChild(li);
    });
  }
}

customElements.define("gestor-countries", GestorCountries);
