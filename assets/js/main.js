/* ============================================================
   Sprout Launcher · Site Scripts
   零依赖 · 纯原生 · 尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------------- 主题 ---------------- */
  (function theme() {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem('sprout-theme'); } catch (e) { saved = null; }
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    root.setAttribute('data-theme', saved || (prefersLight ? 'light' : 'dark'));

    var btn = $('#themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('sprout-theme', next); } catch (e) { /* ignore */ }
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', next === 'dark' ? '#06080c' : '#f4f7fb');
    });
  })();

  /* ---------------- Hero 标题逐字入场 ---------------- */
  (function splitTitle() {
    var host = $('[data-split]');
    if (!host) return;
    var text = host.textContent.trim();
    host.textContent = '';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      frag.appendChild(span);
    }
    host.appendChild(frag);
  })();

  /* ---------------- 滚动进度 / 导航 / 回到顶部 ---------------- */
  (function scrollUi() {
    var bar = $('#scrollProgress');
    var nav = $('#nav');
    var toTop = $('#toTop');
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      if (nav) nav.classList.toggle('is-scrolled', y > 40);
      if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.8);
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ---------------- 星野粒子 canvas ---------------- */
  (function starfield() {
    var canvas = $('#starfield');
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, stars = [];
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    var raf = null;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      var count = clamp(Math.round((w * h) / 26000), 26, 90);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.5,
          vy: -(Math.random() * 0.22 + 0.06),
          vx: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.5 + 0.16,
          tw: Math.random() * Math.PI * 2,
          tws: Math.random() * 0.02 + 0.006
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.y += s.vy;
        s.x += s.vx;
        s.tw += s.tws;
        if (s.y < -12) { s.y = h + 12; s.x = Math.random() * w; }
        if (s.x < -12) s.x = w + 12;
        if (s.x > w + 12) s.x = -12;

        var px = s.x + pointer.x * (s.r * 5);
        var py = s.y + pointer.y * (s.r * 5);
        var alpha = s.a * (0.55 + 0.45 * Math.sin(s.tw));

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(160, 245, 205, ' + alpha.toFixed(3) + ')';
        ctx.fill();
      }
      raf = window.requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function () {
      window.clearTimeout(resize._t);
      resize._t = window.setTimeout(resize, 180);
    });
    window.addEventListener('pointermove', function (e) {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    resize();
    raf = window.requestAnimationFrame(draw);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (raf) window.cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        raf = window.requestAnimationFrame(draw);
      }
    });
  })();

  /* ---------------- 鼠标柔光 ---------------- */
  (function cursorGlow() {
    var glow = $('#cursorGlow');
    if (!glow || reduceMotion) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var x = window.innerWidth / 2, y = window.innerHeight / 2;
    var tx = x, ty = y, active = false;

    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.style.opacity = '1'; }
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      active = false;
      glow.style.opacity = '0';
    });

    (function loop() {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      glow.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      window.requestAnimationFrame(loop);
    })();
  })();

  /* ---------------- 入场动画 ---------------- */
  (function reveal() {
    var items = $$('.reveal');
    var groups = $$('.stagger');

    function mark(el, delay) {
      if (delay) el.style.transitionDelay = delay + 'ms';
      el.classList.add('is-visible');
    }

    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      groups.forEach(function (g) {
        $$(':scope > *', g).forEach(function (c) { c.classList.add('is-visible'); });
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        if (el.classList.contains('stagger')) {
          $$(':scope > *', el).forEach(function (child, i) {
            mark(child, i * 85);
          });
        } else {
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          mark(el, delay);
        }
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el) { io.observe(el); });
    groups.forEach(function (g) { io.observe(g); });
  })();

  /* ---------------- 数字滚动 ---------------- */
  (function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    function animate(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (reduceMotion) { el.textContent = String(target); return; }
      var start = performance.now();
      var dur = 1300;
      function tick(now) {
        var p = clamp((now - start) / dur, 0, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) window.requestAnimationFrame(tick);
        else el.textContent = String(target);
      }
      window.requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- 打字机 ---------------- */
  (function typewriter() {
    var el = $('#typed');
    if (!el) return;
    var lines = [
      '轻快启动 · 稳定下载 · 一键联机',
      'Python + PySide6 + QML 原生渲染',
      'Modrinth 模组直连，前置自动补全'
    ];
    if (reduceMotion) { el.textContent = lines[0]; return; }

    var li = 0, ci = 0, deleting = false;

    function step() {
      var line = lines[li];
      if (!deleting) {
        ci++;
        el.textContent = line.slice(0, ci);
        if (ci >= line.length) {
          deleting = true;
          return window.setTimeout(step, 1700);
        }
        return window.setTimeout(step, 72);
      }
      ci--;
      el.textContent = line.slice(0, ci);
      if (ci <= 0) {
        deleting = false;
        li = (li + 1) % lines.length;
        return window.setTimeout(step, 420);
      }
      return window.setTimeout(step, 34);
    }
    window.setTimeout(step, 900);
  })();

  /* ---------------- 卡片 3D 倾斜 + 光晕跟随 ---------------- */
  (function tiltCards() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    $$('.tilt').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 7).toFixed(2) +
          'deg) rotateY(' + ((px - 0.5) * 7).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () {
        card.style.transform = '';
      });
    });
  })();

  /* ---------------- 磁吸按钮 ---------------- */
  (function magnetic() {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return;
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transform = 'translate3d(' + (dx * 5).toFixed(2) + 'px,' + (dy * 4 - 2).toFixed(2) + 'px,0)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
      });
    });
  })();

  /* ---------------- 功能 Tab ---------------- */
  (function tabs() {
    var root = $('.showcase');
    if (!root) return;
    var btns = $$('.tab-btn', root);
    var panels = $$('.tab-panel', root);
    var indicator = $('#tabIndicator');
    var current = 0;
    var timer = null;
    var paused = false;

    function moveIndicator(btn) {
      if (!indicator || !btn) return;
      indicator.style.transform = 'translateY(' + (btn.offsetTop - 4) + 'px)';
      indicator.style.height = btn.offsetHeight + 'px';
    }

    function activate(idx) {
      idx = (idx + btns.length) % btns.length;
      current = idx;
      btns.forEach(function (b, i) {
        var on = i === idx;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function (p, i) { p.classList.toggle('is-active', i === idx); });
      moveIndicator(btns[idx]);
    }

    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        activate(i);
        restart();
      });
    });

    function restart() {
      if (reduceMotion) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        if (!paused && !document.hidden) activate(current + 1);
      }, 4800);
    }

    root.addEventListener('pointerenter', function () { paused = true; });
    root.addEventListener('pointerleave', function () { paused = false; });

    activate(0);
    window.setTimeout(function () { moveIndicator(btns[0]); }, 120);
    window.addEventListener('resize', function () { moveIndicator(btns[current]); });
    restart();
  })();

  /* ---------------- 流程进度 ---------------- */
  (function flow() {
    var wrapEl = $('.flow');
    var fill = $('#flowFill');
    var steps = $$('.flow-step');
    if (!wrapEl || !steps.length) return;

    function update() {
      var r = wrapEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = r.height || 1;
      var passed = clamp((vh * 0.78 - r.top) / total, 0, 1);
      if (fill) fill.style.width = (passed * 100).toFixed(1) + '%';

      steps.forEach(function (s, i) {
        var trigger = (i + 0.5) / steps.length;
        s.classList.toggle('is-lit', passed >= trigger - 0.08);
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------------- FAQ 手风琴 ---------------- */
  (function faq() {
    var items = $$('.faq-item');
    items.forEach(function (item) {
      var q = $('.faq-q', item);
      if (!q) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var ob = $('.faq-q', other);
          if (ob) ob.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  })();

  /* ---------------- 移动端菜单 ---------------- */
  (function mobileMenu() {
    var btn = $('#hamburger');
    var links = $('#navLinks');
    if (!btn || !links) return;

    function close() {
      links.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    $$('a', links).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  })();

  /* ---------------- 模拟启动状态 ---------------- */
  (function mockLoop() {
    var status = $('#mockStatus');
    if (!status || reduceMotion) return;
    var stages = ['启动中…', '校验资源…', '加载模组…', '进入世界…'];
    var i = 0;
    window.setInterval(function () {
      i = (i + 1) % stages.length;
      status.style.opacity = '0';
      window.setTimeout(function () {
        status.textContent = stages[i];
        status.style.opacity = '1';
      }, 180);
    }, 2200);
    status.style.transition = 'opacity .3s ease';
  })();

  /* ---------------- 下载占位链接提示 ---------------- */
  (function todoLinks() {
    $$('[data-todo]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (a.getAttribute('href') === '#') {
          e.preventDefault();
          var tip = a.getAttribute('data-todo');
          if (tip) window.alert('待配置：' + tip);
        }
      });
    });
  })();

})();
