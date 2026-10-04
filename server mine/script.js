/* 
   DATOS DE EJEMPLO
   - name, color, logo: igual que antes
   - stats: { wins, losses, points, matches } -> estadísticas de equipo
   - members[]: name, role, skin, Color
       - stats: { kills, deaths, assists } -> estadísticas del jugador
    */
const teams = [
  {
    name: "Equipo de prueba 1", color: "#8b8f94", logo: "L",
    stats: { wins: 14, losses: 3, points: 42, matches: 17 },
    members: [
      { name: "P1", role: "Capitán", skinTone: "#d9b48f", hairColor: "#4a3b2c", stats: { kills: 58, deaths: 20, daño : 14 } },
      { name: "P2",    role: "Farmeo",  skinTone: "#e8c39e", hairColor: "#222222", stats: { kills: 31, deaths: 25, daño : 22 } },
      { name: "P3",   role: "Soporte", skinTone: "#c68e5f", hairColor: "#7a5230", stats: { kills: 19, deaths: 15, daño : 40 } },
    ],
  },
  {
    name: "Equipo de prueba 2", color: "#c1442d", logo: "F",
    stats: { wins: 12, losses: 5, points: 36, matches: 17 },
    members: [
      { name: "P4",  role: "Capitán", skinTone: "#e8c39e", hairColor: "#8a1f1f", stats: { kills: 49, deaths: 22, daño : 12 } },
      { name: "P5", role: "Soporte",     skinTone: "#d9b48f", hairColor: "#101010", stats: { kills: 44, deaths: 18, daño : 9 } },
      { name: "P6",  role: "Farmeo",  skinTone: "#d9b48f", hairColor: "#111111", stats: { kills: 25, deaths: 27, daño : 20 } },
    ],
  },
  {
    name: "Equipo de prueba 3", color: "#3f9142", logo: "E",
    stats: { wins: 11, losses: 6, points: 33, matches: 17 },
    members: [
      { name: "P6",  role: "Capitán", skinTone: "#c68e5f", hairColor: "#2e4d2e", stats: { kills: 30, deaths: 19, daño : 25 } },
      { name: "P7",  role: "Soporte", skinTone: "#e8c39e", hairColor: "#3b2a1a", stats: { kills: 12, deaths: 14, daño : 38 } },
      { name: "P8",  role: "Farmeo",  skinTone: "#d9b48f", hairColor: "#111111", stats: { kills: 25, deaths: 27, daño : 20 } },
    ],
  },
 
];

/* 
   FUNCIONES AUXILIARES
    */
function initials(name) {
  return name.trim().charAt(0).toUpperCase();
}

function skinAvatarHTML(member) {
  const skinTone = member.skinTone || "#d9b48f";
  const hairColor = member.hairColor || "#3a2c1e";
  return `
    <span class="skin-avatar" style="background:${skinTone}">
      <span class="skin-hair" style="background:${hairColor}"></span>
      <span class="skin-eyes"></span>
    </span>`;
}

/* 
   NAVEGACIÓN: pestañas principales y subpestañas
    */
function setupTabs() {
  document.querySelectorAll("#mainTabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#mainTabs .tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    });
  });

  document.querySelectorAll("#statsSubTabs .subtab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#statsSubTabs .subtab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".subpanel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`subpanel-${btn.dataset.subtab}`).classList.add("active");
    });
  });
}

/* 
   RENDER: PODIO (top 3)
   */
function renderPodium() {
  const podium = document.getElementById("podium");
  const order = [2, 1, 3]; // orden visual: 2do, 1ro, 3ro
  podium.innerHTML = order.map(place => {
    const team = teams[place - 1];
    if (!team) return "";
    return `
      <div class="podium-slot" data-place="${place}">
        <div class="podium-card" data-goto-team="${place - 1}">
          <div class="podium-rank">#${place}</div>
          <div class="block-logo" style="background:${team.color}">${team.logo || initials(team.name)}</div>
          <div class="team-name">${team.name}</div>
        </div>
      </div>`;
  }).join("");
}

/* 
   RENDER: LISTA COMPLETA con acordeón (se despliega hacia abajo)
  */
function memberListHTML(team) {
  const members = team.members || [];
  if (!members.length) {
    return `<p class="empty-members">Este equipo todavía no tiene miembros cargados.</p>`;
  }
  return `
    <ul class="member-list">
      ${members.map(member => `
        <li class="member-row">
          ${skinAvatarHTML(member)}
          <div class="member-info">
            <span class="member-name">${member.name}</span>
            <span class="member-role">${member.role || "Sin rol asignado"}</span>
          </div>
        </li>
      `).join("")}
    </ul>`;
}

