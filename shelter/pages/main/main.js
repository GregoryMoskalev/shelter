console.log('ヾ(＾∇＾)');
const burger = document.querySelector('.navbar__checkbox');

burger.addEventListener('change', disableScrollingOnBody);

function disableScrollingOnBody() {
  if (burger.checked) {
    document.body.classList.add('disable-scroll');
  } else {
    document.body.classList.remove('disable-scroll');
  }
  console.log(document.body.classList);
}
