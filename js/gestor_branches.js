class GestorBranches extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-info text-white">
            <h4>Gestor de Sucursales (Branches)</h4>
          </div>
          <div class="card-body">
            <!-- Formulario -->
            <h5>Registrar Sucursal</h5>
            <form id="formBranch">
              <input type="text" class="form-control mb-2" id="numberCommercial" placeholder="Número Comercial">
              <input type="text" class="form-control mb-2" id="address" placeholder="Dirección">
              <input type="email" class="form-control mb-2" id="email" placeholder="Correo Electrónico">
              <input type="text" class="form-control mb-2" id="contactName" placeholder="Nombre del Contacto">
              <input type="text" class="form-control mb-2" id="phone" placeholder="Teléfono">

              <select class="form-select mb-2" id="citySelect"></select>
              <select class="form-select mb-2" id="companySelect"></select>

              <button class="btn btn-info text-white">Guardar Sucursal</button>
            </form>

            <!-- Listado -->
            <h5 class="mt-4">Listado de Sucursales</h5>
            <ul id="listaBranches" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.init();
  }

  async init() {
    this.cities = await this.getData("cities");
    this.companies = await this.getData("companies");
    this.branches = await this.getData("branches");

    this.renderCitiesSelect();
    this.renderCompaniesSelect();
    this.renderBranches();

    // Evento submit
    this.querySelector("#formBranch").addEventListener("submit", this.addBranch.bind(this));
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

  // --- Add Branch ---
  async addBranch(e) {
    e.preventDefault();
    const numberCommercial = this.querySelector("#numberCommercial").value.trim();
    const address = this.querySelector("#address").value.trim();
    const email = this.querySelector("#email").value.trim();
    const contact_name = this.querySelector("#contactName").value.trim();
    const phone = this.querySelector("#phone").value.trim();
    const cityId = this.querySelector("#citySelect").value;
    const companyId = this.querySelector("#companySelect").value;

    if (!numberCommercial || !address || !email || !contact_name || !phone || !cityId || !companyId) return;

    await this.postData("branches", { 
      numberCommercial, 
      address, 
      email, 
      contact_name, 
      phone, 
      cityId, 
      companyId 
    });

    // Limpiar inputs
    this.querySelector("#formBranch").reset();

    this.branches = await this.getData("branches");
    this.renderBranches();
  }

  // --- Render Selects ---
  renderCitiesSelect() {
    const select = this.querySelector("#citySelect");
    select.innerHTML = `<option value="">Seleccione una ciudad</option>`;
    this.cities.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  renderCompaniesSelect() {
    const select = this.querySelector("#companySelect");
    select.innerHTML = `<option value="">Seleccione una compañía</option>`;
    this.companies.forEach(co => {
      select.innerHTML += `<option value="${co.id}">${co.name}</option>`;
    });
  }

  // --- Render Branches ---
  renderBranches() {
    const lista = this.querySelector("#listaBranches");
    lista.innerHTML = "";
    this.branches.forEach(b => {
      const city = this.cities.find(c => c.id == b.cityId);
      const company = this.companies.find(co => co.id == b.companyId);
      lista.innerHTML += `
        <li class="list-group-item">
          <strong>${b.numberCommercial}</strong> - ${b.address} <br>
          Correo: ${b.email} | Contacto: ${b.contact_name} | Tel: ${b.phone} <br>
          Ciudad: ${city ? city.name : "Sin ciudad"} | Compañía: ${company ? company.name : "Sin compañía"}
        </li>`;
    });
  }
}

customElements.define("gestor-branches", GestorBranches);
