class GestorCities extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-info text-white">
            <h4>Gestor de Ciudades</h4>
          </div>
          <div class="card-body">
            <h5>Registrar Ciudad</h5>
            <form id="formCity">
              <select class="form-select mb-2" id="countrySelect"></select>
              <select class="form-select mb-2" id="regionSelect" disabled></select>
              <input type="text" class="form-control mb-2" id="cityName" placeholder="Nombre de la Ciudad">
              <button class="btn btn-primary">Guardar Ciudad</button>
            </form>

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
    this.regions = await this.getData("regions");
    this.cities = await this.getData("cities");

    this.renderCountriesSelect();
    this.renderCities();

    this.querySelector("#formCity").addEventListener("submit", this.addCity.bind(this));
    this.querySelector("#countrySelect").addEventListener("change", this.handleCountryChange.bind(this));
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

  async addCity(e) {
    e.preventDefault();
    const countryId = this.querySelector("#countrySelect").value;
    const regionId = this.querySelector("#regionSelect").value;
    const name = this.querySelector("#cityName").value.trim();

    if (!name || !countryId || !regionId) return;

    await this.postData("cities", { name, countryId, regionId });
    this.querySelector("#cityName").value = "";

    this.cities = await this.getData("cities");
    this.renderCities();

    document.getElementById("content").innerHTML = "<gestor-companies></gestor-companies>";
  }

  renderCountriesSelect() {
    const select = this.querySelector("#countrySelect");
    select.innerHTML = `<option value="">Seleccione un país</option>`;
    this.countries.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  handleCountryChange(e) {
    const countryId = e.target.value;
    const regionSelect = this.querySelector("#regionSelect");

    if (!countryId) {
      regionSelect.innerHTML = `<option value="">Primero seleccione un país</option>`;
      regionSelect.disabled = true;
      return;
    }

    const regionsFiltered = this.regions.filter(r => r.countryId == countryId);
    regionSelect.innerHTML = `<option value="">Seleccione una región</option>`;
    regionsFiltered.forEach(r => {
      regionSelect.innerHTML += `<option value="${r.id}">${r.name}</option>`;
    });
    regionSelect.disabled = false;
  }

  renderCities() {
    const lista = this.querySelector("#listaCities");
    lista.innerHTML = "";

    this.cities.forEach(city => {
      const country = this.countries.find(c => c.id == city.countryId);
      const region = this.regions.find(r => r.id == city.regionId);

      lista.innerHTML += `
        <li class="list-group-item">
          ${city.name} 
          (${region ? region.name : "Sin región"}, ${country ? country.name : "Sin país"})
        </li>`;
    });
  }
}

customElements.define("gestor-cities", GestorCities);
