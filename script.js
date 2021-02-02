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

datebar.insertAdjacentElement('afterbegin', todaysdate);

const dayOfWeekIndex = date.getDay();

let weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const dayOfWeek = weekdays[dayOfWeekIndex];

const todaysweekday = document.createElement('p');
todaysweekday.classList.add('todaysweekday');
todaysweekday.textContent = dayOfWeek;

todaysdate.insertAdjacentElement('beforebegin', todaysweekday);



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


monthProgress.textContent = `${Math.floor(monthPercentage)}% through month`;
yearProgress.textContent = `${Math.floor(yearPercentage)}% through year`;

datebar.appendChild(monthProgress);
datebar.appendChild(monthPB);
datebar.appendChild(yearProgress);
datebar.appendChild(yearPB);

monthPB.appendChild(monthPBinside);
yearPB.appendChild(yearPBinside);

monthPBinside.style.width = `${monthPercentage}%`;
yearPBinside.style.width = `${yearPercentage}%`;


// SCHEDULE SECTION

// creating the table
const scheduleLayout = document.querySelector('.schedulelayout');

const scheduleTable = document.createElement('table');
scheduleTable.classList.add('scheduleTable');
scheduleLayout.appendChild(scheduleTable);

const corner = document.createElement('th');
corner.innerHTML = '';
scheduleTable.appendChild(corner);

const scheduleDaysArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let scheduleTimesArray = ['6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'];
let scheduleItems = [];
let scheduleLSItems = [];


scheduleDaysArray.forEach((day) => {
  const scheduleTableColumn = document.createElement('th');
  scheduleTableColumn.classList.add(`column${day}`, "column");
  scheduleTableColumn.innerHTML = `<th>${day}</th>`
  scheduleTable.appendChild(scheduleTableColumn);
});

scheduleTimesArray.forEach((time) => {
  const scheduleTableRow = document.createElement('tr');
  scheduleTableRow.classList.add(`row${time}`, "row");
  scheduleTableRow.innerHTML = `<th class="rowheader">${time}</th>
  `; 
  scheduleTable.appendChild(scheduleTableRow);
})


