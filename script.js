(() => {
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  const tracks = {
    web: {
      i: '01 / WEB DEVELOPMENT',
      title: 'Build for the browser.',
      text: 'Start with semantic HTML and responsive CSS, then add Bootstrap and JavaScript until you can produce complete front-end websites.',
      skills: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'Responsive UI']
    },
    design: {
      i: '02 / GRAPHIC DESIGN',
      title: 'Make information visible.',
      text: 'Learn hierarchy, typography, colour, composition and how to turn a brief into a consistent visual system.',
      skills: ['Typography', 'Layout', 'Brand systems', 'Social design']
    },
    ui: {
      i: '03 / UI / UX',
      title: 'Design the path, not just the screen.',
      text: 'Structure user flows, responsive interfaces and interaction patterns that make products easier to understand and use.',
      skills: ['User flows', 'Wireframes', 'Interface systems', 'Responsive design']
    },
    marketing: {
      i: '04 / DIGITAL MARKETING',
      title: 'Understand the audience.',
      text: 'Learn content, search, social and campaign fundamentals so creative work connects with actual business goals.',
      skills: ['Content', 'Social', 'SEO basics', 'Campaigns']
    },
    video: {
      i: '05 / VIDEO EDITING',
      title: 'Control time and attention.',
      text: 'Use cuts, sound, captions and pacing to turn raw footage into clear, watchable stories.',
      skills: ['Editing', 'Sound', 'Captions', 'Short-form video']
    }
  };

  const schedules = {
    mon: [
      ['Web Development', '10:00 — 12:00', '2', '5', '#e9f0ff'],
      ['UI / UX', '13:00 — 15:00', '7', '4', '#e8f7ee']
    ],
    tue: [
      ['Graphic Design', '10:00 — 12:00', '1', '5', '#fff2c2'],
      ['Video Editing', '16:00 — 18:00', '7', '5', '#ffd9d2']
    ],
    wed: [
      ['Web Development', '10:00 — 12:00', '2', '5', '#e9f0ff'],
      ['Digital Marketing', '15:00 — 17:00', '8', '4', '#fff2c2']
    ],
    thu: [
      ['Graphic Design', '10:00 — 12:00', '1', '5', '#fff2c2'],
      ['Video Editing', '16:00 — 18:00', '7', '5', '#ffd9d2']
    ],
    sat: [
      ['UI / UX', '11:00 — 13:00', '2', '5', '#e8f7ee'],
      ['Web Development', '14:00 — 16:00', '7', '5', '#e9f0ff']
    ]
  };

  /* Track dialog */
  const trackDialog = $('#trackDialog');

  function openTrack(key) {
    const track = tracks[key];
    if (!track || !trackDialog) return;

    $('#trackIndex').textContent = track.i;
    $('#trackTitle').textContent = track.title;
    $('#trackText').textContent = track.text;
    $('#trackSkills').innerHTML = track.skills.map(skill => `<span>${skill}</span>`).join('');
    trackDialog.showModal();
  }

  $$('[data-track]').forEach(button => {
    button.addEventListener('click', () => openTrack(button.dataset.track));
  });

  $$('[data-track-card]').forEach(article => {
    const highlight = active => {
      $$('[data-track]').forEach(node => {
        node.classList.toggle('focus', active && node.dataset.track === article.dataset.trackCard);
      });
    };

    article.addEventListener('mouseenter', () => highlight(true));
    article.addEventListener('mouseleave', () => highlight(false));
  });

  $('[data-close-track]')?.addEventListener('click', () => trackDialog.close());

  /* Application dialog */
  const applyDialog = $('#applyDialog');
  const applyProgram = $('#applyProgram');

  function openApply(programName = '') {
    if (!applyDialog) return;
    if (trackDialog?.open) trackDialog.close();
    if (programName && applyProgram) applyProgram.value = programName;
    applyDialog.showModal();
  }

  $$('[data-apply]').forEach(button => {
    button.addEventListener('click', () => openApply());
  });

  $$('[data-apply-program]').forEach(button => {
    button.addEventListener('click', () => openApply(button.dataset.applyProgram));
  });

  $('[data-close-apply]')?.addEventListener('click', () => applyDialog.close());

  $('#applyForm')?.addEventListener('submit', event => {
    event.preventDefault();
    applyDialog.close();
    event.currentTarget.reset();
    toast('Application request captured for this demo.');
  });

  function toast(message) {
    const element = $('#schoolToast');
    if (!element) return;

    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove('show'), 2300);
  }

  /* Schedule */
  function renderSchedule(day = 'mon') {
    const grid = $('#scheduleGrid');
    if (!grid) return;

    grid.innerHTML = schedules[day].map((item, index) => `
      <article
        class="class-block"
        style="--start:${item[2]};--span:${item[3]};--row:${index + 1};--color:${item[4]}"
      >
        <span>${day.toUpperCase()} / CLASS ${String(index + 1).padStart(2, '0')}</span>
        <h3>${item[0]}</h3>
        <p>${item[1]}</p>
      </article>
    `).join('');
  }

  renderSchedule();

  $$('.schedule-days button').forEach(button => {
    button.addEventListener('click', () => {
      $$('.schedule-days button').forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      renderSchedule(button.dataset.day);
    });
  });

  /* FAQ accordion with smooth height transition */
  $$('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      $$('.faq-item.open').forEach(openItem => {
        if (openItem === item) return;
        openItem.classList.remove('open');
        $('.faq-question', openItem)?.setAttribute('aria-expanded', 'false');
      });

      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* Mobile navigation */
  const menuButton = $('.school-menu');
  const mobileNav = $('.school-mobile-nav');

  menuButton?.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
  });

  $$('a, button[data-apply]', mobileNav).forEach(control => {
    control.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  /* Subtle scroll reveal */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    ...$$('.section-heading'),
    ...$$('.program-ledger article'),
    $('.method-left'),
    ...$$('.method-path article'),
    $('.schedule-shell'),
    $('.proof-statement'),
    ...$$('.proof-notes > div'),
    $('.faq-intro'),
    ...$$('.faq-item'),
    $('.footer-main')
  ].filter(Boolean);

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.dataset.delay = String(index % 4);
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: .12,
      rootMargin: '0px 0px -6% 0px'
    });

    revealTargets.forEach(element => observer.observe(element));
  }

