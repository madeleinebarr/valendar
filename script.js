// selecting datebar and appending todaysdate

const datebar = document.querySelector('.datebar');
const todaysdate = document.createElement('p');
todaysdate.classList.add('centertext', 'todaysdate');

const date = new Date();
const dateString = date.toString();

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

todaysdate.textContent = formatDate(dateString);

// datebar.appendChild(todaysdate);
datebar.insertAdjacentElement('afterbegin', todaysdate);

// calculating percentage of way through year

// converts current time to milliseconds since unix epoch
const nowMS = Date.now();

// constructs new Date with the current year, January(0) 1
// converts to milliseconds with .getTime()
const yearStartMS = new Date(new Date().getFullYear(), 0, 1).getTime();

// constructs new Date with the current year, December(11) 31
// converts to milliseconds with .getTime()
const yearEndMS = new Date(new Date().getFullYear(), 11, 31).getTime();

// time since year started divided by length of year * 100 to get percentage
const yearPercentage = ((nowMS - yearStartMS) / (yearEndMS - yearStartMS) * 100);

// calculating percentage of way through month

const monthStartMS = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();

// setting day parameter to 0 means less than the first day of the month which
// is the last day of the previous month which is why we add 1 to the month
const monthEndMS = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime();

const monthPercentage = ((nowMS - monthStartMS) / (monthEndMS - monthStartMS) * 100);

const yearProgress = document.createElement('p');
const monthProgress = document.createElement('p');

yearProgress.classList.add('centertext');
monthProgress.classList.add('centertext');

monthProgress.textContent = `${Math.floor(monthPercentage)}% through month`;
yearProgress.textContent = `${Math.floor(yearPercentage)}% through year`;

datebar.appendChild(monthProgress);
datebar.appendChild(yearProgress);

// javascript for creating the squares

// const squares = document.querySelector('.squares');

// for (let i = 1; i < 365; i++) {
//     const level = Math.floor(Math.random() * 4);
//     squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
// }

// testing something out
// means we'll be able to do some kind of calculation to only populate
// the days that the user has already filled out

// const squares = document.querySelector('.squares');

// for (let i = 1; i < 2; i++) {
//     const level = Math.floor(Math.random() * 4);
//     squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
// }

// for (let i = 2; i < 3; i++) {
//     const level = Math.floor(Math.random() * 4);
//     squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
// }

// we will be able to insert specific colors on specific days

/*
how you do a multiline
comment? yes */

// shopping list (goals list)

// selecting the items we need: shopping form and list

// const testingHyphen = document.querySelector(['.weekly-goals-list']);

const weeklyGoalsForm = document.querySelector('.weeklyGoals');
const weeklyList = document.querySelector('.weeklyList');

const monthlyGoalsForm = document.querySelector('.monthlyGoals');
const monthlyList = document.querySelector('.monthlyList');

// need an array to hold all of our items (our state)

let weeklyItems = [];
const monthlyItems = [];

