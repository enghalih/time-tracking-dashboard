const DEBUG = true;
let time = "Daily";

const filterBtn = document.querySelectorAll(".filter-btn");
const statGrid = document.getElementById("stats-grid");
let data;

debug(filterBtn);
if (filterBtn) {
  filterBtn.forEach((btn, index) => {
    if (btn.textContent === time) {
      setActiveTime(btn);
    }
    btn.addEventListener("click", (event) => {
      e = event.target;
      time = e.innerHTML;
      filterBtn.forEach((btnclosed) => {
        setInactiveTime(btnclosed);
      });
      setActiveTime(e);
      debug(time);
    });
  });

  function setActiveTime(btn) {
    btn.classList.add("filter-btn--active");
    btn.setAttribute("aria-current", "page");
    document.querySelectorAll('.stat-card__content').forEach(content => {
      content.dataset.time = time;
    });
  }
  function setInactiveTime(btn) {
    btn.classList.remove("filter-btn--active");
    btn.removeAttribute("aria-current");
  }
}

async function getData() {
  fetch("/time-tracking-dashboard/data.json)
    .then((res) => {
      if (!res.ok) return debug("can't get API");

      return res.json();
    })
    .then((data) => {
      debug(data);
      showData(data);
    }).error((error){
      debug(error);
    });
}

function showData(datas) {
  if (!statGrid) return debug("statGrid nothing");
  statGrid.innerHTML = "";
  show = [];
  datas.forEach((data) => {
    timeframe = data.timeframes;
    show.push(`
      <article class="stat-card stat-card--${data.title.toLowerCase().replace(" ", "-")}">
            <div class="stat-card__content" data-time="Daily">
              <header class="stat-card__header">
                <h2 class="stat-card__title">${data.title}</h2>
                <button
                  class="stat-card__menu-btn"
                  aria-label="More options for ${data.title}"
                >
                  <img src="images/icon-ellipsis.svg" alt="" aria-hidden="true" />
                </button>
              </header>
              <div class="stat-card__body stat-card__body--daily">
                <p class="stat-card__time">${timeframe.daily.current}hrs</p>
                <p class="stat-card__previous">Last Daily - ${timeframe.daily.previous}hrs</p>
              </div>
              <div class="stat-card__body stat-card__body--weekly">
                <p class="stat-card__time">${timeframe.weekly.current}hrs</p>
                <p class="stat-card__previous">Last Weekly - ${timeframe.weekly.previous}hrs</p>
              </div>
              <div class="stat-card__body stat-card__body--monthly">
                <p class="stat-card__time">${timeframe.monthly.current}hrs</p>
                <p class="stat-card__previous">Last Mounthly - ${timeframe.monthly.previous}hrs</p>
              </div>
            </div>
          </article>
      `);
  });
  statGrid.innerHTML += show.join("");
}

function debug(...arg) {
  if (DEBUG) console.log(arg);
}

getData();