scheduleDaysArray.forEach((day) => {
  // const dayColumn = document.querySelector(`.column${day}`);
  // console.log(dayColumn);
  scheduleTimesArray.forEach((time) => {
    const timeRow = document.querySelector(`.row${time}`);
    // console.log(timeRow);
    const scheduleSlotTD = document.createElement('td');
    scheduleSlotTD.classList.add(`scheduleSlot${time}${day}`, `column${day}`, `row${time}`, `${time}${day}`, 'slot');
    // scheduleSlot.innerHTML = `${day} + ${time}`;

    scheduleSlotTD.innerHTML = `
        <form class="scheduleForm${time}${day} scheduleForm hidden">
        <input type="text" name="item" id="${time}${day}" autocomplete="off">
        
        </form>
        <ul class="scheduleList${time}${day} scheduleList"></ul>
    `;
    
    
    timeRow.appendChild(scheduleSlotTD);

    let timedayslot = time + day;
    // console.count(console.log(timedayslot));
    scheduleItems[timedayslot] = [];
    scheduleLSItems[timedayslot] = [];
    
    const scheduleForm = document.querySelector(`.scheduleForm${time}${day}`);
    const scheduleList = document.querySelector(`.scheduleList${time}${day}`);
    const scheduleSlot = document.querySelector(`.scheduleSlot${time}${day}`);
    // const eventDiv = document.querySelector(`.eventDiv`)
    
    function handleScheduleSubmit(e) {
      e.preventDefault();
      const name = e.currentTarget.item.value;
      if (!name) { return; }
    
      const scheduleItem = {
        name,
        id: Date.now(),
        complete: false,
        timedayslot: e.currentTarget.item.id,
      }
      // console.log(scheduleItem);
    
      const pushScheduleItems = () => {
        scheduleItems[timedayslot].push(scheduleItem);
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
      }
    
      pushScheduleItems();
    
      e.target.reset();
    }


    function displayScheduleItems() {
      const html = scheduleItems[timedayslot].map((item) => `
        <li class="scheduleItem" draggable="true" id="${item.id}">${item.name}</li>
      `).join('');
      scheduleList.innerHTML = html;
      scheduleForm.classList.add('hidden');
      
      scheduleSlot.classList.add('scheduledEvent');

      // adding time label
      // const timeLabel = document.createElement('p');
      // timeLabel.classList.add('timeLabel');
      // // timeLabel.textContent = 'time';
      // timeLabel.textContent = scheduleList.parentElement.classList[3].slice(0, -3);

      // if(scheduleSlot.firstElementChild.classList[1] === 'scheduleForm') {
      //   scheduleSlot.insertAdjacentElement('afterbegin', timeLabel);
      // }

      
      
    }

    function mirrorScheduleToLocalStorage() {
      localStorage.setItem(`scheduleItems[${timedayslot}]`, JSON.stringify(scheduleItems[timedayslot]));
    }

    function restoreScheduleFromLocalStorage() {
      scheduleLSItems[timedayslot] = JSON.parse(localStorage.getItem(`scheduleItems[${timedayslot}]`)) || [];
      if (scheduleLSItems[timedayslot].length) {
        scheduleItems[timedayslot].push(...scheduleLSItems[timedayslot]);
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
      }
    }



    function createEvent(e) {
      scheduleSlot.classList.add('scheduledEvent');
      scheduleForm.classList.remove('hidden');

      // adding a time label
      // console.log(scheduleList.parentElement.classList[3]);
      // const timeLabel = document.createElement('p');
      // timeLabel.classList.add('timeLabel');
      // timeLabel.textContent = scheduleList.parentElement.classList[3].slice(0, -3);
      // console.log(scheduleSlot.firstElementChild.classList[1] === 'scheduleForm');
      
      // if(scheduleSlot.firstElementChild.classList[1] === 'scheduleForm') {
      //   scheduleSlot.insertAdjacentElement('afterbegin', timeLabel);
      // }
      // scheduleSlot.insertAdjacentElement('afterbegin', timeLabel);
    }


    // if you wanted you could add delete schedule item functionality with a button
    // and also mark as complete functionality 
    // let's get some other functions up and running first

    // drag and drop section
    function allowDrop(e) {
      e.preventDefault();
    }

    function drag(e) {
      let data = e.target.id;
      e.dataTransfer.setData("text", data);
      let giveSlot = this.parentElement.classList[3];
    
      function deleteItem(id) {
        scheduleItems[giveSlot] = scheduleItems[giveSlot].filter((item) => item.id !== id);
        // dispatch event
        // this makes the events disappear from the schedule and also makes them disappear from local storage
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsDragged'));
      } 

      let idNumber = parseInt(data);

      deleteItem(idNumber);

      if(!scheduleItems[giveSlot].length) {
      scheduleSlot.classList.remove('scheduledEvent');
      }
      
      // const timeLabel = this.parentElement.firstElementChild;
      
      // console.log(timeLabel);
      // timeLabel.remove();
    }

    function drop(e) {
      e.preventDefault();
      let receiveSlot = this.classList[3];      
      let data = e.dataTransfer.getData("text");
      const thisUL = this.querySelector('ul');
      thisUL.appendChild(document.getElementById(data));

      // add item to scheduleItems[receiveSlot]
      const draggedItemElement = document.getElementById(data);
      const name = draggedItemElement.textContent;
      const id = parseInt(data);

      // creating an item to push into the receiving slot
      const draggedScheduleItem = {
        name,
        id: parseInt(data),
        complete: false,
        timedayslot: receiveSlot,
      }

      const pushDraggedScheduleItems = () => {
        scheduleItems[receiveSlot].push(draggedScheduleItem);
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsDragged'));
      }

      pushDraggedScheduleItems();

      scheduleSlot.classList.add('scheduledEvent');


      // const timeLabel = document.createElement('p');
      // timeLabel.classList.add('timeLabel');
      // timeLabel.textContent = scheduleList.parentElement.classList[3].slice(0, -3);
      // console.log(scheduleSlot.firstElementChild.classList[1] === 'scheduleForm');
      
      // if(scheduleSlot.firstElementChild.classList[1] === 'scheduleForm') {
      //   scheduleSlot.insertAdjacentElement('afterbegin', timeLabel);
      // }
      // scheduleSlot.insertAdjacentElement('afterbegin', timeLabel);
      
      
    }


    scheduleSlot.addEventListener('dblclick', createEvent);

    scheduleForm.addEventListener('submit', handleScheduleSubmit);
    scheduleList.addEventListener('scheduleItemsUpdated', displayScheduleItems);
    scheduleList.addEventListener('scheduleItemsUpdated', mirrorScheduleToLocalStorage);
    scheduleList.addEventListener('dragstart', drag);

    // drag and drop

    scheduleSlot.addEventListener('drop', drop);
    scheduleSlot.addEventListener('dragover', allowDrop);

    scheduleList.addEventListener('scheduleItemsDragged', mirrorScheduleToLocalStorage);

    restoreScheduleFromLocalStorage();

  })
})



