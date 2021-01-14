// **FUNCTIONALITY FOR DATEBAR

const datebar = document.querySelector('.datebar');
const todaysdate = document.createElement('p');
// todaysdate.classList.add('centertext', 'todaysdate');
todaysdate.classList.add('todaysdate');


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

const monthProgress = document.createElement('p');
monthProgress.classList.add('progressText');

const monthPB = document.createElement('div');
monthPB.classList.add('progressbar', 'monthPB');

const monthPBinside = document.createElement('div');
monthPBinside.classList.add('progress', 'monthPBinside');


const yearProgress = document.createElement('p');
yearProgress.classList.add('progressText');


const yearPB = document.createElement('div');
yearPB.classList.add('progressbar', 'yearPB');

const yearPBinside = document.createElement('div');
yearPBinside.classList.add('progress', 'yearPBinside');


// yearProgress.classList.add('centertext');
// monthProgress.classList.add('centertext');

monthProgress.textContent = `${Math.floor(monthPercentage)}% through month`;
yearProgress.textContent = `${Math.floor(yearPercentage)}% through year`;

datebar.appendChild(monthProgress);
datebar.appendChild(monthPB);
datebar.appendChild(yearProgress);
datebar.appendChild(yearPB);

monthPB.appendChild(monthPBinside);
yearPB.appendChild(yearPBinside);

// monthPBinside.setAttribute('width', `${monthPercentage}%`);
// monthPBinside.setAttribute('background-color', 'red');

monthPBinside.style.width = `${monthPercentage}%`;
yearPBinside.style.width = `${yearPercentage}%`;


// MOOD TRACKER SECTION

// javascript for creating the squares



const squares = document.querySelector('.squares');

// original js to have all the squares filled out
// for (let i = 1; i < 365; i++) {
//     const level = Math.floor(Math.random() * 4);
//     squares.insertAdjacentHTML('beforeend', `<li data-level="${level}"></li>`);
// }

// for (let i=1; i < Math.ceil((yearPercentage/100)*365); i++){
//   squares.insertAdjacentHTML('beforeend', `<li data-level="4"></li>`);
// }

const moodTrackerForm = document.querySelector('.moodTrackerForm');

const moods = moodTrackerForm.querySelectorAll('input[type="radio"]');

// console.log(moods);
// console.log(moods.length);

// creating a place to store our daily moods
let moodItems = [];

// create a handleSubmit function for the mood tracker

function handleMoodSubmit(e) {
  e.preventDefault();
  for (let i=0; i < moods.length; i++) {
    if (moods[i].checked) {
      // console.log(moods[i]);

      const name = moods[i].value;
      // console.log(name);
      if (!name) { return; }

      const moodItem = {
        name,
        id: Date.now(),
      };

      const pushMoodItems = () => {
        moodItems.push(moodItem);
        // event listener to tell whatever element should be listening,
        // probably the squares,
        // that something was pushed to moodItems
      }

      pushMoodItems();
      // console.log(moodItems);


    }
  }
  squares.dispatchEvent(new CustomEvent('moodItemsUpdated'));
  e.target.reset();
}



function displayMoodSquare() {
  // for (let i=0; i < moodItems.length; i++) {
  //   squares.insertAdjacentHTML('beforeend', `<li class=${moodItems[i].name}></li>`)
  //   console.log(moodItems[i].name);
  // }
  // console.log(moodItems);
  // squares.insertAdjacentHTML('beforeend', `<li class=${moodItems[moodItems.length-1].name}></li>`);

  
  // moodItems.forEach((moodItem) => {
  //    const square = document.createElement('li');
  //   square.classList.add(`${moodItem.name}`);
  //   console.log(square);
  //   squares.appendChild(square);
  // })

  const html = moodItems.map((item) => `<li class=${item.name}></li>`).join('');
  squares.innerHTML = html;

}

function mirrorMoodToLocalStorage() {
  localStorage.setItem('moodItems', JSON.stringify(moodItems));
}

