const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a, .header-cta, .btn, .site-footer a");
const toast = document.querySelector(".toast");
const appScreen = document.querySelector("[data-app-screen]");
const appTabs = document.querySelectorAll("[data-app-tab]");
const tiltCard = document.querySelector("[data-tilt-card]");

const appScreens = {
  overview: `
    <h3 class="phone-title">今日步态概览</h3>
    <div class="phone-card primary-card">
      <span>今日状态</span>
      <strong>建议关注</strong>
      <p>近 7 天右脚足弓区域压力略有上升，建议继续观察。</p>
    </div>
    <div class="phone-metrics">
      <div class="phone-card"><span>左右受力</span><strong>8%</strong><p>轻微偏右</p></div>
      <div class="phone-card"><span>稳定性</span><strong>86</strong><p>整体平稳</p></div>
    </div>
    <div class="phone-card">
      <span>当前支撑垫</span>
      <strong>中支撑</strong>
      <p>已使用 14 天，建议 3 天后复测。</p>
    </div>
  `,
  trend: `
    <h3 class="phone-title">趋势分析</h3>
    <div class="phone-card primary-card">
      <span>足弓压力趋势</span>
      <strong>较上周 +6%</strong>
      <p>趋势提醒用于日常观察，不作为诊断依据。</p>
    </div>
    <div class="phone-list">
      <div class="phone-card"><span>左脚受力</span><strong>48%</strong><p>分布稳定</p></div>
      <div class="phone-card"><span>右脚受力</span><strong>52%</strong><p>轻微偏重</p></div>
      <div class="phone-card"><span>FPA 趋势</span><strong>轻微内旋</strong><p>建议通过训练继续观察。</p></div>
    </div>
  `,
  plan: `
    <h3 class="phone-title">今日训练计划</h3>
    <div class="phone-card primary-card">
      <span>完成状态</span>
      <strong>1 / 3</strong>
      <p>连续训练 5 天</p>
    </div>
    <div class="phone-list">
      <div class="phone-card"><span>3 分钟</span><strong>足弓激活训练</strong><p>帮助孩子感知足弓发力。</p></div>
      <div class="phone-card"><span>2 组</span><strong>脚趾抓地训练</strong><p>增强脚趾控制与足底肌群参与。</p></div>
      <div class="phone-card"><span>5 分钟</span><strong>直线步行练习</strong><p>建立更稳定的行走方向感。</p></div>
    </div>
  `,
  report: `
    <h3 class="phone-title">复测报告</h3>
    <div class="phone-card primary-card">
      <span>阶段变化总结</span>
      <strong>有迹可循</strong>
      <p>步态稳定性略有提升，左右受力差异有所下降。</p>
    </div>
    <div class="phone-metrics">
      <div class="phone-card"><span>稳定性</span><strong>82 → 86</strong><p>提升 4 分</p></div>
      <div class="phone-card"><span>受力差异</span><strong>12% → 8%</strong><p>差异缩小</p></div>
    </div>
    <div class="phone-card">
      <span>复测参考</span>
      <strong>继续中支撑</strong>
      <p>进入下一周期训练与复测。</p>
    </div>
  `
};

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function setAppScreen(key) {
  appScreen.innerHTML = appScreens[key];
  appTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.appTab === key);
  });
}

function closeMenu() {
  header.classList.remove("nav-visible");
  document.body.classList.remove("nav-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  header.classList.toggle("nav-visible", !expanded);
  document.body.classList.toggle("nav-open", !expanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.querySelectorAll("[data-toast]").forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

appTabs.forEach((button) => {
  button.addEventListener("click", () => setAppScreen(button.dataset.appTab));
});

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

setAppScreen("overview");

if (tiltCard) {
  tiltCard.addEventListener("mousemove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `perspective(1200px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-3px)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "";
  });
}