/* Curriculum connections — interactive skill relationships. */
const canvas = $('#learningMap');
const board = $('#curriculumBoard');

if (canvas && board) {
  const context = canvas.getContext('2d');

  let pointer = {
    x: -999,
    y: -999
  };

  let activeNode = -1;

  let boardRect = board.getBoundingClientRect();

  const resize = () => {
    const density = Math.min(window.devicePixelRatio || 1, 1.5);

    boardRect = board.getBoundingClientRect();

    canvas.width = boardRect.width * density;
    canvas.height = boardRect.height * density;

    canvas.style.width = `${boardRect.width}px`;
    canvas.style.height = `${boardRect.height}px`;

    context.setTransform(
      density,
      0,
      0,
      density,
      0,
      0
    );
  };

  new ResizeObserver(resize).observe(board);

  board.addEventListener('pointermove', event => {
    const rect = board.getBoundingClientRect();

    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  });

  board.addEventListener('pointerleave', () => {
    pointer = {
      x: -999,
      y: -999
    };
  });


  /* Detect which curriculum node is being hovered */
  const boardNodes = $$('.node', board);

  boardNodes.forEach((node, index) => {
    node.addEventListener('pointerenter', () => {
      activeNode = index;
    });

    node.addEventListener('pointerleave', () => {
      activeNode = -1;
    });

    /* Also works for keyboard users */
    node.addEventListener('focus', () => {
      activeNode = index;
    });

    node.addEventListener('blur', () => {
      activeNode = -1;
    });
  });


  /*
    Connection indexes:
  */
const primaryPairs = [
  [0, 2], // Web ↔ UI/UX
  [1, 2], // Graphic Design ↔ UI/UX
  [2, 3], // UI/UX ↔ Marketing
  [2, 4], // UI/UX ↔ Video
  [0, 3], // Web ↔ Marketing
  [1, 4]  // Graphic Design ↔ Video
];

/*
  These stay hidden normally.
  They appear only when one of the related skills is hovered.
*/
const secondaryPairs = [
  {
    start: 0,
    end: 1,
    bend: 55
  }, // Web ↔ Graphic Design

  {
    start: 3,
    end: 4,
    bend: -55
  } // Marketing ↔ Video Editing
];


  const draw = () => {
    const currentBoard = board.getBoundingClientRect();

    const nodes = $$('.node', board).map(node => {
      const rect = node.getBoundingClientRect();

      return {
        x: rect.left - currentBoard.left + rect.width / 2,
        y: rect.top - currentBoard.top + rect.height / 2
      };
    });


    context.clearRect(
      0,
      0,
      currentBoard.width,
      currentBoard.height
    );


    primaryPairs.forEach(([start, end], index) => {
      const a = nodes[start];
      const b = nodes[end];

      if (!a || !b) return;


      /* Mouse close to the middle of a connection */
      const near = Math.hypot(
        pointer.x - (a.x + b.x) / 2,
        pointer.y - (a.y + b.y) / 2
      ) < 130;


      /* Does the hovered skill belong to this connection? */
      const connected =
        activeNode === start ||
        activeNode === end;


      context.beginPath();
      context.moveTo(a.x, a.y);

      const controlX =
        (a.x + b.x) / 2 +
        (index % 2 ? 28 : -28);

      const controlY =
        (a.y + b.y) / 2;

      context.quadraticCurveTo(
        controlX,
        controlY,
        b.x,
        b.y
      );


      /* Connection appearance */
      if (connected) {
        context.strokeStyle = 'rgba(239,98,73,.95)';
        context.lineWidth = 2.4;
      }

      else if (near) {
        context.strokeStyle = 'rgba(239,98,73,.72)';
        context.lineWidth = 1.8;
      }

      else {
        context.strokeStyle = 'rgba(22,93,255,.38)';
        context.lineWidth = 1;
      }


      context.stroke();
    });

    /* Contextual relationships — only appear on hover */
secondaryPairs.forEach(({ start, end, bend }) => {

  const connected =
    activeNode === start ||
    activeNode === end;

  if (!connected) return;

  const a = nodes[start];
  const b = nodes[end];

  if (!a || !b) return;

  context.beginPath();
  context.moveTo(a.x, a.y);

  const controlX =
    (a.x + b.x) / 2;

  const controlY =
    (a.y + b.y) / 2 + bend;

  context.quadraticCurveTo(
    controlX,
    controlY,
    b.x,
    b.y
  );

  context.strokeStyle = 'rgba(239,98,73,.9)';
  context.lineWidth = 2.2;

  /* Makes contextual relationships visually different */
  context.setLineDash([7, 5]);

  context.stroke();

  /* IMPORTANT: reset so normal lines stay solid */
  context.setLineDash([]);
});


    requestAnimationFrame(draw);
  };


  resize();
  draw();
}
})();
