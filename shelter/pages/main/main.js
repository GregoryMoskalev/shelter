console.log('ヾ(＾∇＾)');
const burger = document.querySelector('.navbar__checkbox'),
  petsBtns = document.querySelectorAll('.card-btn'),
  burgerBlackout = document.querySelector('.blackout'),
  navbar = document.querySelector('.navbar__list'),
  menuItems = document.querySelectorAll('.navbar__item');

burger.addEventListener('change', disableScrollingOnBody);
burgerBlackout.addEventListener('click', closeMenu);
menuItems.forEach((item) => {
  item.addEventListener('click', () => (burger.checked = false));
});

function disableScrollingOnBody() {
  if (burger.checked) {
    document.body.classList.add('disable-scroll');
  } else {
    document.body.classList.remove('disable-scroll');
  }
}

function closeMenu(evt) {
  console.log(evt);
  let targetEl = evt.target;
  do {
    if (targetEl == navbar) {
      return;
    }

    targetEl = targetEl.parentNode;
  } while (targetEl);
  burger.checked = false;
}