// MOOD TRACKER SECTION

// javascript for creating the squares


const squares = document.querySelector('.squares');

for(let i=1; i <= 365; i++) {
  const square = document.createElement('li');
  squares.appendChild(square);
}


const moodTrackerForm = document.querySelector('.moodTrackerForm');

const moods = moodTrackerForm.querySelectorAll('input[type="radio"]');


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
   
      }

      pushMoodItems();


    }
  }
  squares.dispatchEvent(new CustomEvent('moodItemsUpdated'));
  e.target.reset();
}



function displayMoodSquare() {
  
 

  const html = moodItems.map((item) => `<li class=${item.name}></li>`).join('');
  // console.log(html);
  squares.innerHTML = html;

  for(let i=1; i <= (365-moodItems.length + 1); i++) {
    const square = document.createElement('li');
    squares.appendChild(square);
  }

}

function mirrorMoodToLocalStorage() {
  localStorage.setItem('moodItems', JSON.stringify(moodItems));
}

function restoreMoodFromLocalStorage() {
  const moodLSItems = JSON.parse(localStorage.getItem('moodItems')) || [];
  if (moodLSItems.length) {
    moodItems.push(...moodLSItems);
    squares.dispatchEvent(new CustomEvent('moodItemsUpdated'));
  }
} 







moodTrackerForm.addEventListener('submit', handleMoodSubmit);
squares.addEventListener('moodItemsUpdated', displayMoodSquare);
squares.addEventListener('moodItemsUpdated', mirrorMoodToLocalStorage);

restoreMoodFromLocalStorage();


// // **GOALS LIST FUNCTIONALITY I LUV U MADILE**

const dailyGoalsForm = document.querySelector('.dailyGoals');
const dailyList = document.querySelector('.dailyList');

const weeklyGoalsForm = document.querySelector('.weeklyGoals');
const weeklyList = document.querySelector('.weeklyList');

const monthlyGoalsForm = document.querySelector('.monthlyGoals');
const monthlyList = document.querySelector('.monthlyList');

const yearlyGoalsForm = document.querySelector('.yearlyGoals');
const yearlyList = document.querySelector('.yearlyList');


// need an array to hold all of our items (our state)

