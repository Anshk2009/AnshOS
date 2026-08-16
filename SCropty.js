/* ==========================================================
   AnshOS - all my javascript
   i wrote comments everywhere so i dont forget how it works
   ========================================================== */


/* ==========================================================
   PART 2 - THE CLOCK IN THE TOP BAR
   ========================================================== */

// this function gets the time right now and puts it in the top bar
function updateTime() {
  var currentTime = new Date().toLocaleString();
  document.querySelector("#timeElement").innerHTML = currentTime;
}

updateTime();              // run it once straight away so it isnt blank
setInterval(updateTime, 1000);  // then run it again every 1000ms (1 second)


/* ==========================================================
   PART 3 - DRAGGING THE WINDOWS AROUND
   i got this dragElement function from W3Schools and then
   added comments so i actually understand what it does
   ========================================================== */

function dragElement(element) {
  // these 4 numbers keep track of how far the mouse moved
  var pos1 = 0;
  var pos2 = 0;
  var pos3 = 0;
  var pos4 = 0;

  // if there is a header div then you can only drag from the header
  if (document.getElementById(element.id + "header")) {
    document.getElementById(element.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise you can drag from anywhere on the window
    element.onmousedown = dragMouseDown;
  }

  // this runs the moment you press the mouse down
  function dragMouseDown(e) {
    e.preventDefault(); // stops the browser trying to drag it like an image

    // remember where the mouse started
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;   // when you let go, stop
    document.onmousemove = elementDrag;      // while moving, move the window
  }

  // this runs over and over while you are moving the mouse
  function elementDrag(e) {
    e.preventDefault();

    // work out how far the mouse moved since last time
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // then move the window by that same amount
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  // this runs when you let go of the mouse
  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


/* ==========================================================
   PART 3 + 4 - OPENING, CLOSING AND STACKING WINDOWS
   ========================================================== */

// this remembers which window is on top of the pile
var biggestIndex = 1;

// hide a window
function closeWindow(element) {
  element.style.display = "none";
}

// show a window AND bring it to the front
function openWindow(element) {
  element.style.display = "flex";
  handleWindowTap(element);
}

// this makes the window you clicked jump in front of the others
function handleWindowTap(element) {
  biggestIndex = biggestIndex + 1;
  element.style.zIndex = biggestIndex;
}

// i was copy pasting the same 4 lines for every window so i made this instead.
// you give it a name like "notes" and it wires up the whole window for you.
function initializeWindow(name) {
  var theWindow = document.querySelector("#" + name);
  var closeButton = document.querySelector("#" + name + "close");
  var openIcon = document.querySelector("#" + name + "open");

  // make it draggable by its header
  dragElement(theWindow);

  // clicking the red dot hides it
  closeButton.addEventListener("click", function () {
    closeWindow(theWindow);
  });

  // clicking anywhere on the window brings it to the front
  theWindow.addEventListener("mousedown", function () {
    handleWindowTap(theWindow);
  });

  // clicking the desktop icon opens it (and selects the icon)
  openIcon.addEventListener("click", function () {
    handleIconTap(openIcon);
    openWindow(theWindow);
  });
}

// now i just call it once per app :)
initializeWindow("welcome");
initializeWindow("notes");
initializeWindow("projects");


/* ==========================================================
   PART 4 - MAKING THE ICONS LOOK SELECTED WHEN YOU CLICK THEM
   ========================================================== */

// this remembers which icon is currently selected (undefined = none)
var selectedIcon = undefined;

function handleIconTap(icon) {
  // if an icon was already selected, un-highlight it first
  if (selectedIcon != undefined) {
    selectedIcon.classList.remove("selected");
  }

  if (icon.classList.contains("selected")) {
    // it was already the selected one so now nothing is selected
    icon.classList.remove("selected");
    selectedIcon = undefined;
  } else {
    // otherwise highlight the new one
    icon.classList.add("selected");
    selectedIcon = icon;
  }
}


/* ==========================================================
   PART 4 - THE NOTES APP
   all my notes live in this list. to add a new note i just
   add another { } block here and the app does the rest.
   ========================================================== */

var content = [
  {
    title: "Why I made this",
    date: "15/08/2026",
    content: `
      <h2>Why I made this</h2>
      <p>
        A normal portfolio site is just scrolling. This one you have to
        <b>poke at</b>. People remember poking at things.
      </p>
      <p>I built it from the Hack Club webOS jam over a weekend.</p>
    `
  },
  {
    title: "How the windows work",
    date: "14/08/2026",
    content: `
      <h2>How the windows work</h2>
      <p>
        Every window is just a <b>div</b> with position absolute.
        Dragging it is only 2 lines really - you take how far the mouse
        moved and add it to the divs top and left.
      </p>
      <p>The hardest bit was z-index. I kept opening windows behind other ones.</p>
    `
  },
  {
    title: "Stuff I still want to add",
    date: "13/08/2026",
    content: `
      <h2>Stuff I still want to add</h2>
      <ul>
        <li>A music player 🎵</li>
        <li>Minimise buttons (the yellow dot)</li>
        <li>Making the windows resizable</li>
        <li>A right click menu on the desktop</li>
      </ul>
    `
  }
];

// puts one note into the big area on the right
function setNotesContent(index) {
  var note = content[index];
  document.querySelector("#notesContent").innerHTML = note.content;
  // i also make the window title say which note you are reading
  document.querySelector("#notestitle").innerHTML = "Notes - " + note.title;
}

// makes one clickable row in the left hand list
function addToSideBar(index) {
  var note = content[index];

  // make a brand new div out of nothing
  var card = document.createElement("div");
  card.className = "notecard";
  card.innerHTML = `
    <p class="notetitle">${note.title}</p>
    <p class="notedate">${note.date}</p>
  `;

  // when you click the row, show that note
  card.addEventListener("click", function () {
    setNotesContent(index);
  });

  // and finally stick it inside the sidebar
  document.querySelector("#notesSidebar").appendChild(card);
}

// this loop runs once for every note in my list above
for (let i = 0; i < content.length; i++) {
  addToSideBar(i);
}


/* ==========================================================
   PART 5 - THE PROJECTS APP (my advanced app)
   same idea as the notes app but the cards are in a grid
   and the description shows underneath
   ========================================================== */

var projects = [
  {
    name: "🤖 Discord Bot",
    info: "A bot for my server that does tickets and a leaderboard. Written in discord.js. It has been online for 4 months and only crashed twice."
  },
  {
    name: "📈 EconIntel",
    info: "A site that explains economics news in normal english. My biggest project so far - it has actual logins and a database."
  },
  {
    name: "🧠 Second Brain",
    info: "A little memory system that remembers what I was working on so I dont have to. Mostly python."
  },
  {
    name: "💻 This OS",
    info: "The thing you are literally clicking on right now. HTML, CSS and about 200 lines of javascript. No libraries!"
  }
];

// shows the description of whichever project you tapped
function showProject(index) {
  var project = projects[index];
  document.querySelector("#projectsInfo").innerHTML = `
    <p style="margin: 0px; font-weight: bold;">${project.name}</p>
    <p style="margin: 6px 0px 0px 0px;">${project.info}</p>
  `;
}

// makes one project card
function addProjectCard(index) {
  var project = projects[index];

  var card = document.createElement("div");
  card.className = "projectcard";
  card.innerHTML = project.name;

  card.addEventListener("click", function () {
    showProject(index);
  });

  document.querySelector("#projectsGrid").appendChild(card);
}

// and again a loop so i never have to touch this part when i add a project
for (let i = 0; i < projects.length; i++) {
  addProjectCard(i);
}


/* ==========================================================
   little extra - clicking the empty desktop unselects the icon
   ========================================================== */
document.body.addEventListener("mousedown", function (e) {
  // e.target is the exact thing you clicked on.
  // if it was the body itself then you clicked empty space.
  if (e.target == document.body && selectedIcon != undefined) {
    selectedIcon.classList.remove("selected");
    selectedIcon = undefined;
  }
});
