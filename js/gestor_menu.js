class GestorMenu extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Gestores</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarGestores">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarGestores">
            <ul class="navbar-nav me-auto">
              <li class="nav-item"><a class="nav-link" href="#" data-target="branches">Sucursales</a></li>
              <li class="nav-item"><a class="nav-link" href="#" data-target="cities">Ciudades</a></li>
              <li class="nav-item"><a class="nav-link" href="#" data-target="companies">Compañías</a></li>
              <li class="nav-item"><a class="nav-link" href="#" data-target="countries">Países</a></li>
              <li class="nav-item"><a class="nav-link" href="#" data-target="regions">Regiones</a></li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    this.initMenu();
  }

  initMenu() {
    const content = document.getElementById("content");

    this.querySelectorAll("a[data-target]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const target = e.target.getAttribute("data-target");

        content.innerHTML = ""; // limpiar contenido dinámico

        switch(target) {
          case "branches": content.innerHTML = "<gestor-branches></gestor-branches>"; break;
          case "cities": content.innerHTML = "<gestor-cities></gestor-cities>"; break;
          case "companies": content.innerHTML = "<gestor-companies></gestor-companies>"; break;
          case "countries": content.innerHTML = "<gestor-countries></gestor-countries>"; break;
          case "regions": content.innerHTML = "<gestor-regions></gestor-regions>"; break;
        }
      });
    });
  }
}

customElements.define("gestor-menu", GestorMenu);