function restoreMoodFromLocalStorage() {
  const moodLSItems = JSON.parse(localStorage.getItem('moodItems'));
  if (moodLSItems.length) {
    moodItems.push(...moodLSItems);
    squares.dispatchEvent(new CustomEvent('moodItemsUpdated'));
  }
} 







moodTrackerForm.addEventListener('submit', handleMoodSubmit);
squares.addEventListener('moodItemsUpdated', displayMoodSquare);
squares.addEventListener('moodItemsUpdated', mirrorMoodToLocalStorage);

restoreMoodFromLocalStorage();

// html from WB for color input
// `<input id="base" type="color" name="base" value="#ffc600"></input>`

// for (let i=1; i <2; i++) {
//   squares.insertAdjacentHTML('beforeend', `<li data-level="0"></li>`)
// }

// testing something out
// means we'll be able to do some kind of calculation to only populate
// the days that the user has already filled out

// for (let i = 2; i < 15; i++) {
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


  const scheduleForm = document.querySelector(`.scheduleForm${time}`);
  

  const scheduleList = document.querySelector(`.scheduleList${time}`);
  // console.log(scheduleList);



  scheduleItems[time] = [];
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
  // console.log(scheduleItem);

      const pushScheduleItems = () => {
        scheduleItems[time].push(scheduleItem);
        // console.log(`There are now ${scheduleItems[time].length} schedule items in scheduleItems${time}`);
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
      }

      pushScheduleItems();

      e.target.reset();

  }

  // displayscheduleitems that works
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
    scheduleForm.classList.add('hidden');

  }

  

 

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
      scheduleForm.classList.remove('hidden');
    }
    if (e.target.matches('input[type="checkbox"]')) {
      scheduleMarkAsComplete(id);
    }
  })

  restoreScheduleFromLocalStorage();
  
  })

  
// schedule result section

const scheduleResult = document.querySelector('.result');

// thinking I can use the same timeArray...

// creating the empty arrays
const resultItems = [];
const resultLSItems = [];

timeArray.forEach((time) => {
  const resultDiv = document.createElement('div');
  resultDiv.classList.add(`resultOutput${time}`);
  scheduleResult.insertAdjacentElement('beforeend', resultDiv);
  resultDiv.innerHTML = `
  <form class="resultForm resultForm${time}" autocomplete="off">
      <label for="time" name="time">${time}</label>
      <input name="item" id="result${time}" type="text">
      <button type="submit">+</button>
      </form>
      <ul class="resultList${time}"></ul>
  `;


  const resultForm = document.querySelector(`.resultForm${time}`);
  // console.log(resultForm);

  const resultList = document.querySelector(`.resultList${time}`);
  // console.log(resultList);



  resultItems[time] = [];
  resultLSItems[time] = [];

  function handleScheduleSubmit(e) {
    e.preventDefault();
    const name = e.currentTarget.item.value;
    if (!name) { return; }

    const resultItem = {
            name,
            id: Date.now(),
            complete: false,
            time: e.currentTarget.item.id,
          };

      const pushResultItems = () => {
        resultItems[time].push(resultItem);
        // console.log(`There are now ${resultItems[time].length} result items in resultItems${time}`);
        resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
      }

      pushResultItems();

      e.target.reset();

  }

  function displayResultItems() {
    const html = resultItems[time].map((item) => `<li class="result-item">
  <label>${item.time}</label>
  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
  <span class="itemName">  ${item.name} </span>
  <button aria-label="remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`).join('');
    resultList.innerHTML = html;
    resultForm.classList.add('hidden');
  }

 

  function mirrorResultToLocalStorage() {
    localStorage.setItem(`resultItems[${time}]`, JSON.stringify(resultItems[time]));
  }

  function restoreResultFromLocalStorage() {
    resultLSItems[time] = JSON.parse(localStorage.getItem(`resultItems[${time}]`));
    if (resultLSItems[time].length) {
      resultItems[time].push(...resultLSItems[time]);
      resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
    }
  }

  function deleteResultItem(id) {
    resultItems[time] = resultItems[time].filter((item) => item.id !== id);
    resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
  }

  function resultMarkAsComplete(id) {
    const itemRef = resultItems[time].find((item) => item.id === id);
    itemRef.complete = !itemRef.complete;
    resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
  }

  resultForm.addEventListener('submit', handleScheduleSubmit);
  resultList.addEventListener('resultItemsUpdated', displayResultItems);
  resultList.addEventListener('resultItemsUpdated', mirrorResultToLocalStorage);

  resultList.addEventListener('click', (e) => {
    const id = parseInt(e.target.value);
    if (e.target.matches('button')) {
      deleteResultItem(id);
      resultForm.classList.remove('hidden');
    }
    if (e.target.matches('input[type="checkbox"]')) {
      resultMarkAsComplete(id);
    }
  })

  restoreResultFromLocalStorage();
  
  })

