class GestorCountries extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4>Gestor de Países</h4>
          </div>
          <div class="card-body">
            <!-- Formulario -->
            <h5>Registrar País</h5>
            <form id="formCountry">
              <input type="text" class="form-control mb-2" id="countryName" placeholder="Nombre del País">
              <button class="btn btn-primary">Guardar País</button>
            </form>

            <!-- Listado -->
            <h5 class="mt-4">Listado de Países</h5>
            <ul id="listaCountries" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.init();
  }

  async init() {
    this.countries = await this.getData("countries");
    this.renderCountries();

    // Evento de submit
    this.querySelector("#formCountry").addEventListener("submit", this.addCountry.bind(this));
  }

  // --- Helpers para DB ---
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

  // --- Add Country ---
  async addCountry(e) {
    e.preventDefault();
    const name = this.querySelector("#countryName").value.trim();
    if (!name) return;

    await this.postData("countries", { name });
    this.querySelector("#countryName").value = "";

    this.countries = await this.getData("countries");
    this.renderCountries();
  }

  // --- Render Countries ---
  renderCountries() {
    const lista = this.querySelector("#listaCountries");
    lista.innerHTML = "";
    this.countries.forEach(c => {
      lista.innerHTML += `<li class="list-group-item">${c.name}</li>`;
    });
  }
}

customElements.define("gestor-countries", GestorCountries);
