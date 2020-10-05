const addBut = document.querySelector('.add-button');
let names = document.querySelectorAll('.unit-name');
let prices = document.querySelectorAll('.unit-price');
let actions = document.querySelectorAll('.unit-action');
let editButns = document.querySelectorAll('.edit-button');
let delButns = document.querySelectorAll('.delete-button');
const editForm = document.querySelector('.edit-form');
const saveBut = document.querySelector('.button-save');
const cancelBut = document.querySelector('.button-cancel');
const nameInp = document.querySelector('.edit-name-input');
const priceInp = document.querySelector('.edit-price-input');
const hidName = document.querySelector('.hidden-name');
const hidPriceE = document.querySelector('.hidden-price-empty');
const hidPriceV = document.querySelector('.hidden-price-zero');
let namesList = document.querySelector('.names-list');
let pricesList = document.querySelector('.prices-list');
let actionsList = document.querySelector('.actions-list');
let editMode = '';
let activeElId;
let lastId = 0;

function idCounter() {
  if (editButns.length > 0) {
    const arr = [];
    editButns.forEach((el) => { arr.push(Number(el.id)); });
    lastId = Math.max.apply(null, arr);
  }
  lastId += 1;
  return lastId;
}


function openEditForm(event) {
  if (event.target === addBut) {
    editMode = 'add';
    editForm.style.display = 'block';
  } else if (Array.from(editButns).includes(event.target)) {
    editMode = 'edit';
    editForm.style.display = 'block';
    const idEl = event.target.id;
    nameInp.value = JSON.parse(localStorage.getItem(event.target.id)).name;
    priceInp.value = JSON.parse(localStorage.getItem(event.target.id)).price;
    activeElId = idEl;
  }
}


function refreshList() {
  editButns.forEach((el) => {
    el.removeEventListener('click', openEditForm);
  });
  delButns.forEach((el) => {
    // eslint-disable-next-line no-use-before-define
    el.removeEventListener('click', delElemFromList);
  });
  editButns = document.querySelectorAll('.edit-button');
  delButns = document.querySelectorAll('.delete-button');
  namesList = document.querySelector('.names-list');
  pricesList = document.querySelector('.prices-list');
  actionsList = document.querySelector('.actions-list');
  names = document.querySelectorAll('.unit-name');
  prices = document.querySelectorAll('.unit-price');
  actions = document.querySelectorAll('.unit-action');
  editButns.forEach((el) => {
    el.addEventListener('click', openEditForm);
  });
  delButns.forEach((el) => {
    // eslint-disable-next-line no-use-before-define
    el.addEventListener('click', delElemFromList);
  });
}

function delElemFromList(event) {
  const idEl = event.target.closest('.unit-action').querySelector('.edit-button').id;
  localStorage.removeItem(`${idEl}`);
  let curI;
  delButns.forEach((elem, i) => {
    if (elem === event.target) curI = i;
  });
  names[curI].remove();
  prices[curI].remove();
  actions[curI].remove();
  refreshList();
}


function addElemToList(n, p, id) {
  const strName = `<div class="list-element name unit-name">${n}</div>`;
  const strPrice = `<div class="list-element price unit-price">${p}</div>`;
  const strAction = `<div class="list-element action unit-action">
  <button class="edit-button button" id="${id}"></button>
  <button class="delete-button button"></button>
</div>`;
  namesList.insertAdjacentHTML('beforeend', strName);
  pricesList.insertAdjacentHTML('beforeend', strPrice);
  actionsList.insertAdjacentHTML('beforeend', strAction);
  refreshList();
}


function init() {
  for (const key in localStorage) {
    if (Number.isInteger(Number(key))) {
      const { name } = JSON.parse(localStorage.getItem(key));
      const { price } = JSON.parse(localStorage.getItem(key));
      addElemToList(name, price, key);
    }
  }
  refreshList();
}

init();
function formClose() {
  nameInp.value = '';
  priceInp.value = '';
  editForm.style.display = 'none';
  editMode = '';
}


function refreshElement(id, name, price) {
  names[id].textContent = name;
  prices[id].textContent = price;
}

function showHidden(inp, hid) {
  const hidden = hid;
  const input = inp;
  hidden.style.display = 'block';
  const { top, left } = inp.getBoundingClientRect();
  hidden.style.top = `${window.scrollY + input.offsetHeight + top}px`;
  hidden.style.left = `${window.scrollX + left}px`;
}


addBut.addEventListener('click', openEditForm);

editButns.forEach((el) => {
  el.addEventListener('click', openEditForm);
});


delButns.forEach((el) => {
  el.addEventListener('click', delElemFromList);
});

cancelBut.addEventListener('click', formClose);

saveBut.addEventListener('click', () => {
  if (nameInp.value === '') {
    showHidden(nameInp, hidName);
  }
  if (priceInp.value === '') {
    showHidden(priceInp, hidPriceE);
  } else if (priceInp.value <= 0) {
    showHidden(priceInp, hidPriceV);
  } else {
    const obj = JSON.stringify({
      name: nameInp.value,
      price: Number(priceInp.value),
    });
    if (editMode === 'add') {
      const idStore = idCounter();
      localStorage.setItem(`${idStore}`, obj);
      addElemToList(nameInp.value, priceInp.value, lastId);
      formClose();
    } else if (editMode === 'edit') {
      localStorage.setItem(`${activeElId}`, obj);
      let curI;
      editButns.forEach((el, i) => {
        if (el.id === activeElId) curI = i;
      });
      refreshElement(curI, nameInp.value, priceInp.value);
      formClose();
    }
  }
});

nameInp.addEventListener('input', () => {
  hidName.style.display = 'none';
});

priceInp.addEventListener('input', () => {
  hidPriceE.style.display = 'none';
  hidPriceV.style.display = 'none';
});
