class GestorCities extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-info text-white">
            <h4>Gestor de Ciudades</h4>
          </div>
          <div class="card-body">
            <!-- Formulario -->
            <h5>Registrar Ciudad</h5>
            <form id="formCity">
              <select class="form-select mb-2" id="countrySelect"></select>
              <input type="text" class="form-control mb-2" id="cityName" placeholder="Nombre de la Ciudad">
              <button class="btn btn-primary">Guardar Ciudad</button>
            </form>

            <!-- Listado -->
            <h5 class="mt-4">Listado de Ciudades</h5>
            <ul id="listaCities" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.init();
  }

  async init() {
    this.countries = await this.getData("countries");
    this.cities = await this.getData("cities");

    this.renderCountriesSelect();
    this.renderCities();

    // Evento submit
    this.querySelector("#formCity").addEventListener("submit", this.addCity.bind(this));
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

  // --- Add City ---
  async addCity(e) {
    e.preventDefault();
    const countryId = this.querySelector("#countrySelect").value;
    const name = this.querySelector("#cityName").value.trim();
    if (!name || !countryId) return;

    await this.postData("cities", { name, countryId });
    this.querySelector("#cityName").value = "";

    this.cities = await this.getData("cities");
    this.renderCities();
  }

  // --- Render Countries in Select ---
  renderCountriesSelect() {
    const select = this.querySelector("#countrySelect");
    select.innerHTML = `<option value="">Seleccione un país</option>`;
    this.countries.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  // --- Render Cities ---
  renderCities() {
    const lista = this.querySelector("#listaCities");
    lista.innerHTML = "";
    this.cities.forEach(city => {
      const country = this.countries.find(c => c.id == city.countryId);
      lista.innerHTML += `<li class="list-group-item">${city.name} (${country ? country.name : "Sin país"})</li>`;
    });
  }
}

customElements.define("gestor-cities", GestorCities);
