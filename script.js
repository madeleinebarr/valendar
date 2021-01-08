// **FUNCTIONALITY FOR DATEBAR

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

// **GOALS LIST FUNCTIONALITY I LUV U MADILE**

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
  // console.log(name);

  const item = {
    name,
    id: Date.now(),
    complete: false,
  };

  const pushItems = () => {
    if (this.classList[0] === 'weeklyGoals') {
      weeklyItems.push(item);
      // console.log(`There are now ${weeklyItems.length} weekly items in your state`);
      // console.log('You are on the weekly goals list');
      weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else if (this.classList[0] === 'monthlyGoals') {
      monthlyItems.push(item);
      // console.log(`There are now ${monthlyItems.length} monthly items in your state`);
      // console.log('You are on the monthly goals list');
      monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else if (this.classList[0] === 'yearlyGoals') {
      yearlyItems.push(item);
      // console.log(`There are now ${yearlyItems.length} yearly items in your state`);
      // console.log('You are on the yearly goals list');
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
  // console.info('saving items to localstorage');
  if (this.classList[0] === 'weeklyList') {
    localStorage.setItem('weeklyItems', JSON.stringify(weeklyItems));
    // console.log('we pushed weekly items to local storage');
  } else if (this.classList[0] === 'monthlyList') {
    localStorage.setItem('monthlyItems', JSON.stringify(monthlyItems));
    // console.log('we pushed monthly items to local storage');
  } else if (this.classList[0] === 'yearlyList') {
    localStorage.setItem('yearlyItems', JSON.stringify(yearlyItems));
    // console.log('we pushed yearly items to local storage');
  }
  // console.log(this.classList[0]);
}

function restoreFromLocalStorage() {
  // console.info('restoring from local storage');
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
  // console.log('deleting item!', id);
  // if the id of the item is not equal to the one passed in, we keep it
  weeklyItems = weeklyItems.filter((item) => item.id !== id);
  // console.log(weeklyItems);
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  monthlyItems = monthlyItems.filter((item) => item.id !== id);
  // console.log(monthlyItems);
  monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  yearlyItems = yearlyItems.filter((item) => item.id !== id);
  // console.log(yearlyItems);
  yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function weeklyMarkAsComplete(id) {
  // console.log('marking as complete', id);
  // console.log(`markAsComplete this: ${this}`);
  // find reference to the id that was passed in
  const weeklyItemRef = weeklyItems.find((item) => item.id === id);
  // setting it to the opposite of itself so it toggles
  weeklyItemRef.complete = !weeklyItemRef.complete;
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  // console.log(`Weekly item ref here: ${weeklyItemRef.value}`);
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

// ** PLAN SCHEDULE FUNCTIONALITY

// const scheduleForm7AM = document.querySelector('.scheduleForm7AM');
// const scheduleOutput7AM = document.querySelector('.scheduleOutput7AM');

// const scheduleForm8AM = document.querySelector('.scheduleForm8AM');
// const scheduleOutput8AM = document.querySelector('.scheduleOutput8AM');

/* eslint-disable */
// let scheduleItems7AM = [];
// let scheduleItems8AM = [];
/* eslint-enable */

// function handleScheduleSubmit7AM(e) {
//   console.log(e.currentTarget.item.id);
//   e.preventDefault();
//   const name = e.currentTarget.item.value;
//   if (!name) { return; }
//   console.log(name);

//   const scheduleItem = {
//     name,
//     id: Date.now(),
//     complete: false,
//     time: e.currentTarget.item.id,
//   };

//   const pushScheduleItems = () => {
//     scheduleItems7AM.push(scheduleItem);
//     console.log(`There are now ${scheduleItems7AM.length} schedule items in your state`);
//     console.log('You are on the schedule');
//     // scheduleList7AM.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//     scheduleOutput7AM.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   };

//   pushScheduleItems();

//   e.target.reset();
// }

// function handleScheduleSubmit8AM(e) {
//   console.log(e.currentTarget.item.id);
//   e.preventDefault();
//   const name = e.currentTarget.item.value;
//   if (!name) { return; }
//   console.log(name);

//   const scheduleItem = {
//     name,
//     id: Date.now(),
//     complete: false,
//     time: e.currentTarget.item.id,
//   };

//   const pushScheduleItems = () => {
//     scheduleItems8AM.push(scheduleItem);
//     console.log(`There are now ${scheduleItems8AM.length} schedule items in your state`);
//     console.log('You are on the schedule');
//     scheduleOutput8AM.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   };

//   pushScheduleItems();

//   e.target.reset();
// }

// function displayScheduleItems7AM() {
//   const html = scheduleItems7AM.map((item) => `<li class="schedule-item">
//   <label>${item.time}</label>
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//   scheduleOutput7AM.innerHTML = html;
// }

// function displayScheduleItems8AM() {
//   const html = scheduleItems8AM.map((item) => `<li class="schedule-item">
//   <label>${item.time}</label>
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//   scheduleOutput8AM.innerHTML = html;
// }

// scheduleForm7AM.addEventListener('submit', handleScheduleSubmit7AM);
// scheduleOutput7AM.addEventListener('scheduleItemsUpdated', displayScheduleItems7AM);

// scheduleForm8AM.addEventListener('submit', handleScheduleSubmit8AM);
// scheduleOutput8AM.addEventListener('scheduleItemsUpdated', displayScheduleItems8AM);

// let's generate all of the html to go onto the page for the schedule section

const schedulePlan = document.querySelector('.plan');

const timeArray = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];


// /* eslint-disable */
const scheduleItems = [];
const scheduleLSItems = [];
//   /* eslint-enable */




timeArray.forEach((time) => {
  const planDiv = document.createElement('div');
  planDiv.classList.add(`scheduleOutput${time}`);
  schedulePlan.insertAdjacentElement('beforeend', planDiv);
  planDiv.innerHTML = `
  <form class="scheduleForm scheduleForm${time}" autocomplete="off">
      <label for="time" name="time">${time}</label>
      <input name="item" id="${time}" type="text">
      <button type="submit">+</button>
      </form>
      <ul class="scheduleList${time}"></ul>
  `;

  // selecting the forms
  // const scheduleForm7AM = document.querySelector('.scheduleForm7AM');
  // console.log(scheduleForm7AM);

  const scheduleForm = document.querySelector(`.scheduleForm${time}`);
  console.log(scheduleForm);

  const scheduleList = document.querySelector(`.scheduleList${time}`);
  console.log(scheduleList);

  // selecting the place where the items will be displayed


  // const scheduleForm = document.querySelector(`.${form.classList[1]}`);
  // // console.log(scheduleForm);
  // const scheduleOutput = scheduleForm.parentElement;


  scheduleItems[time] = [];
  // console.log(scheduleItems[time]);
  scheduleLSItems[time] = [];

  function handleScheduleSubmit(e) {
    e.preventDefault();
    const name = e.currentTarget.item.value;
    if (!name) { return; }

    const scheduleItem = {
            name,
            id: Date.now(),
            complete: false,
            time: e.currentTarget.item.id,
          };
  console.log(scheduleItem);

      const pushScheduleItems = () => {
        scheduleItems[time].push(scheduleItem);
        console.log(`There are now ${scheduleItems[time].length} schedule items in scheduleItems${time}`);
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
      }

      pushScheduleItems();

      e.target.reset();

  }

  function displayScheduleItems() {
    const html = scheduleItems[time].map((item) => `<li class="schedule-item">
  <label>${item.time}</label>
  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
  <span class="itemName">  ${item.name} </span>
  <button aria-label="remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`).join('');
    scheduleList.innerHTML = html;
  }

  //   function mirrorScheduleToLocalStorage() {
//     localStorage.setItem(`scheduleItems[${scheduleItem.time}]`, JSON.stringify(scheduleItems[scheduleItem.time]));
//   }

  function mirrorScheduleToLocalStorage() {
    localStorage.setItem(`scheduleItems[${time}]`, JSON.stringify(scheduleItems[time]));
  }

  function restoreScheduleFromLocalStorage() {
    scheduleLSItems[time] = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
    if (scheduleLSItems[time].length) {
      scheduleItems[time].push(...scheduleLSItems[time]);
      scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
    }
  }

  function deleteScheduleItem(id) {
    scheduleItems[time] = scheduleItems[time].filter((item) => item.id !== id);
    scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
  }

  function scheduleMarkAsComplete(id) {
    const itemRef = scheduleItems[time].find((item) => item.id === id);
    itemRef.complete = !itemRef.complete;
    scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
  }

  scheduleForm.addEventListener('submit', handleScheduleSubmit);
  scheduleList.addEventListener('scheduleItemsUpdated', displayScheduleItems);
  scheduleList.addEventListener('scheduleItemsUpdated', mirrorScheduleToLocalStorage);

  scheduleList.addEventListener('click', (e) => {
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
      deleteScheduleItem(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
      scheduleMarkAsComplete(id);
    }
  })

  restoreScheduleFromLocalStorage();
  
  })

  



// const scheduleForms = document.querySelectorAll('.scheduleForm');
// console.log(scheduleForms);

  // // function restoreScheduleFromLocalStorage() {
  // //   if(scheduleItems[`${time}`]).length {
  // //     console.log(`We have items in ${time}`);
  // //   }
  // // }

  // console.log(scheduleItems["7AM"].length);
  // // console.log(scheduleItems[`"${time}"`].length);
  // console.log(scheduleItems[time].length);

  // function restoreSchedule(time) {
  //   scheduleLSItems[time] = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
  //   if (scheduleLSItems[time].length) {
  //   console.log('LS items');
  //   scheduleItems[time].push(...scheduleLSItems[time]);
  //   schedulePlan.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
  //   }
  //   console.log(scheduleLSItems[time]);
  // }

  // // planDiv.addEventListener('scheduleItemsUpdated', displayScheduleItems);

  // restoreSchedule(time);





  // return restoreScheduleFromLocalStorage;


  // restoreScheduleFromLocalStorage(time);
  // function restoreScheduleFromLocalStorage(time) {
//   scheduleLSItems[time] = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
//   if (scheduleLSItems[time].length) {
//     scheduleItems[time].push(...scheduleLSItems[time]);
//     scheduleOutput.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   }
// }
// });

// console.log(scheduleLSItems);

// function restoreSchedule(time) {
//   scheduleLSItems[time] = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
//   if (scheduleLSItems[time].length) {
//   console.log('LS items');
//   scheduleItems[time].push(...scheduleLSItems[time]);
//   schedulePlan.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   }
//   console.log(scheduleLSItems[time]);
// }


// restoreScheduleFromLocalStorage();


// const scheduleForms = document.querySelectorAll('.scheduleForm');

// /* eslint-disable */
//   let scheduleItems = [];
//   /* eslint-enable */


// ORIGINAL FORM JS

// scheduleForms.forEach((form) => {
//   // selecting the schedule forms
//   // const scheduleForm = document.querySelector(`.${form.classList[1]}`);
//   // // console.log(scheduleForm);
//   // const scheduleOutput = scheduleForm.parentElement;
//   // console.log(scheduleOutput);
//   // creating the scheduleItems array
//   /* eslint-disable */
//   // let scheduleItems = [];
//   // scheduleItems.scheduleForm = [];
//   // console.log(scheduleItems);
//   /* eslint-enable */

//   // let scheduleItem = {};

//   // // handling submit for schedule items
//   // function handleScheduleSubmit(e) {
//   //   e.preventDefault();
//   //   const name = e.currentTarget.item.value;
//   //   if (!name) { return; }

//   //   scheduleItem = {
//   //     name,
//   //     id: Date.now(),
//   //     complete: false,
//   //     time: e.currentTarget.item.id,
//   //   };
//   //   // console.log(scheduleItem.time);

//   //   const pushScheduleItems = () => {
//   //     scheduleItems[`${scheduleItem.time}`].push(scheduleItem);
//   //     /* eslint-disable */
//   //     // console.log(`There are now ${scheduleItems[scheduleItem.time].length} schedule items in your state`);
//   //      /* eslint-enable */
//   //     scheduleOutput.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   //   };

//   //   pushScheduleItems();

//   //   e.target.reset();
//   //   // console.log(scheduleItems[scheduleItem.time]);
//   //   // console.log(scheduleItems);
//   // }

//   function displayScheduleItems() {
//     const html = scheduleItems[scheduleItem.time].map((item) => `<li class="schedule-item">
//   <label>${item.time}</label>
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//     scheduleOutput.innerHTML = html;
//   }

//   function mirrorScheduleToLocalStorage() {
//     localStorage.setItem(`scheduleItems[${scheduleItem.time}]`, JSON.stringify(scheduleItems[scheduleItem.time]));
//   }

//   // function restoreScheduleFromLocalStorage() {
//   //   console.log(scheduleItems[scheduleItem.time]);
//   // }

//   // restoreScheduleFromLocalStorage();

//   // function restoreScheduleFromLocalStorage() {
//   //   const scheduleLSItems = JSON.parse(localStorage.getItem(`scheduleItems[${scheduleItem.time}]`));
//   //   if (scheduleLSItems.length) {
//   //     scheduleItems[scheduleItem.time].scheduleForm.push(...scheduleLSItems);
//   //     scheduleOutput.dispatchEvent(new CustomEvent('itemsUpdated'));
//   //   }
//   // }
//   scheduleForm.addEventListener('submit', handleScheduleSubmit);
//   scheduleOutput.addEventListener('scheduleItemsUpdated', displayScheduleItems);
//   scheduleOutput.addEventListener('scheduleItemsUpdated', mirrorScheduleToLocalStorage);

//   // function restoreScheduleFromLocalStorage(time) {
//   //   console.log('restoring schedule');
//   //   const scheduleLSItems7AM = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
//   //   if (scheduleLSItems7AM.length) {
//   //     scheduleItems[time].push(...scheduleLSItems7AM);
//   //     scheduleOutput.dispatchEvent(new CustomEvent('itemsUpdated'));
//   //   }
//   // }
  
//   // restoreScheduleFromLocalStorage(7AM);
  
// });

// // planDiv.addEventListener('scheduleItemsUpdated', displayScheduleItems);





// // const planBackground = document.querySelector('.plan');

// // function restoreScheduleFromLocalStorage(time) {
// //   scheduleLSItems[time] = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
// //   // console.log(scheduleLSItems[time]);
// //   console.log(scheduleLSItems[time].length);
// //   if(scheduleLSItems[time].length) {
// //     console.log(scheduleLSItems[time]);
// //     scheduleItems[time].push(...scheduleLSItems[time]);
// //     console.log(scheduleItems[time]);

// //     // planBackground.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
// //   }
// // }

// // timeArray.forEach((time) => {
// //   restoreScheduleFromLocalStorage(time);
// // });

// // function restoreScheduleFromLocalStorage() {
// //   const LSscheduleItems7AM = JSON.parse(localStorage.getItem('scheduleItems[7AM]'));
// //   console.log(LSscheduleItems7AM);
// //   if (LSscheduleItems7AM.length) {
// //     scheduleItems[scheduleItem.time].push(...LSscheduleItems7AM);
// //   }
// // }

// // restoreScheduleFromLocalStorage();

// // i think this can be outside of the foreach because it doesn't have to run 12 times

// // const LSgroups = Object.keys(localStorage);

// // const LSkeys = Object.keys(localStorage);
// // const LSentries = Object.values(localStorage);

// // function restoreScheduleFromLocalStorage() {
// //   LSkeys.forEach((group) => {
// //     const LSitems = JSON.parse(localStorage.getItem(group));
// //     console.log(LSitems);
// //     console.log(LSitems.length);
// //     console.log(LSentries);
// //     console.log(LSentries.weeklyItems);
// //     if (LSitems.length) {
// //       console.log(`We have some items in ${group}`);
// //       console.log(group);
// //       console.log(typeof group);
// //       // const groupJS = JSON.parse(JSON.stringify(group));
// //       // console.log(groupJS);
// //       // console.log(typeof groupJS);
// //       // group.push(...LSitems);
// //     }

// //     // const JSgroup = JSON.parse(LSgroups);
// //     // console.log(JSgroup);
// //     // if (LSitems.length) {
// //     //   group.push(...LSitems);
// //     //   group.dispatchEvent(new CustomEvent('itemsUpdated'));
// //     // }
// //   });
// //   // grab all of the local storage items that exist
// //   // for (const i in localStorage) {
// //   //   console.log(localStorage[i]);
// //   // }

// //   // const LSgroups = JSON.parse(localStorage.getItem('scheduleItems[2PM]'));
// //   console.log(LSkeys);
// // }

// // restoreScheduleFromLocalStorage();

// // const activities = [
// //   ['Work', 9],
// //   ['Eat', 1],
// //   ['Commute', 2],
// //   ['Play Game', 1],
// //   ['Sleep', 7],
// // ];

// // you can definitely access things by their index numerically
// // see if you can use strings as an index

// const activities = [];
// // console.log(typeof activities);

// // activities[0] = ['Work', 9];
// // activities[1] = ['Eat', 1];

// const testArray = ['morning', 'afternoon', 'evening'];

// testArray.forEach((section) => {
//   activities[section] = ['boo'];
// })

// // activities.morning = [];
// // activities.afternoon = ['Eat', 1];

// // activities.morning = '';
// // activities.afternoon = '';

// // const activityObject = {
// //   id: Date.now(),
// //   make: 'volvo',
// // };

// // activities.push(activityObject);
// // const { morning } = activities;
// // morning.push(activityObject);

// // const pushScheduleItems = () => {
// //   scheduleItems.push(scheduleItem);
// //   console.log(`There are now ${scheduleItems.length} schedule items in your state`);
// //   scheduleOutput.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
// // };