// wake up time functionality 

// const wakeuptime = document.querySelector('.wakeuptime');

// const weekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// const wakeupItems = [];
// const wakeupLSItems = [];

// weekArray.forEach((day) => {
//   const dayDiv = document.createElement('div');
//   dayDiv.classList.add(`wakeupOutput${day}`);
//   wakeuptime.insertAdjacentElement('beforeend', dayDiv);
//   dayDiv.innerHTML = `
//   <form class="wakeupForm wakeupForm${day}" autocomplete="off">
//       <label for="day" name="day">${day}</label>
//       <input name="item" id="${day}" type="text">
//       <button type="submit">+</button>
//       </form>
//       <ul class="wakeupList${day}"></ul>
//   `;

//   const wakeupForm = document.querySelector(`.wakeupForm${day}`);
//   const wakeupList = document.querySelector(`.wakeupList${day}`);

//   wakeupItems[day] = [];
//   wakeupLSItems[day] = [];

//   function handleWakeupSubmit(e) {
//     e.preventDefault();
//     const name = e.currentTarget.item.value;
//     if (!name) { return; }

//     const wakeupItem = {
//             name,
//             id: Date.now(),
//             complete: false,
//             day: e.currentTarget.item.id,
//           };

//       const pushWakeupItems = () => {
//         wakeupItems[day].push(wakeupItem);
//         wakeupList.dispatchEvent(new CustomEvent('wakeupItemsUpdated'));
//       }

//       pushWakeupItems();

//       e.target.reset();

//   }

//   function displayWakeupItems() {
//     const html = wakeupItems[day].map((item) => `<li class="wakeup-item">
//   <label>${item.day}</label>
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//     wakeupList.innerHTML = html;
//   }

//   function mirrorWakeupToLocalStorage() {
//     localStorage.setItem(`wakeupItems[${day}]`, JSON.stringify(wakeupItems[day]));
//   }

//   function restoreWakeupFromLocalStorage() {
//     wakeupLSItems[day] = JSON.parse(localStorage.getItem(`wakeupItems[${day}]`));
//     if (wakeupLSItems[day].length) {
//       wakeupItems[day].push(...wakeupLSItems[day]);
//       wakeupList.dispatchEvent(new CustomEvent('wakeupItemsUpdated'));
//     }
//   }

//   function deleteWakeupItem(id) {
//     wakeupItems[day] = wakeupItems[day].filter((item) => item.id !== id);
//     wakeupList.dispatchEvent(new CustomEvent('wakeupItemsUpdated'));
//   }

//   function wakeupMarkAsComplete(id) {
//     const itemRef = wakeupItems[day].find((item) => item.id === id);
//     itemRef.complete = !itemRef.complete;
//     wakeupList.dispatchEvent(new CustomEvent('wakeupItemsUpdated'));
//   }


//   wakeupForm.addEventListener('submit', handleWakeupSubmit);
//   wakeupList.addEventListener('wakeupItemsUpdated', displayWakeupItems);
//   wakeupList.addEventListener('wakeupItemsUpdated', mirrorWakeupToLocalStorage);

//   wakeupList.addEventListener('click', (e) => {
//     const id = parseInt(e.target.value);
//     if (e.target.matches('button')) {
//       deleteWakeupItem(id);
//     }
//     if (e.target.matches('input[type="checkbox"]')) {
//       wakeupMarkAsComplete(id);
//     }
//   })

//   restoreWakeupFromLocalStorage();
// })