console.log('ヾ(＾∇＾)');
const burger = document.querySelector('.navbar__checkbox'),
  slider = document.getElementById('slider'),
  sliderItems = document.getElementById('slides'),
  sliderList = document.querySelector('.slider__list'),
  petsBtns = document.querySelectorAll('.card-btn'),
  burgerBlackout = document.querySelector('.blackout'),
  popupBlackout = document.querySelector('.popup'),
  popup = document.querySelector('.popup__content'),
  navbar = document.querySelector('.navbar__list'),
  menuItems = document.querySelectorAll('.navbar__item'),
  prev = document.querySelector('.prev'),
  next = document.querySelector('.next');
let sliderCards = document.querySelectorAll('.slider__card');
const request = new XMLHttpRequest();

let pets = []; // 8
let fullPetsList = []; // 48

function disableScrollingOnBody() {
  if (burger.checked) {
    document.querySelector('html').classList.add('disable-scroll');
  } else {
    document.querySelector('html').classList.remove('disable-scroll');
  }
}

function closeOnBackgroundClick(innerElem, evt, action) {
  let targetEl = evt.target;
  do {
    if (targetEl == innerElem) {
      return;
    }

    targetEl = targetEl.parentNode;
  } while (targetEl);
  action;
}

function closeBurger() {
  burger.checked = false;
  disableScrollingOnBody();
}

function closePopup() {
  window.location.hash = '#pets';
  document.querySelector('html').classList.remove('disable-scroll');
}

function openPopup(id) {
  createPopup(id);

  window.location.hash = '#popup';
  document.querySelector('html').classList.add('disable-scroll');
}

function findElementByName(name) {
  fullPetsList.find((record) => {
    if (record.name === name) return true;
  });
}

//######################################################

request.open('GET', '../../pets.json');

request.onload = () => {
  console.log(request.response);
};

fetch('../../pets.json')
  .then((res) => res.json())
  .then((list, row = 3) => {
    pets = list;

    fullPetsList = (() => {
      let tempArr = [];

      for (let i = 0; i < row; i++) {
        const newPets = pets;

        for (let j = pets.length; j > 0; j--) {
          let randInd = Math.floor(Math.random() * j);
          const randElem = newPets.splice(randInd, 1)[0];
          newPets.push(randElem);
        }

        tempArr = [ ...tempArr, ...newPets ];
      }
      return tempArr;
    })();

    fullPetsList = sort863(fullPetsList);

    createSlides(fullPetsList);
  })
  .then(() => {
    sliderCards.forEach((item) => {
      let id = item.dataset.id;
      // console.log(id);
      item.addEventListener('click', () => openPopup(id));
    });
  })
  .then(
    () =>
      (swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        // spaceBetween: 30,
        loop: true,
        navigation: {
          nextEl: '.next',
          prevEl: '.prev'
        }
      }))
  );

request.onload = () => {
  pets = JSON.parse(request.response);
};

request.send();

const sort863 = (list) => {
  let unique8List = [];
  let length = list.length;
  for (let i = 0; i < length / 8; i++) {
    const uniqueStepList = [];
    for (j = 0; j < list.length; j++) {
      if (uniqueStepList.length >= 8) {
        break;
      }
      const isUnique = !uniqueStepList.some((item) => {
        return item.name === list[j].name;
      });
      if (isUnique) {
        uniqueStepList.push(list[j]);
        list.splice(j, 1);
        j--;
      }
    }
    unique8List = [ ...unique8List, ...uniqueStepList ];
  }
  list = unique8List;

  list = sort6recursively(list);

  return list;
};

const sort6recursively = (list) => {
  const length = list.length;

  for (let i = 0; i < length / 6; i++) {
    const stepList = list.slice(i * 6, i * 6 + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && ind !== j;
      });

      if (duplicatedItem !== undefined) {
        const ind = i * 6 + j;
        const which8OfList = Math.trunc(ind / 8);

        list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

        sort6recursively(list);
      }
    }
  }

  console.log(list);
  return list;
};
//########## slider ###########\

//######

createCard = (cardList) => {
  let str = '';
  for (let i = 0; i < cardList.length; i++) {
    str += `
    <li data-id="${cardList[i].name}" class="slider__card">
      <img class="slider__card__img" src="${cardList[i].img}" alt="${cardList[i].type} photo">
      <h4 class="slider__card__heading">
        ${cardList[i].name}
      </h4>
      <a href="#popup" class="card-btn btn__secondary">
        Learn more
      </a>
    </li>`;
  }
  return str;
};

createSlides = (slideList) => {
  const elem = document.querySelector('.swiper-wrapper');
  let cardsInSlide = 1;
  elem.innerHTML = '';
  if (document.querySelector('html').offsetWidth >= 1280) {
    cardsInSlide = 3;
  } else if (document.querySelector('html').offsetWidth >= 768) {
    cardsInSlide = 2;
  }
  console.log('cardsInSlide', cardsInSlide, 'width', document.querySelector('html').offsetWidth);
  for (let i = 0; i < slideList.length; i += cardsInSlide) {
    const cardList = slideList.slice(i, i + cardsInSlide);
    elem.innerHTML += `<ul class="slide swiper-slide">${createCard(cardList)}</ul>`;
  }

  sliderCards = document.querySelectorAll('.slider__card');
};

//########## createPopup

function createPopup(name) {
  //find pet info by id
  let card;

  fullPetsList.find((record) => {
    if (record.name === name) card = record;
  });

  console.log(card);
  const elem = document.querySelector('.popup__wrapper');
  elem.innerHTML = ` 
  <a href="#pets" class="popup__close btn-arrow"><img  src="../../assets/icons/Vector.svg" alt="X"></a>
  <div class="popup__content">
  <div class="popup__image">
    <img src="${card.img}" alt="${card.type}">
  </div>
  <div class="popup__text">
    <div class="popup__pet-logo">
      <h3 class="popup__heading">
      ${card.name}
      </h3>
      <h4 class="popup__subheading">
      ${card.type} - ${card.breed}
      </h4>
    </div>
    <p class="popup__p">
      ${card.description}
    </p>
    <ul class="popup__list">
      <li class="popup__list-item">
        <h5 class="popup__list-item-h5">Age: </h5>${card.age}
      </li>
      <li class="popup__list-item">
        <h5 class="popup__list-item-h5">
          Inoculations: 
        </h5>
        ${card.inoculations.join(', ') || none}
      </li>
      <li class="popup__list-item">
        <h5 class="popup__list-item-h5">
          Diseases: 
        </h5>
        ${card.diseases.join(', ') || none}
      </li>
      <li class="popup__list-item">
        <h5 class="popup__list-item-h5">
          Parasites: 
        </h5>
        ${card.parasites.join(', ') || none}
      </li>
    </ul>
  </div>`;
}

burger.addEventListener('change', disableScrollingOnBody);
burgerBlackout.addEventListener('click', (evt) =>
  closeOnBackgroundClick(navbar, evt, closeBurger())
);
popupBlackout.addEventListener('click', (evt) => closeOnBackgroundClick(popup, evt, closePopup()));
menuItems.forEach((item) => {
  item.addEventListener('click', () => (burger.checked = false));
});

window.addEventListener('resize', () => createSlides(fullPetsList));
sliderCards.forEach((item) => {
  console.log(item.dataset.id);
  item.addEventListener('click', openPopup);
});

let swiper;
