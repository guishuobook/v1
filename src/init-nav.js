(() => {
  function restoreSidebarState() {
    const activeMenuLink = document.querySelector("a.active");
    const nav = document.querySelector(".sidebar nav");

    // When on the home page there there may be no activemenulink selected
    if (activeMenuLink === null) { return; }

    // Ensure that the path to the current active link is open
    // From activeLink -> <li/> -> <ul/> (submenu container)
    let submenuEl = activeMenuLink.parentElement?.parentElement;
    // from <ul/> -> <label/> (click target for opening menu)
    let toggle = submenuEl?.previousElementSibling;
    while (toggle) {
      toggle.click();

      // work our way up the tree to get to the next highest submenu (if any)
      submenuEl = toggle.parentElement.parentElement;
      toggle = submenuEl.previousElementSibling;
    }

    const navPosition = localStorage.getItem("navPosition");
    // Apply the previous nav scroll position if available
    if (navPosition) {
      nav.scrollTop = parseInt(navPosition);
    }

    // also make sure active is in view
    if (!elementInView(nav, activeMenuLink)) {
      activeMenuLink.scrollIntoView();
    }
  }
  var previousObj = null;
  function registerSubmenuToggleListeners() {
    const submenuToggles = document.querySelectorAll(
      ".sidebar .submenu-toggle-click-target"
    );

    submenuToggles.forEach((t) => {
      t.addEventListener("click", (e) => {
        const toggle = e.target.closest("label");
        const submenu = toggle.nextElementSibling;
        const isOpen = toggle.ariaExpanded === "true" ? false : true;
        if(previousObj!=null){
          if(previousObj.ariaExpanded === "true")  {
            previousObj.setAttribute("aria-expanded", "false");
            if(previousObj.nextElementSibling) previousObj.nextElementSibling.setAttribute("aria-hidden", "true");
          }
        }
        toggle.setAttribute("aria-expanded", isOpen.toString());
        submenu.setAttribute("aria-hidden", (!isOpen).toString());
        if(toggle.ariaExpanded === "true")
          previousObj = toggle;
      });

      t.addEventListener("keyup", (e) => {
        // Register "Enter" keypress like a click event
        if (e.which === 13) {
          e.target.click();
        }
      });
    });
  }

  function persistSidebarPosition() {
    const nav = document.querySelector(".sidebar nav");
    localStorage.setItem("navPosition", nav.scrollTop);
  }

  const elementInView = function (container, ele) {
    const { bottom, height, top } = ele.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return top <= containerRect.top
      ? containerRect.top - top <= height
      : bottom - containerRect.bottom <= height;
  };

  function initializeSidebar() {
    restoreSidebarState();
    registerSubmenuToggleListeners();
  }
  window.addEventListener("DOMContentLoaded", initializeSidebar);
  window.addEventListener("beforeunload", persistSidebarPosition);
})();

var menuHtml = "";
function outputSubMenu(subMenu) {
  menuHtml += "  <li class=\"section\" role=\"presentation\">";
  menuHtml += "      <a href=\"JavaScript:loadContent('./content/" + subMenu.content +"');\" class=\"menu-item\" aria-current=\"page\" style=\"padding-left: 60px;\" tabindex=\"0\" role=\"menuitem\" title=\"" + subMenu.title + "\">";
  menuHtml += "          <div>" + subMenu.title + "</div>";
  menuHtml += "      </a>";
  menuHtml += "  </li>";
}

function outputMenu(menu){
  menuHtml += "<li class=\"section\" role=\"presentation\">";
  menuHtml += " <input class=\"submenu-toggle-checkbox\" type=\"checkbox\" id=\"" + menu.title + "\">";
  menuHtml += " <label class=\"submenu-toggle-click-target\" for=\"" + menu.title + "\" tabindex=\"0\" aria-label=\"Toggle Getting Started submenu\" role=\"menuitem\" aria-expanded=\"false\">";
  menuHtml += "    <span class=\"menu-item submenu-header\" style=\"padding-left: 20px; font-weight: 500; \">";
  menuHtml += "        <img src=\"./src/caret-right.svg\">";
  if(menu.content!="" && menu.content!=null){
    menuHtml += "        <span><a href=\"JavaScript:loadContent('./content/" + menu.content +"');\">" + menu.title + "</a></span>";
  }
  else{
    menuHtml += "        <span>" + menu.title + "</span>";
  }
  menuHtml += "      </span>";
  menuHtml += "</label>";
  if(menu.subMenus.length > 0){
    menuHtml += "<ul role = \"submenu\" >";
    menu.subMenus.forEach(outputSubMenu);
    menuHtml += "</ul>";
  }
  menuHtml += "</li>";
}


function loadmenu(){
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onload = function() {
    var menus = JSON.parse(this.responseText);
    menus.forEach(outputMenu);
    document.getElementById("menus").innerHTML = menuHtml;
  }
  xmlhttp.open("GET", "./content/menu.json");
  xmlhttp.send();
}
function loadContent(url){
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onload = function() {
    document.getElementById("main").innerHTML = this.responseText;
  }
  xmlhttp.open("GET", url);
  xmlhttp.send();
  if($('#show-icon').is(':visible'))
  {
   $('#show-icon').click();
  }
}
