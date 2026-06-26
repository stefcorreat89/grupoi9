// ===== Grupo i9 — scripts compartilhados =====
// TROQUE o número aqui se mudar o WhatsApp:
var I9_WA = "5585920091906";

(function () {
  // menu mobile
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  if (burger && menu) {
    burger.addEventListener("click", function () { menu.classList.toggle("open"); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  // FAQ acordeão
  document.querySelectorAll(".q button").forEach(function (b) {
    b.addEventListener("click", function () {
      var q = b.parentElement, ans = q.querySelector(".ans"), open = q.classList.contains("open");
      document.querySelectorAll(".q").forEach(function (o) {
        o.classList.remove("open"); o.querySelector(".ans").style.maxHeight = null;
      });
      if (!open) { q.classList.add("open"); ans.style.maxHeight = ans.scrollHeight + "px"; }
    });
  });

  // reveal on scroll
  if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // formulário -> WhatsApp e E-mail (via FormSubmit AJAX)
  var form = document.getElementById("leadForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = (form.nome.value || "").trim();
      var fone = (form.fone.value || "").trim();
      var local = (form.local.value || "").trim();
      var servico = form.servico.value || "";
      var det = (form.detalhe ? form.detalhe.value : "").trim();
      var pagina = form.getAttribute("data-pagina") || "site";

      var msg = "Olá! Quero atendimento para um desentupimento.\n";
      if (nome) msg += "\nNome: " + nome;
      if (fone) msg += "\nTelefone: " + fone;
      if (local) msg += "\nCidade/Bairro: " + local;
      if (servico) msg += "\nServiço: " + servico;
      if (det) msg += "\nDetalhes: " + det;
      msg += "\n\nOrigem: " + pagina; // rastreio de origem do lead

      // 1. Enviar e-mail via FormSubmit em background (AJAX)
      var emailPayload = {
        "Nome": nome,
        "Telefone": fone,
        "Cidade/Bairro": local,
        "Serviço solicitado": servico,
        "Detalhes adicionais": det,
        "Página de Origem": pagina,
        "_subject": "Novo Orçamento - Grupo i9 Desentupidora",
        "_captcha": "false"
      };

      fetch("https://formsubmit.co/ajax/grupoi9desentupidora@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(emailPayload)
      }).catch(function (err) {
        console.error("Erro ao enviar lead por e-mail:", err);
      });

      // 2. Abrir WhatsApp síncronamente (evita bloqueador de popups)
      var url = "https://wa.me/" + I9_WA +
        "?text=" + encodeURIComponent(msg) +
        "&utm_source=site&utm_medium=whatsapp&utm_campaign=" + encodeURIComponent(pagina);
      window.open(url, "_blank");
    });
  }

  // depoimentos em carrossel
  (function () {
    var track = document.querySelector('.revs-track');
    if (!track) return;
    var cards = Array.from(track.children);
    var prevBtn = document.querySelector('.revs-btn.prev');
    var nextBtn = document.querySelector('.revs-btn.next');
    var dotsContainer = document.querySelector('.revs-dots');
    if (!prevBtn || !nextBtn || !dotsContainer) return;
    
    var currentIndex = 0;
    var cardsPerPage = 3;
    
    function updateLayout() {
      var width = window.innerWidth;
      if (width <= 600) {
        cardsPerPage = 1;
      } else if (width <= 900) {
        cardsPerPage = 2;
      } else {
        cardsPerPage = 3;
      }
      
      var maxIndex = cards.length - cardsPerPage;
      if (currentIndex > maxIndex) {
        currentIndex = Math.max(0, maxIndex);
      }
      
      createDots();
      moveToSlide(currentIndex);
    }
    
    function createDots() {
      dotsContainer.innerHTML = '';
      var totalDots = cards.length - cardsPerPage + 1;
      if (totalDots <= 1) {
        dotsContainer.style.display = 'none';
        return;
      }
      dotsContainer.style.display = 'flex';
      for (var i = 0; i < totalDots; i++) {
        (function (index) {
          var dot = document.createElement('div');
          dot.classList.add('revs-dot');
          if (index === currentIndex) dot.classList.add('active');
          dot.addEventListener('click', function () {
            currentIndex = index;
            moveToSlide(currentIndex);
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }
    
    function moveToSlide(index) {
      if (cards.length === 0) return;
      var gap = 18;
      var cardWidth = cards[0].getBoundingClientRect().width;
      var amountToMove = (cardWidth + gap) * index;
      track.style.transform = 'translateX(-' + amountToMove + 'px)';
      
      // Update dots
      var dots = Array.from(dotsContainer.children);
      dots.forEach(function (dot, i) {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Disable/Enable buttons
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index >= (cards.length - cardsPerPage);
    }
    
    prevBtn.addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex--;
        moveToSlide(currentIndex);
      }
    });
    
    nextBtn.addEventListener('click', function () {
      if (currentIndex < (cards.length - cardsPerPage)) {
        currentIndex++;
        moveToSlide(currentIndex);
      }
    });
    
    window.addEventListener('resize', updateLayout);
    updateLayout();
  })();
})();
