class GestorBranches extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-danger text-white">
            <h4>Gestor de Sucursales</h4>
          </div>
          <div class="card-body">
            <h5>Registrar Sucursal</h5>
            <form id="formBranch">
              <input type="text" class="form-control mb-2" id="branchName" placeholder="Nombre de la Sucursal">
              <input type="text" class="form-control mb-2" id="branchAddress" placeholder="Dirección">
              <input type="email" class="form-control mb-2" id="branchEmail" placeholder="Email">
              <select class="form-select mb-2" id="companySelect"></select>
              <button class="btn btn-danger">Guardar Sucursal</button>
            </form>

            <h5 class="mt-4">Listado de Sucursales</h5>
            <ul id="listaBranches" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.init();
  }

  async init() {
    this.companies = await this.getData("companies");
    this.branches = await this.getData("branches");

    this.renderCompanies();
    this.renderBranches();

    this.querySelector("#formBranch").addEventListener("submit", this.addBranch.bind(this));
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

  renderCompanies() {
    const select = this.querySelector("#companySelect");
    select.innerHTML = `<option value="">Seleccione una compañía</option>`;
    this.companies.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  async addBranch(e) {
    e.preventDefault();

    const name = this.querySelector("#branchName").value.trim();
    const address = this.querySelector("#branchAddress").value.trim();
    const email = this.querySelector("#branchEmail").value.trim();
    const companyId = this.querySelector("#companySelect").value;

    if (!name || !address || !email || !companyId) return;

    await this.postData("branches", { name, address, email, companyId });

    this.querySelector("#formBranch").reset();

    this.branches = await this.getData("branches");
    this.renderBranches();

    document.getElementById("content").innerHTML = "<gestor-countries></gestor-countries>";
  }

  renderBranches() {
    const lista = this.querySelector("#listaBranches");
    lista.innerHTML = "";
    this.branches.forEach(b => {
      const company = this.companies.find(c => c.id == b.companyId);
      lista.innerHTML += `
        <li class="list-group-item">
          <strong>${b.name}</strong> - ${b.address}
          <br><small>Email: ${b.email}</small>
          <br><em>Compañía: ${company ? company.name : "Sin compañía"}</em>
        </li>`;
    });
  }
}

customElements.define("gestor-branches", GestorBranches);
