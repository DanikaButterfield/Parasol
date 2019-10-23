window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/checklists")
    .then(response => response.json())
    .then(lists => createChecklists(lists))
});

function createChecklists(lists) {
  let checklists = document.querySelector("#cl")
  checklists.innerHTML = ""
  lists.forEach(list => {
    let listItem = document.createElement("button")
    listItem.class = "checklist-button"
    listItem.id = list.id
    listItem.innerHTML = `<img src="./img/list.svg"><br>${list.name}`
    checklists.appendChild(listItem)
  })
}

function createItems(checklist, checklistItems) {
  initList()
  let listName = document.querySelector("#list-name")
  listName.innerHTML = ``
  listName.style = "display: inline;"
  document.querySelectorAll(".list-edit").forEach(edit => {
    edit.style = "display: none;"
  })
  let editButton = document.createElement("button")
  editButton.id = "edit-button"
  let editIcon = document.createElement("img")
  editIcon.src = "./img/edit.svg"
  editIcon.className = "small-image"
  editButton.appendChild(editIcon)
  listName.appendChild(editButton)
  let name = document.createElement("span")
  name.innerText = checklist.name
  listName.appendChild(name)
  let currentList = document.querySelector("#current-list")
  currentList.innerHTML = ``
  checklistItems.forEach(item => {
    let listItem = document.createElement("li")
    listItem.innerHTML = `<input type="checkbox" name="check-off" class="check-off"> ${item.content}`
    currentList.appendChild(listItem)
  })
  initCheckbox()
  initEdit(listName)
  addUpdateItem()
  updateAll(checklist.id)
  deleteList(checklist.id)
}

function initList() {
  document.querySelector("#list-container").innerHTML = `
  <button class="list-edit" id="delete">Delete Checklist: <img src="./img/delete.svg" class="small-image"></button>
  <input class="list-edit" type="submit" id="commit-changes" value="Submit Changes">
  <p id="list-name">

  </p>
  <input class="list-edit" id="edit-name">
  <ul id="current-list">

  </ul>
  <button class="list-edit" id="add-update-item"><img src="./img/add.svg" class="small-image"></button>
  <input class="list-edit edit-item" id="edit-items">`
}

function initCheckbox() {
  document.querySelectorAll(".check-off").forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked == true) {
        event.target.parentNode.style = "text-decoration: line-through;"
        event.target.style = "pointer-events: none;"
      }
    })
  })
}

function initEdit(listName) {
  document.querySelector("#edit-button").addEventListener("click", () => {
    event.preventDefault();
    listName.style = "display: none;"
    document.querySelectorAll(".list-edit").forEach(edit => {
      edit.style = "display: inline;"
    })
    document.querySelector("#edit-name").value = listName.innerText
  })
}

document.querySelector("#add-checklist").addEventListener("click", () => {
  makeInputForm()
  let newList = document.querySelector("#new-checklist")
  newList.style.display = "flex";
})

function makeInputForm() {
  let inputForm = document.querySelector("#list-form")
  inputForm.innerHTML = `
  <input id="submit" type="submit" value="Add New List"></submit>
  <label for="name">Name:</label>
  <input id="name" name="name" required>
  <br>
  <label for="item">Items: <button id="add-item"><img src="./img/add.svg" class="small-image"></button></label>
  <input class="item" name="item" required>`
  addItem()
  submitAll()
}

document.querySelectorAll(".close-btn").forEach(closeButton => {
  closeButton.addEventListener("click", () => {
    refresh()
    initList()
  })
})

document.querySelector("#cl").addEventListener("click", () => {
  event.preventDefault()
  let showList = document.querySelector("#checklist-overlay")
  showList.style.display = "flex";
  let id = event.target.parentNode.id;
  fetch(`http://localhost:3000/checklists/${id}`)
    .then(response => response.json())
    .then(checklist => createItems(checklist, checklist.items))
})

function addItem() {
  document.querySelector("#add-item").addEventListener("click", () => {
    event.preventDefault()
    let inputForm = document.querySelector("#list-form")
    let newItem = document.createElement("input")
    newItem.className = "item"
    newItem.name = "item"
    inputForm.appendChild(newItem)
  })
}

function addUpdateItem() {
  document.querySelector("#add-update-item").addEventListener("click", () => {
    event.preventDefault()
    let inputForm = document.querySelector("#list-container")
    let newItem = document.createElement("input")
    newItem.className = "edit-item"
    newItem.name = "edit-item"
    inputForm.appendChild(newItem)
  })
}

function submitAll() {
  document.querySelector("#list-form").addEventListener("submit", () => {
    event.preventDefault();
    postList()
  })
}

function postList() {
  let listName = document.querySelector("#name").value;
  fetch('http://localhost:3000/checklists', {
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      name: listName,
    })
  })
  refresh()
  postItems()
}

function postItems() {
  let listItems = document.querySelectorAll(".item")
  listItems.forEach(item => {
    fetch("http://localhost:3000/checklists")
      .then(response => response.json())
      .then(checklist => {
        let index = checklist[checklist.length - 1]
            fetch('http://localhost:3000/items', {
              headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
              method: 'POST',
              body: JSON.stringify({
                content: item.value,
                checklist_id: index.id,
              })
            })
        })
  })
  refresh()
}

function updateAll(listID) {
  document.querySelector("#list-container").addEventListener("submit", () => {
    event.preventDefault();
    updateList(listID)
  })
}

function updateList(listID) {
  let listName = document.querySelector("#edit-name").value;
  fetch(`http://localhost:3000/checklists/${listID}`, {
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    method: 'PATCH',
    body: JSON.stringify({
      name: listName,
    })
  })
  refresh()
  updateItems(listID)
}

function updateItems(listID) {
  let listItems = document.querySelectorAll(".edit-item")
  listItems.forEach(item => {
    fetch("http://localhost:3000/checklists")
      .then(response => response.json())
      .then(checklist => {
        fetch('http://localhost:3000/items', {
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          method: 'POST',
          body: JSON.stringify({
            content: item.value,
            checklist_id: listID,
            })
          })
        })
    })
  refresh()
}


function refresh() {
  document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.style.display = "none";
  })
  fetch("http://localhost:3000/checklists")
    .then(response => response.json())
    .then(lists => createChecklists(lists))
}


function deleteList(id) {
  document.querySelector("#delete").addEventListener("click", () => {
    event.preventDefault()
    let confirmation = confirm("Are you sure you want to delete this list?")
    if (confirmation == true) {
      fetch(`http://localhost:3000/checklists/${id}`, {
        method: 'DELETE'
        })
        .then(sleep(1000))
        .then(refresh())
      }
    }
  )
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}