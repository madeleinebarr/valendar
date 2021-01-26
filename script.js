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

// const dayOfWeek = dateString.slice(0, 3);
// console.log(dayOfWeek);

// datebar.appendChild(todaysdate);
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

const columns = document.querySelectorAll('.column');
const rows = document.querySelectorAll('.row');

scheduleDaysArray.forEach((day) => {
  const dayColumn = document.querySelector(`.column${day}`);
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
      console.log(scheduleItem);
    
      const pushScheduleItems = () => {
        scheduleItems[timedayslot].push(scheduleItem);
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
      }
    
      pushScheduleItems();
    
      e.target.reset();
    }

    // added a label here in case you want to show the time like on ical
    // could also add this button html after span: <button aria-label="remove ${item.name}" value="${item.id}">&times;</button>
    
    // this is the original function which works
    // function displayScheduleItems() {
    //   const html = scheduleItems[timedayslot].map((item) => `
    //     <li class="scheduleItem" draggable="true" id="${item.id}">${item.name}</li>
    //   `).join('');
    //   scheduleList.innerHTML = html;
    //   scheduleForm.classList.add('hidden');
      
    //   scheduleSlot.classList.add('scheduledEvent');
    //   const lists = document.querySelectorAll('.scheduleItem');
    // }

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

      
      const lists = document.querySelectorAll('.scheduleItem');
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

    // function createEvent(e) {
//   const clickedSlot = e.currentTarget;

//   // add the class that it is a scheduled event
//   clickedSlot.classList.add('scheduledEvent');

//   // show the form
//   const clickedForm = clickedSlot.querySelector('.scheduleform');
//   clickedForm.classList.remove('hidden');
// }

    function createEvent(e) {
      // console.log(e.currentTarget);
      // const clickedSlot = e.currentTarget;
      // clickedSlot.classList.add('scheduledEvent');
      scheduleSlot.classList.add('scheduledEvent');

      // scheduleForm.classList.add('scheduledForm');
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
      console.log(data);
      e.dataTransfer.setData("text", data);
      // console.log(e.target.id);
      console.log('dragged from');
      console.log(this);
      let giveSlot = this.parentElement.classList[3];
      console.log(giveSlot);

      console.log(scheduleItems[giveSlot]);

      // remove item from scheduleItems[giveSlot] 

      function deleteItem(id) {
        console.log('deleting item', giveSlot, id);
        scheduleItems[giveSlot] = scheduleItems[giveSlot].filter((item) => item.id !== id);
        // dispatch event
        // this makes the events disappear from the schedule and also makes them disappear from local storage
        // scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
        scheduleList.dispatchEvent(new CustomEvent('scheduleItemsDragged'));
      } 

      let idNumber = parseInt(data);

      deleteItem(idNumber);
      console.log(scheduleItems[giveSlot]);


      // console.log(e.target);
      if(!scheduleItems[giveSlot].length) {
      scheduleSlot.classList.remove('scheduledEvent');
      }
      // console.log(scheduleItem);
      // const timeLabel = this.parentElement.firstElementChild;
      
      // console.log(timeLabel);
      // timeLabel.remove();
    }

    function drop(e) {
      e.preventDefault();
      let receiveSlot = this.classList[3];
      console.log('dragged to');
      console.log(receiveSlot);
      
      let data = e.dataTransfer.getData("text");
      const thisUL = this.querySelector('ul');
      // console.log(thisUL);
      thisUL.appendChild(document.getElementById(data));

      console.log(scheduleItems[receiveSlot]);

      // add item to scheduleItems[receiveSlot]
      const draggedItemElement = document.getElementById(data);
      console.log(draggedItemElement);
      console.log(draggedItemElement.textContent);

      // const name = draggedItemElement.textContent.replace('\n', '');
      const name = draggedItemElement.textContent;
      // nameString = name.replace('')
      console.log(name);

      const id = parseInt(data);

      console.log(parseInt(data));
      // console.log(e.currentTarget);

      // creating an item to push into the slot
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
      console.log(scheduleItems[receiveSlot]);


      scheduleSlot.classList.add('scheduledEvent');
      // console.log(data);

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



// const scheduleforms = document.querySelectorAll('.scheduleform');
// const schedulelists = document.querySelectorAll('.scheduleList');

// function handleScheduleSubmit(e) {
//   e.preventDefault();
//   const name = e.currentTarget.item.value;
//   if (!name) { return; }

//   const scheduleItem = {
//     name,
//     id: Date.now(),
//     complete: false,
//     timedayslot: e.currentTarget.item.id,
//   }
//   console.log(scheduleItem);

//   const pushScheduleItems = () => {
//     scheduleItems[scheduleItem.timedayslot].push(scheduleItem);
//     scheduleTable.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   }

//   pushScheduleItems();

//   e.target.reset();
// }

// function displayScheduleItems() {
//   console.log('displaying schedule items');
// }

// scheduleforms.forEach((scheduleform) => {
//   scheduleform.addEventListener('submit', handleScheduleSubmit);
// })

// schedulelists.forEach((schedulelist) => {
//   schedulelist.addEventListener('scheduleItemsUpdated', displayScheduleItems);
// })

// scheduleTable.addEventListener('scheduleItemsUpdated', displayScheduleItems);

// const slots = document.querySelectorAll('.slot');

// function createEvent(e) {
//   const clickedSlot = e.currentTarget;

//   // add the class that it is a scheduled event
//   clickedSlot.classList.add('scheduledEvent');

//   // show the form
//   const clickedForm = clickedSlot.querySelector('.scheduleform');
//   clickedForm.classList.remove('hidden');
// }

// slots.forEach((slot) => {
//   slot.addEventListener('dblclick', createEvent);
// })

// style it as an event
  // clickedSlot.style['background-color'] = 'var(--peachy)';
  // clickedSlot.style.border = '2px solid var(--grapefizz)';


// let scheduleItems = [];

// function handleScheduleSubmit(e) {
//   const currentForm = e.currentTarget;
//   console.log(currentForm);
//   // const currentForm = currentSlot.querySelector('.scheduleform');

//   e.preventDefault();
//   const name = e.currentTarget.item.value;
//   console.log(name);

//   if (!name) { return; }

//     const scheduleItem = {
//             name,
//             id: Date.now(),
//             complete: false,
//             time: currentForm.item.id,
//           };
//   console.log(scheduleItem);

//       const pushScheduleItems = () => {
//         scheduleItems.push(scheduleItem);
//         currentForm.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//       }

//       pushScheduleItems();

//       e.target.reset();

//       const scheduleOutput = document.createElement('p');
//       scheduleOutput.textContent = name;

//       currentForm.insertAdjacentElement('afterend', scheduleOutput);
//       currentForm.classList.add('hidden');
// }

// // this localstorage code pushes it to local storage but does not restore it
// function mirrorScheduleToLocalStorage() {
//   localStorage.setItem('scheduleItems', JSON.stringify(scheduleItems));
// }

// function restoreScheduleFromLocalStorage() {
//   const scheduleLSItems = JSON.parse(localStorage.getItem('scheduleItems'));
//   if (scheduleLSItems.length) {
//     scheduleItems.push(...scheduleLSItems);
//     scheduleTable.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//     console.log(scheduleLSItems);
//     console.log(scheduleItems);
//   }
//   scheduleItems.forEach((item) => {
//     console.log(item.name, item.time);
//     const restoredScheduleOutput = document.createElement('p');
//     restoredScheduleOutput.textContent = item.name;
//     console.log(restoredScheduleOutput);
//   });
// }


// slots.forEach((slot) => {
//   slot.addEventListener('dblclick', createEvent);
// })

// const scheduleforms = document.querySelectorAll('.scheduleform');

// scheduleforms.forEach((scheduleform) => {
//   scheduleform.addEventListener('submit', handleScheduleSubmit);
//   scheduleform.addEventListener('scheduleItemsUpdated', mirrorScheduleToLocalStorage);

// })

// restoreScheduleFromLocalStorage();












// MOOD TRACKER SECTION

// javascript for creating the squares



// const squares = document.querySelector('.squares');


// const moodTrackerForm = document.querySelector('.moodTrackerForm');

// const moods = moodTrackerForm.querySelectorAll('input[type="radio"]');


// // creating a place to store our daily moods
// let moodItems = [];

// // create a handleSubmit function for the mood tracker

// function handleMoodSubmit(e) {
//   e.preventDefault();
//   for (let i=0; i < moods.length; i++) {
//     if (moods[i].checked) {
//       // console.log(moods[i]);

//       const name = moods[i].value;
//       // console.log(name);
//       if (!name) { return; }

//       const moodItem = {
//         name,
//         id: Date.now(),
//       };

//       const pushMoodItems = () => {
//         moodItems.push(moodItem);
   
//       }

//       pushMoodItems();


//     }
//   }
//   squares.dispatchEvent(new CustomEvent('moodItemsUpdated'));
//   e.target.reset();
// }



// function displayMoodSquare() {
 

//   const html = moodItems.map((item) => `<li class=${item.name}></li>`).join('');
//   squares.innerHTML = html;

// }

// function mirrorMoodToLocalStorage() {
//   localStorage.setItem('moodItems', JSON.stringify(moodItems));
// }

// function restoreMoodFromLocalStorage() {
//   const moodLSItems = JSON.parse(localStorage.getItem('moodItems'));
//   if (moodLSItems.length) {
//     moodItems.push(...moodLSItems);
//     squares.dispatchEvent(new CustomEvent('moodItemsUpdated'));
//   }
// } 







// moodTrackerForm.addEventListener('submit', handleMoodSubmit);
// squares.addEventListener('moodItemsUpdated', displayMoodSquare);
// squares.addEventListener('moodItemsUpdated', mirrorMoodToLocalStorage);

// restoreMoodFromLocalStorage();


// // **GOALS LIST FUNCTIONALITY I LUV U MADILE**

// const weeklyGoalsForm = document.querySelector('.weeklyGoals');
// const weeklyList = document.querySelector('.weeklyList');

// const monthlyGoalsForm = document.querySelector('.monthlyGoals');
// const monthlyList = document.querySelector('.monthlyList');

// const yearlyGoalsForm = document.querySelector('.yearlyGoals');
// const yearlyList = document.querySelector('.yearlyList');

// // need an array to hold all of our items (our state)

// let weeklyItems = [];
// let monthlyItems = [];
// let yearlyItems = [];

// // listen for a submit event on the form and do a bunch of stuff when that happens
// // here, the e being passed in is the event

// function handleSubmit(e) {
//   e.preventDefault();
//   const name = e.currentTarget.item.value;
//   if (!name) { return; }
//   // console.log(name);

//   const item = {
//     name,
//     id: Date.now(),
//     complete: false,
//   };

//   const pushItems = () => {
//     if (this.classList[0] === 'weeklyGoals') {
//       weeklyItems.push(item);
//       // console.log(`There are now ${weeklyItems.length} weekly items in your state`);
//       // console.log('You are on the weekly goals list');
//       weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//     } else if (this.classList[0] === 'monthlyGoals') {
//       monthlyItems.push(item);
//       // console.log(`There are now ${monthlyItems.length} monthly items in your state`);
//       // console.log('You are on the monthly goals list');
//       monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//     } else if (this.classList[0] === 'yearlyGoals') {
//       yearlyItems.push(item);
//       // console.log(`There are now ${yearlyItems.length} yearly items in your state`);
//       // console.log('You are on the yearly goals list');
//       yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//     } else {
//       console.log('It appears you are not on any list');
//     }
//   };

//   pushItems();

//   // clear the form
//   e.target.reset();
// }

// function displayWeeklyItems() {
//   const html = weeklyItems.map((item) => `<li class="shopping-item">
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//   weeklyList.innerHTML = html;
// }

// function displayMonthlyItems() {
//   const html = monthlyItems.map((item) => `<li class="shopping-item">
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//   monthlyList.innerHTML = html;
// }

// function displayYearlyItems() {
//   const html = yearlyItems.map((item) => `<li class="shopping-item">
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//   yearlyList.innerHTML = html;
// }

// function mirrorToLocalStorage() {
//   // console.info('saving items to localstorage');
//   if (this.classList[0] === 'weeklyList') {
//     localStorage.setItem('weeklyItems', JSON.stringify(weeklyItems));
//     // console.log('we pushed weekly items to local storage');
//   } else if (this.classList[0] === 'monthlyList') {
//     localStorage.setItem('monthlyItems', JSON.stringify(monthlyItems));
//     // console.log('we pushed monthly items to local storage');
//   } else if (this.classList[0] === 'yearlyList') {
//     localStorage.setItem('yearlyItems', JSON.stringify(yearlyItems));
//     // console.log('we pushed yearly items to local storage');
//   }
//   // console.log(this.classList[0]);
// }

// function restoreFromLocalStorage() {
//   // console.info('restoring from local storage');
//   // pull the items from local storage
//   const weeklyLSItems = JSON.parse(localStorage.getItem('weeklyItems'));
//   if (weeklyLSItems.length) {
//     weeklyItems.push(...weeklyLSItems);
//     weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//   }

//   const monthlyLSItems = JSON.parse(localStorage.getItem('monthlyItems'));
//   if (monthlyLSItems.length) {
//     monthlyItems.push(...monthlyLSItems);
//     monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//   }

//   const yearlyLSItems = JSON.parse(localStorage.getItem('yearlyItems'));
//   if (yearlyLSItems.length) {
//     yearlyItems.push(...yearlyLSItems);
//     yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//   }
// }

// function deleteItem(id) {
//   // console.log('deleting item!', id);
//   // if the id of the item is not equal to the one passed in, we keep it
//   weeklyItems = weeklyItems.filter((item) => item.id !== id);
//   // console.log(weeklyItems);
//   weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));

//   monthlyItems = monthlyItems.filter((item) => item.id !== id);
//   // console.log(monthlyItems);
//   monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));

//   yearlyItems = yearlyItems.filter((item) => item.id !== id);
//   // console.log(yearlyItems);
//   yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
// }

// function weeklyMarkAsComplete(id) {
//   // console.log('marking as complete', id);
//   // console.log(`markAsComplete this: ${this}`);
//   // find reference to the id that was passed in
//   const weeklyItemRef = weeklyItems.find((item) => item.id === id);
//   // setting it to the opposite of itself so it toggles
//   weeklyItemRef.complete = !weeklyItemRef.complete;
//   weeklyList.dispatchEvent(new CustomEvent('itemsUpdated'));
//   // console.log(`Weekly item ref here: ${weeklyItemRef.value}`);
// }

// function monthlyMarkAsComplete(id) {
//   const monthlyItemRef = monthlyItems.find((item) => item.id === id);
//   monthlyItemRef.complete = !monthlyItemRef.complete;
//   monthlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
// }

// function yearlyMarkAsComplete(id) {
//   const yearlyItemRef = yearlyItems.find((item) => item.id === id);
//   yearlyItemRef.complete = !yearlyItemRef.complete;
//   yearlyList.dispatchEvent(new CustomEvent('itemsUpdated'));
// }

// weeklyGoalsForm.addEventListener('submit', handleSubmit);
// weeklyList.addEventListener('itemsUpdated', displayWeeklyItems);
// weeklyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

// monthlyGoalsForm.addEventListener('submit', handleSubmit);
// monthlyList.addEventListener('itemsUpdated', displayMonthlyItems);
// monthlyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

// yearlyGoalsForm.addEventListener('submit', handleSubmit);
// yearlyList.addEventListener('itemsUpdated', displayYearlyItems);
// yearlyList.addEventListener('itemsUpdated', mirrorToLocalStorage);

// weeklyList.addEventListener('click', (e) => {
//   const id = parseInt(e.target.value);
//   if (e.target.matches('button')) {
//     deleteItem(id);
//   }
//   if (e.target.matches('input[type="checkbox"]')) {
//     weeklyMarkAsComplete(id);
//   }
// });

// monthlyList.addEventListener('click', (e) => {
//   const id = parseInt(e.target.value);
//   if (e.target.matches('button')) {
//     deleteItem(id);
//   }
//   if (e.target.matches('input[type="checkbox"]')) {
//     monthlyMarkAsComplete(id);
//   }
// });

// yearlyList.addEventListener('click', (e) => {
//   const id = parseInt(e.target.value);
//   if (e.target.matches('button')) {
//     deleteItem(id);
//   }
//   if (e.target.matches('input[type="checkbox"]')) {
//     yearlyMarkAsComplete(id);
//   }
// });

// // run on pageload
// restoreFromLocalStorage();



// const schedulePlan = document.querySelector('.plan');

// const timeArray = ['7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM'];


// // /* eslint-disable */
// const scheduleItems = [];
// const scheduleLSItems = [];
// //   /* eslint-enable */




// timeArray.forEach((time) => {
//   const planDiv = document.createElement('div');
//   planDiv.classList.add(`scheduleOutput${time}`);
//   schedulePlan.insertAdjacentElement('beforeend', planDiv);
//   planDiv.innerHTML = `
//   <form class="scheduleForm scheduleForm${time}" autocomplete="off">
//       <label for="time" name="time">${time}</label>
//       <input name="item" id="${time}" type="text">
//       <button type="submit">+</button>
//       </form>
//       <ul class="scheduleList${time}"></ul>
//   `;


//   const scheduleForm = document.querySelector(`.scheduleForm${time}`);
  

//   const scheduleList = document.querySelector(`.scheduleList${time}`);
//   // console.log(scheduleList);



//   scheduleItems[time] = [];
//   scheduleLSItems[time] = [];

//   function handleScheduleSubmit(e) {
//     e.preventDefault();
//     const name = e.currentTarget.item.value;
//     if (!name) { return; }

//     const scheduleItem = {
//             name,
//             id: Date.now(),
//             complete: false,
//             time: e.currentTarget.item.id,
//           };
//   // console.log(scheduleItem);

//       const pushScheduleItems = () => {
//         scheduleItems[time].push(scheduleItem);
//         // console.log(`There are now ${scheduleItems[time].length} schedule items in scheduleItems${time}`);
//         scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//       }

//       pushScheduleItems();

//       e.target.reset();

//   }

//   // displayscheduleitems that works
//   function displayScheduleItems() {
//     const html = scheduleItems[time].map((item) => `<li class="schedule-item">
//   <label>${item.time}</label>
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//     scheduleList.innerHTML = html;
//     scheduleForm.classList.add('hidden');

//   }

  

 

//   function mirrorScheduleToLocalStorage() {
//     localStorage.setItem(`scheduleItems[${time}]`, JSON.stringify(scheduleItems[time]));
//   }

//   function restoreScheduleFromLocalStorage() {
//     scheduleLSItems[time] = JSON.parse(localStorage.getItem(`scheduleItems[${time}]`));
//     if (scheduleLSItems[time].length) {
//       scheduleItems[time].push(...scheduleLSItems[time]);
//       scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//     }
//   }

//   function deleteScheduleItem(id) {
//     scheduleItems[time] = scheduleItems[time].filter((item) => item.id !== id);
//     scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   }

//   function scheduleMarkAsComplete(id) {
//     const itemRef = scheduleItems[time].find((item) => item.id === id);
//     itemRef.complete = !itemRef.complete;
//     scheduleList.dispatchEvent(new CustomEvent('scheduleItemsUpdated'));
//   }

//   scheduleForm.addEventListener('submit', handleScheduleSubmit);
//   scheduleList.addEventListener('scheduleItemsUpdated', displayScheduleItems);
//   scheduleList.addEventListener('scheduleItemsUpdated', mirrorScheduleToLocalStorage);

//   scheduleList.addEventListener('click', (e) => {
//     const id = parseInt(e.target.value);
//     if (e.target.matches('button')) {
//       deleteScheduleItem(id);
//       scheduleForm.classList.remove('hidden');
//     }
//     if (e.target.matches('input[type="checkbox"]')) {
//       scheduleMarkAsComplete(id);
//     }
//   })

//   restoreScheduleFromLocalStorage();
  
//   })

  
// // schedule result section

// const scheduleResult = document.querySelector('.result');

// // thinking I can use the same timeArray...

// // creating the empty arrays
// const resultItems = [];
// const resultLSItems = [];

// timeArray.forEach((time) => {
//   const resultDiv = document.createElement('div');
//   resultDiv.classList.add(`resultOutput${time}`);
//   scheduleResult.insertAdjacentElement('beforeend', resultDiv);
//   resultDiv.innerHTML = `
//   <form class="resultForm resultForm${time}" autocomplete="off">
//       <label for="time" name="time">${time}</label>
//       <input name="item" id="result${time}" type="text">
//       <button type="submit">+</button>
//       </form>
//       <ul class="resultList${time}"></ul>
//   `;


//   const resultForm = document.querySelector(`.resultForm${time}`);
//   // console.log(resultForm);

//   const resultList = document.querySelector(`.resultList${time}`);
//   // console.log(resultList);



//   resultItems[time] = [];
//   resultLSItems[time] = [];

//   function handleScheduleSubmit(e) {
//     e.preventDefault();
//     const name = e.currentTarget.item.value;
//     if (!name) { return; }

//     const resultItem = {
//             name,
//             id: Date.now(),
//             complete: false,
//             time: e.currentTarget.item.id,
//           };

//       const pushResultItems = () => {
//         resultItems[time].push(resultItem);
//         // console.log(`There are now ${resultItems[time].length} result items in resultItems${time}`);
//         resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
//       }

//       pushResultItems();

//       e.target.reset();

//   }

//   function displayResultItems() {
//     const html = resultItems[time].map((item) => `<li class="result-item">
//   <label>${item.time}</label>
//   <input value="${item.id}" type="checkbox" ${item.complete && 'checked'}>
//   <span class="itemName">  ${item.name} </span>
//   <button aria-label="remove ${item.name}"
//   value="${item.id}"
//   >&times;</button>
//   </li>`).join('');
//     resultList.innerHTML = html;
//     resultForm.classList.add('hidden');
//   }

 

//   function mirrorResultToLocalStorage() {
//     localStorage.setItem(`resultItems[${time}]`, JSON.stringify(resultItems[time]));
//   }

//   function restoreResultFromLocalStorage() {
//     resultLSItems[time] = JSON.parse(localStorage.getItem(`resultItems[${time}]`));
//     if (resultLSItems[time].length) {
//       resultItems[time].push(...resultLSItems[time]);
//       resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
//     }
//   }

//   function deleteResultItem(id) {
//     resultItems[time] = resultItems[time].filter((item) => item.id !== id);
//     resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
//   }

//   function resultMarkAsComplete(id) {
//     const itemRef = resultItems[time].find((item) => item.id === id);
//     itemRef.complete = !itemRef.complete;
//     resultList.dispatchEvent(new CustomEvent('resultItemsUpdated'));
//   }

//   resultForm.addEventListener('submit', handleScheduleSubmit);
//   resultList.addEventListener('resultItemsUpdated', displayResultItems);
//   resultList.addEventListener('resultItemsUpdated', mirrorResultToLocalStorage);

//   resultList.addEventListener('click', (e) => {
//     const id = parseInt(e.target.value);
//     if (e.target.matches('button')) {
//       deleteResultItem(id);
//       resultForm.classList.remove('hidden');
//     }
//     if (e.target.matches('input[type="checkbox"]')) {
//       resultMarkAsComplete(id);
//     }
//   })

//   restoreResultFromLocalStorage();
  
//   })

