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
    listItem.className = "checklist-button"
    listItem.id = list.id
    listItem.innerHTML = `<img src="./img/list.svg">
    <p>${list.name}</p>`
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
  let left = document.createElement("left")
  currentList.appendChild(left)
  checklistItems.forEach(item => {
    let listItem = document.createElement("li")
    listItem.innerHTML = `<input type="checkbox" name="check-off" class="check-off"> ${item.content}`
    currentList.appendChild(listItem)
  })
  currentList.appendChild(left)
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
  <button class="list-edit" id="add-update-item">Add Item: <img src="./img/add.svg" class="small-image"></button>`
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
  event.preventDefault();
  event.stopPropagation();
  makeInputForm()
  let newList = document.querySelector("#new-checklist")
  newList.style.display = "flex"
})

const name_list = document.querySelector("#name-form")
const items_list = document.querySelector("#items-form")

function makeInputForm() {
  name_list.innerHTML = `
  <input id="submit" type="submit" value="Add New Checklist"></submit>
  <label for="name">Name:</label>
  <input id="name" name="name" required>`
  items_list.innerHTML = `
  <input id="submit" type="submit" value="Add Items"></submit>
  <label for="item">Items: <button id="add-item"><img src="./img/add.svg" class="small-image"></button></label>
  <input class="item" name="item" required>`
  items_list.style = "display: none;"
  name_list.style = "display: flex;"
}

document.querySelectorAll(".close-btn").forEach(closeButton => {
  closeButton.addEventListener("click", () => {
    refresh()
    close()
    initList()
  })
})

document.querySelector("#cl").addEventListener("click", () => {
  event.preventDefault()
  if (event.target.type === "submit") {
    let showList = document.querySelector("#checklist-overlay")
    showList.style.display = "flex";
    let id = event.target.id;
    fetch(`http://localhost:3000/checklists/${id}`)
      .then(response => response.json())
      .then(checklist => createItems(checklist, checklist.items))
    }
})

function addItem() {
  document.querySelector("#add-item").addEventListener("click", () => {
    event.preventDefault()
    let newItem = document.createElement("input")
    newItem.className = "item"
    newItem.name = "item"
    items_list.appendChild(newItem)
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

name_list.addEventListener("submit", () => {
  event.preventDefault()
  let listName = document.querySelector("#name").value;
  fetch('http://localhost:3000/checklists', {
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    method: 'POST',
    body: JSON.stringify({
      name: listName,
    })
  })
  name_list.style = "display: none;"
  items_list.style = "display: flex;"
  addItem()
})

items_list.addEventListener("submit", () => {
  event.preventDefault()
  fetch('http://localhost:3000/checklists')
    .then(response => response.json())
    .then(checklists => {
      let listItems = document.querySelectorAll(".item")
      let itemArray = []
      let index = checklists[checklists.length - 1].id
      listItems.forEach(item => {
        let itemObject = {content: item.value, checklist_id: index}
        itemArray.push(itemObject)
      }),
      fetch('http://localhost:3000/items', {
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'POST',
        body: JSON.stringify({item: itemArray})
      })
    refresh();
    close();
    })
})

function updateAll(listID) {
  document.querySelector("#list-container").addEventListener("submit", () => {
    event.preventDefault();
    let listName = document.querySelector("#edit-name").value;
    fetch(`http://localhost:3000/checklists/${listID}`, {
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      method: 'PATCH',
      body: JSON.stringify({
        name: listName,
        })
      })
    let listItems = document.querySelectorAll(".edit-item")
    let itemArray = []
    listItems.forEach(item => {
      let itemObject = {content: item.value, checklist_id: listID}
      itemArray.push(itemObject)
      }),
      fetch('http://localhost:3000/items', {
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        method: 'POST',
        body: JSON.stringify({item: itemArray})
      })
      refresh()
      close()
    })
}


async function refresh() {
  let refresh = await fetch("http://localhost:3000/checklists")
  let lists = await refresh.json()
  createChecklists(lists)
}

function close() {
  document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.style.display = "none";
  })
}

function deleteList(id) {
  document.querySelector("#delete").addEventListener("click", () => {
    event.preventDefault()
    let confirmation = confirm("Are you sure you want to delete this list?")
    if (confirmation == true) {
      fetch(`http://localhost:3000/checklists/${id}`, {
        method: 'DELETE'
        })
      refresh()
      close()
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