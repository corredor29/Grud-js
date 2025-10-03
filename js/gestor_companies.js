class GestorCompanies extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="container mt-4">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4>Gestor de Compañías</h4>
          </div>
          <div class="card-body">
            <h5>Registrar Compañía</h5>
            <form id="formCompany">
              <input type="text" class="form-control mb-2" id="companyName" placeholder="Nombre de la Compañía">
              <input type="text" class="form-control mb-2" id="companyUKNiu" placeholder="UKNiu">
              <input type="text" class="form-control mb-2" id="companyAddress" placeholder="Dirección">
              <input type="email" class="form-control mb-2" id="companyEmail" placeholder="Email">
              <select class="form-select mb-2" id="citySelect"></select>
              <button class="btn btn-success">Guardar Compañía</button>
            </form>

            <h5 class="mt-4">Listado de Compañías</h5>
            <button id="toggleCompanies" class="btn btn-outline-primary mb-2">Mostrar Lista</button>
            <ul id="listaCompanies" class="list-group d-none"></ul>
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

    this.querySelector("#formCompany").addEventListener("submit", this.addCompany.bind(this));
    this.querySelector("#toggleCompanies").addEventListener("click", this.toggleCompanies.bind(this));
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

  renderCities() {
    const select = this.querySelector("#citySelect");
    select.innerHTML = `<option value="">Seleccione una ciudad</option>`;
    this.cities.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  async addCompany(e) {
    e.preventDefault();

    const name = this.querySelector("#companyName").value.trim();
    const UKNiu = this.querySelector("#companyUKNiu").value.trim();
    const address = this.querySelector("#companyAddress").value.trim();
    const email = this.querySelector("#companyEmail").value.trim();
    const cityId = this.querySelector("#citySelect").value;

    if (!name || !UKNiu || !address || !email || !cityId) return;

    await this.postData("companies", { name, UKNiu, address, email, cityId });

    this.querySelector("#formCompany").reset();

    this.companies = await this.getData("companies");
    this.renderCompanies();

    if (this.companies.length === 1) {
      this.dispatchEvent(new CustomEvent("next-step", { detail: "branches", bubbles: true }));
    }
  }

  toggleCompanies() {
    const lista = this.querySelector("#listaCompanies");
    lista.classList.toggle("d-none");
    this.querySelector("#toggleCompanies").textContent =
      lista.classList.contains("d-none") ? "Mostrar Lista" : "Ocultar Lista";
  }

  renderCompanies() {
    const lista = this.querySelector("#listaCompanies");
    lista.innerHTML = "";

    this.companies.forEach(c => {
      const city = this.cities.find(ci => ci.id == c.cityId);

      const li = document.createElement("li");
      li.classList.add("list-group-item");

      li.innerHTML = `
        <strong>${c.name}</strong> (${c.UKNiu})
        <br>${c.address}, ${city ? city.name : "Sin ciudad"}
        <br><small>Email: ${c.email}</small>
        <div class="mt-2">
          <button class="btn btn-sm btn-warning me-2">Editar</button>
          <button class="btn btn-sm btn-danger">Eliminar</button>
        </div>
      `;

      // Editar compañía
      li.querySelector(".btn-warning").addEventListener("click", async () => {
        const newName = prompt("Nuevo nombre de la compañía:", c.name);
        if (!newName) return;
        await this.putData("companies", c.id, { ...c, name: newName });
        this.companies = await this.getData("companies");
        this.renderCompanies();
      });

      li.querySelector(".btn-danger").addEventListener("click", async () => {
        if (!confirm(`¿Eliminar la compañía ${c.name}?`)) return;
        await this.deleteData("companies", c.id);
        this.companies = await this.getData("companies");
        this.renderCompanies();
      });

      lista.appendChild(li);
    });
  }
}

customElements.define("gestor-companies", GestorCompanies);
