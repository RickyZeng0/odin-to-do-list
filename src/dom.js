import { Storage } from "./storage";

let currentSelectedProjectID = "d5fe9c2e-1889-4055-af23-6c2a4cb8b496";

function clearItemList(){
    const itemList = document.querySelector(".item-list");
    while(itemList.firstElementChild){
        itemList.removeChild(itemList.firstElementChild);
    }
    return itemList;
}

function clearAllItem(){
    const itemList = clearItemList();
    const itemListTitle = document.createElement("div");
    itemListTitle.classList.add("title");
    itemListTitle.textContent = "Please select an project";
    itemList.appendChild(itemListTitle);
}

function clearAllProject(){
    const projectList = document.querySelector(".project-list");
    while(projectList.children[1].className === "project"){
        projectList.removeChild(projectList.children[1]);
    }
}

function showProject(id , title){  
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    projectDiv.addEventListener("click",(e)=>{
        if(e.target.className !== "project-delete icon"){
            currentSelectedProjectID = id;
            reRenderAllItem(id, title);
        }
    });

    const projectImg = document.createElement("div");
    projectImg.classList.add("project-img","icon");

    const projectTitle = document.createElement("div");
    projectTitle.classList.add("project-title");
    projectTitle.textContent = title;

    const projectDelete = document.createElement("div");
    projectDelete.classList.add("project-delete","icon");
    projectDelete.addEventListener("click" , ()=>{
        Storage.deleteProject(id);
        reRenderAllProject();
        if(currentSelectedProjectID === id) clearAllItem();
    });

    projectDiv.append(projectImg, projectTitle, projectDelete);
    const projectList = document.querySelector(".project-list");
    const projectAddBtn =  projectList.lastElementChild;
    projectList.insertBefore(projectDiv , projectAddBtn);
}

function showItem(project ,item){
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type","checkbox");
    checkbox.checked = item.check;
    checkbox.addEventListener("click",()=>{
        Storage.toggleItem(project.id , item.id);
        reRenderAllItem(project.id , project.title);
    });

    const itemTitleDiv = document.createElement("div");
    itemTitleDiv.classList.add("item-title");
    itemTitleDiv.textContent = item.title;

    const itemDetailBtn = document.createElement("button");
    itemDetailBtn.classList.add("item-detail");
    itemDetailBtn.textContent = "Detail";
    itemDetailBtn.addEventListener("click",()=>{
        const itemDialog = document.querySelector(".item-dialog");
        settingItemForm(item.title,item.description,item.dueDate,item.priority,true);
        itemDialog.showModal();
    });

    const itemDateDiv = document.createElement("div");
    itemDateDiv.classList.add("item-date");
    itemDateDiv.textContent = item.dueDate;

    const itemEditImg = document.createElement("div");
    itemEditImg.classList.add("item-edit","icon");
    itemEditImg.addEventListener("click",()=>{
        const itemForm = document.querySelector("#item-form");
        itemForm.dataset.mode = "edit";
        itemForm.dataset.projectTitle = project.title;
        itemForm.dataset.projectID = project.id;
        itemForm.dataset.itemID = item.id;

        const btn = document.querySelector("#confirm-item");
        btn.textContent = "Edit";

        const itemDialog = document.querySelector(".item-dialog");
        settingItemForm(item.title,item.description,item.dueDate,item.priority);
        itemDialog.showModal();

    });

    const itemDelteImg = document.createElement("div");
    itemDelteImg.classList.add("item-delete","icon");
    itemDelteImg.addEventListener("click",()=>{
        Storage.deleteItem(project.id, item.id);
        reRenderAllItem(project.id , project.title);
    });

    itemDiv.append(checkbox,itemTitleDiv,itemDetailBtn,itemDateDiv,itemEditImg,itemDelteImg);
    const itemList = document.querySelector(".item-list");
    itemList.appendChild(itemDiv);
}

function showAllProject(){
    for(let {id, title} of Storage.getAllProjectID()){
        showProject(id, title);
    }
}

function reRenderAllProject(){
    clearAllProject();
    showAllProject();
}

function showItemListTitle(title){
    const itemListTitle = document.createElement("div");
    itemListTitle.classList.add("title");
    itemListTitle.textContent = title;

    const itemListDiv = document.querySelector(".item-list");
    itemListDiv.appendChild(itemListTitle);
}

