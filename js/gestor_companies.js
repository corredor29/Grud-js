class GestorCompanies extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4>Gestor de Companies</h4>
          </div>
          <div class="card-body">
            <!-- Formulario -->
            <h5>Registrar Company</h5>
            <form id="formCompany">
              <input type="text" class="form-control mb-2" id="companyName" placeholder="Nombre de la Company">
              <input type="text" class="form-control mb-2" id="companyUKNiu" placeholder="UKNiu">
              <input type="text" class="form-control mb-2" id="companyAddress" placeholder="Dirección">
              <input type="email" class="form-control mb-2" id="companyEmail" placeholder="Email">
              <select class="form-select mb-2" id="citySelect"></select>
              <button class="btn btn-success">Guardar Company</button>
            </form>

            <!-- Listado -->
            <h5 class="mt-4">Listado de Companies</h5>
            <ul id="listaCompanies" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.init();
  }

  async init() {
    this.cities = await this.getData("cities");
    this.companies = await this.getData("companies");

    this.renderCities();
    this.renderCompanies();

    // Eventos
    this.querySelector("#formCompany").addEventListener("submit", this.addCompany.bind(this));
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

  // --- Render Cities ---
  renderCities() {
    const select = this.querySelector("#citySelect");
    select.innerHTML = `<option value="">Seleccione una ciudad</option>`;
    this.cities.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  // --- Add Company ---
  async addCompany(e) {
    e.preventDefault();

    const name = this.querySelector("#companyName").value.trim();
    const UKNiu = this.querySelector("#companyUKNiu").value.trim();
    const address = this.querySelector("#companyAddress").value.trim();
    const email = this.querySelector("#companyEmail").value.trim();
    const cityId = this.querySelector("#citySelect").value;

    if (!name || !UKNiu || !address || !email || !cityId) return;

    await this.postData("companies", { name, UKNiu, address, email, cityId });

    // limpiar
    this.querySelector("#formCompany").reset();

    // refrescar lista
    this.companies = await this.getData("companies");
    this.renderCompanies();
  }

  // --- Render Companies ---
  renderCompanies() {
    const lista = this.querySelector("#listaCompanies");
    lista.innerHTML = "";
    this.companies.forEach(c => {
      const city = this.cities.find(ci => ci.id == c.cityId);
      lista.innerHTML += `
        <li class="list-group-item">
          <strong>${c.name}</strong> (${c.UKNiu}) - ${c.address}, ${city ? city.name : "Sin ciudad"} 
          <br><small>Email: ${c.email}</small>
        </li>`;
    });
  }
}

customElements.define("gestor-companies", GestorCompanies);