function renderList() {
  const list = document.getElementById("rankList");
  list.innerHTML = teams.map((team, i) => `
    <li class="rank-item" id="team-item-${i}" data-team-index="${i}">
      <button class="rank-row" type="button">
        <span class="rank-num">#${i + 1}</span>
        <span class="block-logo" style="background:${team.color}">${team.logo || initials(team.name)}</span>
        <span class="team-name">${team.name}</span>
        <span class="chevron">▸</span>
      </button>
      <div class="member-panel">
        <div class="member-panel-inner">
          ${memberListHTML(team)}
        </div>
      </div>
    </li>
  `).join("");
}

// Abre/cierra el acordeón de un equipo (uno a la vez)
function toggleTeam(teamIndex) {
  const item = document.getElementById(`team-item-${teamIndex}`);
  if (!item) return;
  const wasExpanded = item.classList.contains("expanded");

  document.querySelectorAll(".rank-item.expanded").forEach(el => el.classList.remove("expanded"));
  if (!wasExpanded) {
    item.classList.add("expanded");
  }
}

// Clic en una fila de la lista -> abre/cierra su acordeón
document.addEventListener("click", (e) => {
  const row = e.target.closest(".rank-row");
  if (row) {
    const item = row.closest(".rank-item");
    toggleTeam(Number(item.dataset.teamIndex));
    return;
  }

  // Clic en el podio -> lleva a la fila del equipo en la lista y la despliega
  const podiumCard = e.target.closest("[data-goto-team]");
  if (podiumCard) {
    const teamIndex = Number(podiumCard.dataset.gotoTeam);
    document.querySelector('[data-tab="ranking"]').click();
    const item = document.getElementById(`team-item-${teamIndex}`);
    document.querySelectorAll(".rank-item.expanded").forEach(el => el.classList.remove("expanded"));
    item.classList.add("expanded");
    item.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

/* 
   RENDER: ESTADÍSTICAS DE EQUIPOS
    */
function renderTeamStats() {
  const el = document.getElementById("teamStatsTable");
  const header = `
    <div class="stats-header-row team-stats">
      <span class="team-cell">Equipo</span>
      <span>Victorias</span>
      <span>Derrotas</span>
      <span class="col-matches">Partidas</span>
      <span>Puntos</span>
    </div>`;
  const rows = teams
    .slice()
    .sort((a, b) => b.stats.points - a.stats.points)
    .map(team => `
      <div class="stats-row team-stats">
        <span class="team-cell">
          <span class="block-logo" style="background:${team.color}">${team.logo || initials(team.name)}</span>
          ${team.name}
        </span>
        <span class="stats-num">${team.stats.wins}</span>
        <span class="stats-num">${team.stats.losses}</span>
        <span class="stats-num col-matches">${team.stats.matches}</span>
        <span class="stats-num">${team.stats.points}</span>
      </div>
    `).join("");
  el.innerHTML = header + rows;
}

/* 
   RENDER: ESTADÍSTICAS DE JUGADORES
    */
function renderPlayerStats() {
  const el = document.getElementById("playerStatsTable");
  const header = `
    <div class="stats-header-row player-stats">
      <span>Jugador</span>
      <span>Equipo</span>
      <span>Kills</span>
      <span>Muertes</span>
      <span>Daño Arcano</span>
    </div>`;

  const allPlayers = teams.flatMap(team =>
    (team.members || []).map(member => ({ ...member, teamName: team.name, teamColor: team.color }))
  );
  allPlayers.sort((a, b) => (b.stats?.kills || 0) - (a.stats?.kills || 0));

  const rows = allPlayers.map(p => `
    <div class="stats-row player-stats">
      <span class="player-name-cell">${skinAvatarHTML(p)} ${p.name}</span>
      <span class="player-team-cell">${p.teamName}</span>
      <span class="stats-num">${p.stats?.kills ?? "-"}</span>
      <span class="stats-num">${p.stats?.deaths ?? "-"}</span>
      <span class="stats-num">${p.stats?.arcaneDamage ?? "-"}</span>
    </div>
  `).join("");

  el.innerHTML = header + rows;
}

/*
   INICIO
   */
setupTabs();
renderPodium();
renderList();
renderTeamStats();
renderPlayerStats();