// listen for a submit event on the form and do a bunch of stuff when that happens
// here, the e being passed in is the event

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  if (!name) { return; }
  console.log(name);

  const item = {
    name,
    id: Date.now(),
    complete: false,
  };

  // weeklyItems.push(item);
  // console.log(`There are now ${weeklyItems.length} weekly items in your state`);

  // commenting out to try to pass in parameter
  const pushItems = () => {
    // console.log(this.classList[0] === 'weeklyGoals');
    if (this.classList[0] === 'weeklyGoals') {
      weeklyItems.push(item);
      console.log(`There are now ${weeklyItems.length} weekly items in your state`);
      console.log('You are on the weekly goals list');
      weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else if (this.classList[0] === 'monthlyGoals') {
      monthlyItems.push(item);
      console.log(`There are now ${monthlyItems.length} monthly items in your state`);
      console.log('You are on the monthly goals list');
      monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else {
      console.log('It appears you are not on any list');
    }
  };

  pushItems();

  // clear the form
  // e.currentTarget.item.value = '';
  // the target is the form
  e.target.reset();

  // fire off a custom event that will tell
  // anyone else who cares that the items have been updated

  // ORIGINAL VERY IMPORTANT-- TRYING SOMETHING NEW
  // weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  // this.nextElementSibling.dispatchEvent(new CustomEvent('itemsUpdated'));

  // console.log(this.classList[0]);
  // console.log(this.classList[0].toString());
  // console.log(`.${this.classList[0]}`);

  // console.log(document.querySelector(`.${this.classList[0]}`));

  // console.log(document.querySelector(this.classList[0]));

  // const weeklyList = document.querySelector('.weeklyList');
}

// display our items

// function displayItems() {
//   const html = items.forEach(function() {
//     return `<li>${item.name}</li>`
//   })
// }

// function displayItems() {
// build out a conditional for this using console log
// and making sure the arrow function grabs the correct this
// console.log(items);
// console.log(this.classList[0] === 'weeklyList');

// const html = weeklyItems.map((item) => `<li class="shopping-item">
// <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
// <span class="itemName">  ${item.name} </span>
// <button aria-label="remove ${item.name}"
// value="${item.id}"
// >&times;</button>
// </li>`).join('');
// let html;

// const createHTML = () => {
//   if (this.classList[0] === 'weeklyList') {
//     html = weeklyItems.map((item) => `<li class="shopping-item">
// <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
// <span class="itemName">  ${item.name} </span>
// <button aria-label="remove ${item.name}"
// value="${item.id}"
// >&times;</button>
// </li>`).join('');
//     weeklyList.innerHTML = html;
//   } else if (this.classList[0] === 'monthlyList') {
//     html = monthlyItems.map((item) => `<li class="shopping-item">
// <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
// <span class="itemName">  ${item.name} </span>
// <button aria-label="remove ${item.name}"
// value="${item.id}"
// >&times;</button>
// </li>`).join('');
//     monthlyList.innerHTML = html;
//   } else {
//     console.log('it appears you are not on any list');
//   }
// };

// createHTML();

// console.log(html);

// ORIGINAL VERY IMPORTANT-- TRYING SOMETHING NEW
// weeklyList.innerHTML = html;
// this.innerHTML = html;

// this.innerHTML = html;

// console.log(this);

// console.log(items);
// const html = weeklyItems.map((item) => `<li class="shopping-item">
//  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//  <span class="itemName">  ${item.name} </span>
//  <button aria-label="remove ${item.name}"
//  value="${item.id}"
//  >&times;</button>
//  </li>`).join('');
// console.log(html);

// ORIGINAL VERY IMPORTANT-- TRYING SOMETHING NEW
// weeklyList.innerHTML = html;
//  this.innerHTML = html;
// console.log(this);
// }

// function displayMonthlyItems() {
//   const html = monthlyItems.map((item) => `<li class="shopping-item">
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');

//   monthlyList.innerhtml = html;
// }

function displayWeeklyItems() {
  const html = weeklyItems.map((item) => `<li class="shopping-item">
  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
  <span class="itemName">  ${item.name} </span>
  <button aria-label="remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`).join('');
  weeklyList.innerHTML = html;
}

function displayMonthlyItems() {
  const html = monthlyItems.map((item) => `<li class="shopping-item">
  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
  <span class="itemName">  ${item.name} </span>
  <button aria-label="remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`).join('');
  monthlyList.innerHTML = html;
}

// we might have to split up into multiple storage items
// for weekly, monthly, yearly
function mirrorToLocalStorage() {
  console.info('saving items to localstorage');
  localStorage.setItem('weeklyItems', JSON.stringify(weeklyItems));
}

function restoreFromLocalStorage() {
  // console.log(`local storage this:${this}`);
  console.info('restoring from local storage');
  // pull the items from local storage
  const lsItems = JSON.parse(localStorage.getItem('weeklyItems'));
  if (lsItems.length) {
    // items = lsItems;
    // lsItems.forEach(item => items.push(item);
    // items.push(lsItems[0]);
    weeklyItems.push(...lsItems);
    weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    // add items back to the other two lists, might be some conditional logic there
  }
  // i think we need to have weeklyList, monthlyList, yearlyList and restore everything
  // to local storage from there
  // that's actually a way we could do this for a lot of different function
}

function deleteItem(id) {
  console.log('deleting item!', id);
  // console.log(`deleteItem this:${this}`);

  // if the id of the item is equal to the one passed in, we keep it
  weeklyItems = weeklyItems.filter((item) => item.id !== id);
  console.log(weeklyItems);
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  console.log('marking as complete', id);
  console.log(`markAsComplete this: ${this}`);
  // find reference to the id that was passed in
  const itemRef = weeklyItems.find((item) => item.id === id);
  // setting it to the opposite of itself so it toggles
  itemRef.complete = !itemRef.complete;
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

// we don't listen for click or enter or anything on forms
// because it's much easier to listen for the submit event
// if you submit it in any way, it will work
weeklyGoalsForm.addEventListener('submit', handleSubmit);
weeklyList.addEventListener('itemsUpdated', displayWeeklyItems);
weeklyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

monthlyGoalsForm.addEventListener('submit', handleSubmit);
monthlyList.addEventListener('itemsUpdated', displayMonthlyItems);

// listening on the <ul> and delegating
// the delete event to the button
// event delegation: we listen for the click on the list ul
// but then delegate the click over to the button is that is
// what was clicked
weeklyList.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(id);
  }
});

// run on pageload
restoreFromLocalStorage();

function testing(item) {
  console.log(typeof item);
}

testing(weeklyList);
