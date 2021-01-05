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

const weeklyGoalsForm = document.querySelector('.weeklyGoals');
const weeklyList = document.querySelector('.weeklyList');

const monthlyGoalsForm = document.querySelector('.monthlyGoals');
const monthlyList = document.querySelector('.monthlyList');

const yearlyGoalsForm = document.querySelector('.yearlyGoals');
const yearlyList = document.querySelector('.yearlyList');

// need an array to hold all of our items (our state)

let weeklyItems = [];
let monthlyItems = [];
let yearlyItems = [];

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

  const pushItems = () => {
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
    } else if (this.classList[0] === 'yearlyGoals') {
      yearlyItems.push(item);
      console.log(`There are now ${yearlyItems.length} yearly items in your state`);
      console.log('You are on the yearly goals list');
      yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else {
      console.log('It appears you are not on any list');
    }
  };

  pushItems();

  // clear the form
  e.target.reset();
}

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

function displayYearlyItems() {
  const html = yearlyItems.map((item) => `<li class="shopping-item">
  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
  <span class="itemName">  ${item.name} </span>
  <button aria-label="remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`).join('');
  yearlyList.innerHTML = html;
}

function mirrorToLocalStorage() {
  console.info('saving items to localstorage');
  if (this.classList[0] === 'weeklyList') {
    localStorage.setItem('weeklyItems', JSON.stringify(weeklyItems));
    console.log('we pushed weekly items to local storage');
  } else if (this.classList[0] === 'monthlyList') {
    localStorage.setItem('monthlyItems', JSON.stringify(monthlyItems));
    console.log('we pushed monthly items to local storage');
  } else if (this.classList[0] === 'yearlyList') {
    localStorage.setItem('yearlyItems', JSON.stringify(yearlyItems));
    console.log('we pushed yearly items to local storage');
  }
  console.log(this.classList[0]);
}

function restoreFromLocalStorage() {
  console.info('restoring from local storage');
  // pull the items from local storage
  const weeklyLSItems = JSON.parse(localStorage.getItem('weeklyItems'));
  if (weeklyLSItems.length) {
    weeklyItems.push(...weeklyLSItems);
    weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }

  const monthlyLSItems = JSON.parse(localStorage.getItem('monthlyItems'));
  if (monthlyLSItems.length) {
    monthlyItems.push(...monthlyLSItems);
    monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }

  const yearlyLSItems = JSON.parse(localStorage.getItem('yearlyItems'));
  if (yearlyLSItems.length) {
    yearlyItems.push(...yearlyLSItems);
    yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  console.log('deleting item!', id);
  // if the id of the item is not equal to the one passed in, we keep it
  weeklyItems = weeklyItems.filter((item) => item.id !== id);
  console.log(weeklyItems);
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  monthlyItems = monthlyItems.filter((item) => item.id !== id);
  console.log(monthlyItems);
  monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  yearlyItems = yearlyItems.filter((item) => item.id !== id);
  console.log(yearlyItems);
  yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function weeklyMarkAsComplete(id) {
  console.log('marking as complete', id);
  console.log(`markAsComplete this: ${this}`);
  // find reference to the id that was passed in
  const weeklyItemRef = weeklyItems.find((item) => item.id === id);
  // setting it to the opposite of itself so it toggles
  weeklyItemRef.complete = !weeklyItemRef.complete;
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  console.log(`Weekly item ref here: ${weeklyItemRef.value}`);
}

function monthlyMarkAsComplete(id) {
  const monthlyItemRef = monthlyItems.find((item) => item.id === id);
  monthlyItemRef.complete = !monthlyItemRef.complete;
  monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function yearlyMarkAsComplete(id) {
  const yearlyItemRef = yearlyItems.find((item) => item.id === id);
  yearlyItemRef.complete = !yearlyItemRef.complete;
  yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

weeklyGoalsForm.addEventListener('submit', handleSubmit);
weeklyList.addEventListener('itemsUpdated', displayWeeklyItems);
weeklyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

monthlyGoalsForm.addEventListener('submit', handleSubmit);
monthlyList.addEventListener('itemsUpdated', displayMonthlyItems);
monthlyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

yearlyGoalsForm.addEventListener('submit', handleSubmit);
yearlyList.addEventListener('itemsUpdated', displayYearlyItems);
yearlyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

weeklyList.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    weeklyMarkAsComplete(id);
  }
});

monthlyList.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    monthlyMarkAsComplete(id);
  }
});

yearlyList.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    yearlyMarkAsComplete(id);
  }
});

// run on pageload
restoreFromLocalStorage();
