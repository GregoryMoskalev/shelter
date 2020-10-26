console.log('ヾ(＾∇＾)');
const burger = document.querySelector('.navbar__checkbox'),
  petsBtns = document.querySelectorAll('.card-btn'),
  burgerBlackout = document.querySelector('.blackout'),
  popupBlackout = document.querySelector('.popup'),
  popup = document.querySelector('.popup__content'),
  navbar = document.querySelector('.navbar__list'),
  menuItems = document.querySelectorAll('.navbar__item');

let cards = document.querySelectorAll('.card');
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
  .then((list, row = 6) => {
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
    console.log(pets.length);
    fullPetsList = sort863(fullPetsList);

    createPage(fullPetsList);
  })
  .then(() => {
    cards.forEach((item) => {
      let id = item.dataset.id;
      // console.log(id);
      item.addEventListener('click', () => openPopup(id));
    });
  })
  .then(() => {
    disableNavBtns();
  });

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

//######

createCard = (cardList) => {
  let str = '';
  for (let i = 0; i < cardList.length; i++) {
    str += `
    <div data-id="${cardList[i].name}" class="card">
      <img class="card__img" src="${cardList[i].img}" alt="${cardList[i].type} photo">
      <h4 class="card__heading">
        ${cardList[i].name}
      </h4>
      <a href="#popup" class="card-btn btn__secondary">
        Learn more
      </a>
    </div>`;
  }
  return str;
};

createPage = (slideList) => {
  const elem = document.getElementById('cards-container');
  let cardsInPage = 3;
  elem.innerHTML = '';
  if (document.querySelector('html').offsetWidth >= 1280) {
    cardsInPage = 8;
  } else if (document.querySelector('html').offsetWidth >= 768) {
    cardsInPage = 6;
  }
  console.log('cardsInPage', cardsInPage, 'width', document.querySelector('html').offsetWidth);
  for (let i = 0; i < slideList.length; i += cardsInPage) {
    const cardList = slideList.slice(i, i + cardsInPage);
    elem.innerHTML += `<div class="page">${createCard(cardList)}</div>`;
  }

  cards = document.querySelectorAll('.card');
};

//########## createPopup

function createPopup(name) {
  console.log('inside createPopup');
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

//#######################
const pageNumber = document.getElementById('pageNumber');
let currentPage = 0;

function disableNavBtns() {
  console.log(
    'pageNumber',
    pageNumber.innerHTML,
    pageNumber.innerHTML == 1,
    +pageNumber.innerHTML == document.querySelectorAll('.page').length
  );
  if (+pageNumber.innerHTML == 1) {
    console.log('dis prev btns');
    document.getElementById('btn_first').disabled = true;
    document.getElementById('btn_prev').disabled = true;
  } else {
    document.getElementById('btn_first').disabled = false;
    document.getElementById('btn_prev').disabled = false;
  }

  if (+pageNumber.innerHTML == document.querySelectorAll('.page').length) {
    document.getElementById('btn_last').disabled = true;
    document.getElementById('btn_next').disabled = true;
  } else {
    document.getElementById('btn_last').disabled = false;
    document.getElementById('btn_next').disabled = false;
  }
}

setTimeout(() => {
  let lastPage = document.querySelectorAll('.page').length;
  console.log('last page', lastPage);
}, 1000);

document.querySelector('.cards-container').style.bottom = '0px';
document.getElementById('btn_next').addEventListener('click', () => {
  const pages = document.querySelectorAll('.page');

  if (
    currentPage <
    document.querySelector('.cards-container').offsetHeight / pages[0].offsetHeight - 1
  ) {
    currentPage++;
    console.log(currentPage);
  }

  document.querySelector('.cards-container').style.bottom = `calc(${pages[0].offsetHeight *
    currentPage}px)`;
  pageNumber.innerHTML = currentPage + 1;
  disableNavBtns();
});

document.getElementById('btn_first').addEventListener('click', () => {
  currentPage = 0;

  document.querySelector('.cards-container').style.bottom = 0;
  pageNumber.innerHTML = currentPage + 1;
  disableNavBtns();
});

document.getElementById('btn_last').addEventListener('click', () => {
  const pages = document.querySelectorAll('.page');
  currentPage = document.querySelectorAll('.page').length - 1;

  document.querySelector('.cards-container').style.bottom = `calc(${pages[0].offsetHeight *
    currentPage}px)`;
  pageNumber.innerHTML = currentPage + 1;
  disableNavBtns();
});

document.getElementById('btn_prev').addEventListener('click', () => {
  const pages = document.querySelectorAll('.page');
  if (currentPage > 0) {
    currentPage--;
    console.log(currentPage - 1);
  }

  document.querySelector('.cards-container').style.bottom = `calc(${pages[0].offsetHeight *
    currentPage}px)`;
  pageNumber.innerHTML = currentPage + 1;
  disableNavBtns();
});

//#######################

burger.addEventListener('change', disableScrollingOnBody);
burgerBlackout.addEventListener('click', (evt) =>
  closeOnBackgroundClick(navbar, evt, closeBurger())
);
popupBlackout.addEventListener('click', (evt) => closeOnBackgroundClick(popup, evt, closePopup()));
menuItems.forEach((item) => {
  item.addEventListener('click', () => (burger.checked = false));
});

window.addEventListener('resize', () => createPage(fullPetsList));
cards.forEach((item) => {
  console.log(item.dataset.id);
  item.addEventListener('click', openPopup);
});

///
