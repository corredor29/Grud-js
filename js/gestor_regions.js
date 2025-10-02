class GestorRegions extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-warning text-dark">
            <h4>Gestor de Regiones</h4>
          </div>
          <div class="card-body">
            <!-- Formulario -->
            <h5>Registrar Región</h5>
            <form id="formRegion">
              <select class="form-select mb-2" id="countrySelect"></select>
              <input type="text" class="form-control mb-2" id="regionName" placeholder="Nombre de la Región">
              <button class="btn btn-warning">Guardar Región</button>
            </form>

            <!-- Listado -->
            <h5 class="mt-4">Listado de Regiones</h5>
            <ul id="listaRegions" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.init();
  }

  async init() {
    this.countries = await this.getData("countries");
    this.regions = await this.getData("regions");

    this.renderCountriesSelect();
    this.renderRegions();

    // Evento submit
    this.querySelector("#formRegion").addEventListener("submit", this.addRegion.bind(this));
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

  // --- Add Region ---
  async addRegion(e) {
    e.preventDefault();
    const countryId = this.querySelector("#countrySelect").value;
    const name = this.querySelector("#regionName").value.trim();
    if (!name || !countryId) return;

    await this.postData("regions", { name, countryId });
    this.querySelector("#regionName").value = "";

    this.regions = await this.getData("regions");
    this.renderRegions();
  }

  // --- Render Countries in Select ---
  renderCountriesSelect() {
    const select = this.querySelector("#countrySelect");
    select.innerHTML = `<option value="">Seleccione un país</option>`;
    this.countries.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  // --- Render Regions ---
  renderRegions() {
    const lista = this.querySelector("#listaRegions");
    lista.innerHTML = "";
    this.regions.forEach(region => {
      const country = this.countries.find(c => c.id == region.countryId);
      lista.innerHTML += `<li class="list-group-item">${region.name} (${country ? country.name : "Sin país"})</li>`;
    });
  }
}

customElements.define("gestor-regions", GestorRegions);