let dailyItems = [];
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
    if (this.classList[0] === 'dailyGoals') {
      dailyItems.push(item);
      dailyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
    else if (this.classList[0] === 'weeklyGoals') {
      weeklyItems.push(item);
      weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else if (this.classList[0] === 'monthlyGoals') {
      monthlyItems.push(item);
      monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else if (this.classList[0] === 'yearlyGoals') {
      yearlyItems.push(item);
      yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
    } else {
      console.log('It appears you are not on any list');
    }
  };

  pushItems();

  // clear the form
  e.target.reset();
}

function displayDailyItems() {
  const html = dailyItems.map((item) => `<li class="shopping-item">
  <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
  <span class="itemName">  ${item.name} </span>
  <button aria-label="remove ${item.name}"
  value="${item.id}"
  >&times;</button>
  </li>`).join('');
  dailyList.innerHTML = html;
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
  if (this.classList[0] === 'dailyList') {
    localStorage.setItem('dailyItems', JSON.stringify(dailyItems));
  }
  else if (this.classList[0] === 'weeklyList') {
    localStorage.setItem('weeklyItems', JSON.stringify(weeklyItems));
  } else if (this.classList[0] === 'monthlyList') {
    localStorage.setItem('monthlyItems', JSON.stringify(monthlyItems));
  } else if (this.classList[0] === 'yearlyList') {
    localStorage.setItem('yearlyItems', JSON.stringify(yearlyItems));
  }
}

function restoreFromLocalStorage() {
  const dailyLSItems = JSON.parse(localStorage.getItem('dailyItems')) || [];
  if (dailyLSItems.length) {
    dailyItems.push(...dailyLSItems);
    dailyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }

  const weeklyLSItems = JSON.parse(localStorage.getItem('weeklyItems')) || [];
  if (weeklyLSItems.length) {
    weeklyItems.push(...weeklyLSItems);
    weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }

  const monthlyLSItems = JSON.parse(localStorage.getItem('monthlyItems')) || [];
  if (monthlyLSItems.length) {
    monthlyItems.push(...monthlyLSItems);
    monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }

  const yearlyLSItems = JSON.parse(localStorage.getItem('yearlyItems')) || [];
  if (yearlyLSItems.length) {
    yearlyItems.push(...yearlyLSItems);
    yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  dailyItems = dailyItems.filter((item) => item.id !== id);
  dailyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  weeklyItems = weeklyItems.filter((item) => item.id !== id);
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  monthlyItems = monthlyItems.filter((item) => item.id !== id);
  monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));

  yearlyItems = yearlyItems.filter((item) => item.id !== id);
  yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function dailyMarkAsComplete(id) {
  const dailyItemRef = dailyItems.find((item) => item.id === id);
  dailyItemRef.complete = !dailyItemRef.complete;
  dailyList.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function weeklyMarkAsComplete(id) {
  // find reference to the id that was passed in
  const weeklyItemRef = weeklyItems.find((item) => item.id === id);
  // setting it to the opposite of itself so it toggles
  weeklyItemRef.complete = !weeklyItemRef.complete;
  weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
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

dailyGoalsForm.addEventListener('submit', handleSubmit);
dailyList.addEventListener('itemsUpdated', displayDailyItems);
dailyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

weeklyGoalsForm.addEventListener('submit', handleSubmit);
weeklyList.addEventListener('itemsUpdated', displayWeeklyItems);
weeklyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

monthlyGoalsForm.addEventListener('submit', handleSubmit);
monthlyList.addEventListener('itemsUpdated', displayMonthlyItems);
monthlyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

yearlyGoalsForm.addEventListener('submit', handleSubmit);
yearlyList.addEventListener('itemsUpdated', displayYearlyItems);
yearlyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

dailyList.addEventListener('click', (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches('button')) {
    deleteItem(id);
  }
  if (e.target.matches('input[type="checkbox"]')) {
    dailyMarkAsComplete(id);
  }
});

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



// timer that works but doesn't let you pause and restart

// this code works but we're trying to use clearInterval to stop the timer from going
// function toggleTimer() {
//   const startTime = new Date().getTime();
//   let counter = setInterval(function() {
//     let now = new Date().getTime();

//     let distance = now - startTime;

//     let days = Math.floor(distance / (1000 * 60 * 60 * 24));
//     let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     let seconds = Math.floor((distance % (1000 * 60)) / 1000);

//     timer.innerHTML = `${days < 10? '0' + days: days}:${hours < 10? '0' + hours: hours}:${minutes < 10? '0' + minutes: minutes}:${seconds < 10? '0' + seconds : seconds}`;
//   }, 1000);
// }

// trying to use clearInterval to stop the timer from going.. second timer that also works but not with pausing

// const timer = document.querySelector('.timer');

// let startTime;
// let counter, hoursElapsed, minutesElapsed, secondsElapsed;
// let hoursAtStop, minutesAtStop;
// let endTime;
// let timeElapsed = 0;
// let distance = 0;
// let distanceAtStop = 0;

// let msPerSecond;

// let cumulativeSeconds = 0;

// function startTimer() {
//   startTime = new Date().getTime(); 
//   counter = setInterval(function() {
//     let now = new Date().getTime(); 

//     distance = now - startTime; // ms
//     hoursElapsed = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     minutesElapsed = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//     secondsElapsed = Math.floor((distance % (1000 * 60)) / 1000); 


//     timer.innerHTML = `${hoursElapsed}:${minutesElapsed}:${secondsElapsed}`;
//   }, 1000);
// }

// function stopTimer() {
//   clearInterval(counter);
//   hoursAtStop = hoursElapsed;
//   minutesAtStop = minutesElapsed;
//   distanceAtStop = distance;
//   endTime = new Date().getTime();
//   timeElapsed = endTime - startTime;
//   cumulativeSeconds += Math.floor((timeElapsed % (1000 * 60)) / 1000);

//   console.log(cumulativeSeconds);


// }

// const startButton = document.querySelector('.startButton');
// const stopButton = document.querySelector('.stopButton');

// startButton.addEventListener('click', startTimer);
// stopButton.addEventListener('click', stopTimer);

// we can safe this if we need to use it in the table to show the days!
// let days = Math.floor(distance / (1000 * 60 * 60 * 24));

// third timer-- using notes from wes bos
// lets try to do seconds and minutes first

// store interval in its own variable

let counter;
let secondsElapsed; 
let cumulativeSeconds = 0;
let segmentSeconds = 0;

// flag variable to say whether the timer is going 
let timerGoing = false;

let timerItems = [];

const timerDisplay = document.querySelector('.timerDisplay');
// timerDisplay.textContent = '00:00';

// could do a selector to show what the time was for your last sprint

// const startButton = document.querySelector('.startButton');
// const stopButton = document.querySelector('.stopButton');



const playButton = document.querySelector('.playButton');

function startTimer() {
  clearInterval(counter);
  const startTime = Date.now();
  
  // timerGoing = true;
  timerGoing = !timerGoing;
  

  displayTimeElapsed(cumulativeSeconds);
  
  // const then = now + timeElapsed;

  counter = setInterval(() => {
    segmentSeconds = Math.round((Date.now() - startTime) / 1000);
    secondsElapsed = segmentSeconds + cumulativeSeconds;
    displayTimeElapsed(secondsElapsed);
  }, 1000);
  

}

function displayTimeElapsed(seconds) {
    // console.log(seconds);
    // const hours = Math.floor(seconds/60/60);
    const hours = Math.floor(seconds/(60*60));
    const minutes = Math.floor(seconds/60) % 60;
    const remainderSeconds = seconds % 60;
    const display = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
    document.title = display;
}

function stopTimer() {
  clearInterval(counter);
  
  cumulativeSeconds = secondsElapsed;
  // timerGoing = false;
  timerGoing = !timerGoing;
  const stopTime = Date.now();
  console.log(stopTime);
  
}

function toggle(){
    if(!timerGoing) {
      startTimer();
      playButton.textContent = '❚ ❚';
    } else {
      stopTimer();
      playButton.textContent = '►';
      saveTime();
      // displayTimes();
      
    }
    
}

const timeTable = document.querySelector('.timeTable');

let todayTotal = 0;
let thisMonthTotal = 0;
let thisYearTotal = 0;
let allTimeTotal = 0;

function saveTime() {
  console.log(secondsElapsed, segmentSeconds);
  const timerItem = {
    segmentSeconds,
    secondsElapsed,
    id: Date.now(),
  }

  console.log(timerItem);


  const pushTimerItems = () => {
    timerItems.push(timerItem);
    timeTable.dispatchEvent(new CustomEvent('timerItemsUpdated'));
    // console.log(timerItems);

  }

  // this is a way to get the table to show the correct amount of "all time" seconds
  // i think it would be better to do this in a different section...
  // i think i should save to local storage first...
  // allTimeTime += timerItem.segmentSeconds;
  // console.log(`All time counter: ${allTimeTime}`);



  pushTimerItems();
  // displayTimes();
}

const todaySlot = document.querySelector('.todaySlot');
const thisMonthSlot = document.querySelector('.thisMonthSlot');
const thisYearSlot = document.querySelector('.thisYearSlot');
const allTimeSlot = document.querySelector('.allTimeSlot');


todaySlot.textContent = 0;
thisMonthSlot.textContent = 0;
thisYearSlot.textContent = 0;
allTimeSlot.textContent = 0;


function displayTimerItems() {
  // console.log('displaying timer items!');

  // function reducerFunction(accumulator, timerItem) {
  //   return accumulator + timerItem.segmentSeconds;
  // }

  function formatSeconds(seconds, element) {
    const hours = Math.floor(seconds/(60*60));
    const minutes = Math.floor(seconds/60) % 60;
    const remainderSeconds = seconds % 60;
    const display = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    element.textContent = display;
  }

  // handling all time case
  allTimeTotal = timerItems.reduce(function(accumulator, timerItem) {
    return accumulator + timerItem.segmentSeconds
  }, 0);


  // allTimeSlot.textContent = allTimeTotal;

  formatSeconds(allTimeTotal, allTimeSlot);

  // handling year case 
  let today = new Date();
  let todayYear = today.getFullYear();
  

  const thisYearArray = timerItems.filter(timerItem => {
    let timerItemDate = new Date(timerItem.id);
    let timerItemYear = timerItemDate.getFullYear();
    return timerItemYear === todayYear;
    // return timerItem.segmentSeconds === 5;
    
    
  })

  thisYearTotal = thisYearArray.reduce(function(accumulator, timerItem) {
    return accumulator + timerItem.segmentSeconds
  }, 0);

  // thisYearSlot.textContent = thisYearTotal;
  formatSeconds(thisYearTotal, thisYearSlot);

  // handling month case 
  let todayMonth = today.getMonth();
  // console.log(todayMonth);

  const thisMonthArray = timerItems.filter(timerItem => {
    let timerItemDate = new Date(timerItem.id);
    let timerItemMonth = timerItemDate.getMonth();
    let timerItemYear = timerItemDate.getFullYear();
    return timerItemMonth === todayMonth && timerItemYear === todayYear;
  })

  // console.log(thisMonthArray)

  thisMonthTotal = thisYearArray.reduce(function(accumulator, timerItem) {
    return accumulator + timerItem.segmentSeconds
  }, 0);

  // thisMonthSlot.textContent = thisMonthTotal;
  formatSeconds(thisMonthTotal, thisMonthSlot);

  // handling the today case
  let todayDate = today.getDate();
  
  const thisDayArray = timerItems.filter(timerItem => {
    let timerItemDate = new Date(timerItem.id);
    let timerItemDay = timerItemDate.getDate();
    let timerItemMonth = timerItemDate.getMonth();
    let timerItemYear = timerItemDate.getFullYear();

    return timerItemDay === todayDate && timerItemMonth === todayMonth && timerItemYear === todayYear;
  })
  
  todayTotal = thisDayArray.reduce(function(accumulator, timerItem) {
    return accumulator + timerItem.segmentSeconds
  }, 0);

  // todaySlot.textContent = todayTotal;
  formatSeconds(todayTotal, todaySlot);
  


}

function mirrorTimerItemsToLocalStorage() {
  localStorage.setItem('timerItems', JSON.stringify(timerItems));
}

function restoreTimerItemsFromLocalStorage() {
  const timerLSItems = JSON.parse(localStorage.getItem('timerItems')) || [];
  if (timerLSItems.length) {
    timerItems.push(...timerLSItems);
    timeTable.dispatchEvent(new CustomEvent('timerItemsUpdated'));
  }
}




// function displayTimes() {
//   let today = String(new Date(Date.now())).slice(0, 15);
//   console.log(timerItems);
  
//   timerItems.forEach((timerItem) => {
//     console.log(timerItem.id);
//     console.log(timerItem.segmentSeconds);
//     allTimeTime = allTimeTime + timerItem.segmentSeconds;
//     console.log(allTimeTime);

//     // allTimeTime += timerItem.segmentSeconds;
//     // console.log(allTimeTime);

//     // let msDate = parseInt(timerItem.id);
//     // let date = String(new Date(msDate)).slice(0, 15);

//     // console.log(date);
//     // console.log(today);
//     // console.log(date === today);

    



//   })


// }


// you don't need these if you have a toggle button
// startButton.addEventListener('click', startTimer);
// stopButton.addEventListener('click', stopTimer);


playButton.addEventListener('click', toggle);
timeTable.addEventListener('timerItemsUpdated', displayTimerItems);
timeTable.addEventListener('timerItemsUpdated', mirrorTimerItemsToLocalStorage);

// showing how long you've coded for 

// adding a reset button

restoreTimerItemsFromLocalStorage();