function settingItemForm(title="",description="",dueDate="2026-01-10",priority="Low", disable=false){
    const formTitle = document.querySelector("#item-title");
    formTitle.value = title;
    const formDescription = document.querySelector("#item-description");
    formDescription.value = description;
    const formDueDate = document.querySelector("#item-dueDate");
    formDueDate.value = dueDate;
    const formPriority = document.querySelector("#item-priority");
    formPriority.value = priority;

    formTitle.disabled = disable;
    formDescription.disabled = disable;
    formDueDate.disabled = disable;
    formPriority.disabled = disable;

    const btn = document.querySelector("#confirm-item");
    btn.disabled = disable;

    const itemListTitle = document.querySelector(".item-dialog .title");
    if(disable){
        itemListTitle.textContent = "Details";
    }
    else if(title === ""){
        itemListTitle.textContent = "Create an item";
    }
    else{
        itemListTitle.textContent = "Edit an item";
    }
}

function showItemListAdd(projectId, projectTitle){
    const itemAddDiv = document.createElement("div");
    itemAddDiv.classList.add("add-item");
    const itemDialog = document.querySelector(".item-dialog");
    const itemForm = document.querySelector("#item-form");
    itemAddDiv.addEventListener("click",()=>{
        const btn = document.querySelector("#confirm-item");
        btn.textContent = "Create";

        settingItemForm();
        itemDialog.showModal();
        itemForm.dataset.mode = "add";
        itemForm.dataset.projectID = projectId;
        itemForm.dataset.projectTitle = projectTitle;
    });

    const itemAddBtn = document.createElement("div");
    itemAddBtn.classList.add("item-add","icon");
    const div = document.createElement("div");
    div.textContent = "Add Task";
    
    itemAddDiv.append(itemAddBtn,div);
    const itemListDiv = document.querySelector(".item-list");
    itemListDiv.appendChild(itemAddDiv);
}

function reRenderAllItem(projectID , projectTitle){
    clearItemList();
    showItemListTitle(projectTitle);

    let project = Storage.getProject(projectID);
    for(let item of project.toDoList){
        showItem(project , item);
    }

    showItemListAdd(projectID,projectTitle);
}


function showProjectDialog(){
    const projectDiaglog = document.querySelector(".project-dialog");
    const projectInput = document.querySelector("#project-title");
    projectInput.value = "";
    projectDiaglog.showModal();
}

function createAndShowProject(){
    const projectForm = document.querySelector("#project-form");
    const data = new FormData(projectForm);
    let title = data.get("project-title")
    let id = Storage.addNewProject(title);
    currentSelectedProjectID = id;
    reRenderAllProject();
    reRenderAllItem(id,title);
}


function cancelProject(){
    const projectDiaglog = document.querySelector(".project-dialog");
    projectDiaglog.close();
}

function showDefault(){
    let obj = Storage.setDefaultProjectAndItem();
    if(obj === undefined) {reRenderAllProject(); return;}
    let {projectID :id , projectTitle: title} = obj;
    currentSelectedProjectID = id;
    reRenderAllProject();
    reRenderAllItem(id, title);
}

function itemFormHandler(){
    const itemForm = document.querySelector("#item-form");
    const data = new FormData(itemForm);
    if(itemForm.dataset.mode == "add"){
        Storage.addNewItemToProject(itemForm.dataset.projectID, data.get("title"), data.get("description") ,data.get("dueDate"),data.get("priority"));
    }
    if(itemForm.dataset.mode == "edit"){
        Storage.updateItem(itemForm.dataset.projectID,itemForm.dataset.itemID, data.get("title"), data.get("description") ,data.get("dueDate"),data.get("priority"));
    }
    reRenderAllItem(itemForm.dataset.projectID, itemForm.dataset.projectTitle);
}

export function initDom(){
    const addProjectDiv = document.querySelector(".add-project");
    const cancelProjectBtn = document.querySelector("#cancel-project");
    const projectForm = document.querySelector("#project-form");
    const cancelItemBtn = document.querySelector("#cancel-item");
    const itemForm = document.querySelector("#item-form");

    addProjectDiv.addEventListener("click", showProjectDialog);
    projectForm.addEventListener("submit", createAndShowProject);
    itemForm.addEventListener("submit", itemFormHandler);
    cancelProjectBtn.addEventListener("click", cancelProject);
    cancelItemBtn.addEventListener("click", ()=>{
        const itemDialog = document.querySelector(".item-dialog");
        itemDialog.close();
    });

    showDefault();

   
}
