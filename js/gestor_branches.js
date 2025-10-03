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

            <button id="toggleList" class="btn btn-secondary mt-3">Mostrar Lista</button>

            <div id="branchesContainer" style="display:none;" class="mt-3">
              <h5>Listado de Sucursales</h5>
              <ul id="listaBranches" class="list-group"></ul>
            </div>
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
    this.querySelector("#toggleList").addEventListener("click", this.toggleList.bind(this));
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

  async deleteData(endpoint, id) {
    await fetch(`http://localhost:3000/${endpoint}/${id}`, { method: "DELETE" });
  }

  async putData(endpoint, id, data) {
    await fetch(`http://localhost:3000/${endpoint}/${id}`, {
      method: "PUT",
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

    // 🔥 Nueva lógica: avanzar SOLO si es la primera sucursal
    if (this.branches.length === 1) {
      document.getElementById("content").innerHTML = "<gestor-countries></gestor-countries>";
    }
  }

  renderBranches() {
    const lista = this.querySelector("#listaBranches");
    lista.innerHTML = "";

    this.branches.forEach(b => {
      const company = this.companies.find(c => c.id == b.companyId);

      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";

      li.innerHTML = `
        <div>
          <strong>${b.name}</strong> - ${b.address}
          <br><small>Email: ${b.email}</small>
          <br><em>Compañía: ${company ? company.name : "Sin compañía"}</em>
        </div>
        <div>
          <button class="btn btn-sm btn-primary me-1 btn-edit"> Editar</button>
          <button class="btn btn-sm btn-danger btn-delete"> Eliminar</button>
        </div>
      `;

      // Botón eliminar
      li.querySelector(".btn-delete").addEventListener("click", async () => {
        if (confirm("¿Seguro que deseas eliminar esta sucursal?")) {
          await this.deleteData("branches", b.id);
          this.branches = await this.getData("branches");
          this.renderBranches();
        }
      });

      // Botón editar
      li.querySelector(".btn-edit").addEventListener("click", async () => {
        const nuevoNombre = prompt("Nuevo nombre de la sucursal:", b.name);
        const nuevaDireccion = prompt("Nueva dirección:", b.address);
        const nuevoEmail = prompt("Nuevo email:", b.email);

        if (nuevoNombre && nuevaDireccion && nuevoEmail) {
          await this.putData("branches", b.id, {
            ...b,
            name: nuevoNombre,
            address: nuevaDireccion,
            email: nuevoEmail
          });
          this.branches = await this.getData("branches");
          this.renderBranches();
        }
      });

      lista.appendChild(li);
    });
  }

  toggleList() {
    const container = this.querySelector("#branchesContainer");
    const btn = this.querySelector("#toggleList");
    if (container.style.display === "none") {
      container.style.display = "block";
      btn.textContent = "Ocultar Lista";
    } else {
      container.style.display = "none";
      btn.textContent = "Mostrar Lista";
    }
  }
}

customElements.define("gestor-branches", GestorBranches);
