class GestorRegions extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = `
      <div class="card mt-4 shadow">
        <div class="card-header bg-warning text-dark fw-bold">Gestor de Regiones</div>
        <div class="card-body">
          <form id="formRegion" class="mb-3">
            <select id="countryId" class="form-select mb-2">
              <option value="">Seleccione un país</option>
            </select>
            <input type="text" id="regionName" class="form-control mb-2" placeholder="Nombre de la Región">
            <button type="submit" class="btn btn-warning">Guardar Región</button>
          </form>

          <button id="toggleList" class="btn btn-secondary mb-3">Mostrar Lista</button>

          <div id="regionsContainer" style="display:none;">
            <h5>Listado de Regiones</h5>
            <ul id="regionsList" class="list-group"></ul>
          </div>
        </div>
      </div>
    `;

    this.form = this.querySelector("#formRegion");
    this.countryIdInput = this.querySelector("#countryId");
    this.regionNameInput = this.querySelector("#regionName");
    this.list = this.querySelector("#regionsList");
    this.container = this.querySelector("#regionsContainer");
    this.toggleBtn = this.querySelector("#toggleList");

    this.regions = await this.getData("regions");
    this.countries = await this.getData("countries");

    this.renderCountries();
    this.renderRegions();

    this.form.addEventListener("submit", e => this.addRegion(e));
    this.toggleBtn.addEventListener("click", () => this.toggleList());
  }

  async getData(endpoint) {
    const res = await fetch(`http://localhost:3000/${endpoint}`);
    return await res.json();
  }

  async postData(endpoint, data) {
    await fetch(`http://localhost:3000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  async deleteData(endpoint, id) {
    await fetch(`http://localhost:3000/${endpoint}/${id}`, {
      method: "DELETE"
    });
  }

  async putData(endpoint, id, data) {
    await fetch(`http://localhost:3000/${endpoint}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  renderCountries() {
    this.countryIdInput.innerHTML = `<option value="">Seleccione un país</option>`;
    this.countries.forEach(c => {
      this.countryIdInput.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  renderRegions() {
    this.list.innerHTML = "";
    this.regions.forEach(r => {
      const country = this.countries.find(c => c.id == r.countryId);
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span>${r.name} (${country ? country.name : "Sin país"})</span>
        <div>
          <button class="btn btn-sm btn-primary me-1 btn-edit"> Editar</button>
          <button class="btn btn-sm btn-danger btn-delete"> Eliminar</button>
        </div>
      `;

      // Botón eliminar
      li.querySelector(".btn-delete").addEventListener("click", async () => {
        if (confirm("¿Seguro que deseas eliminar esta región?")) {
          await this.deleteData("regions", r.id);
          this.regions = await this.getData("regions");
          this.renderRegions();
        }
      });

      // Botón editar
      li.querySelector(".btn-edit").addEventListener("click", async () => {
        const nuevoNombre = prompt("Nuevo nombre de la región:", r.name);
        if (nuevoNombre) {
          await this.putData("regions", r.id, { ...r, name: nuevoNombre });
          this.regions = await this.getData("regions");
          this.renderRegions();
        }
      });

      this.list.appendChild(li);
    });
  }

  toggleList() {
    if (this.container.style.display === "none") {
      this.container.style.display = "block";
      this.toggleBtn.textContent = "Ocultar Lista";
    } else {
      this.container.style.display = "none";
      this.toggleBtn.textContent = "Mostrar Lista";
    }
  }

  async addRegion(e) {
    e.preventDefault();
    const name = this.regionNameInput.value.trim();
    const countryId = this.countryIdInput.value;

    if (!name || !countryId) {
      alert("Debes ingresar nombre y seleccionar un país");
      return;
    }

    await this.postData("regions", { name, countryId });
    this.form.reset();

    this.regions = await this.getData("regions");
    this.renderRegions();

    // ✅ Avanzar solo si es la primera región registrada
    if (this.regions.length === 1) {
      this.dispatchEvent(new CustomEvent("next-step", { detail: "cities", bubbles: true }));
    }
  }
}

customElements.define("gestor-regions", GestorRegions);
