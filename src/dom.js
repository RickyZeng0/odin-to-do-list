import { Storage } from "./storage";

function clearAllProject(){
    const projectList = document.querySelector(".project-list");
    while(projectList.children[1].className === "project"){
        projectList.removeChild(projectList.children[1]);
    }
}

function showProject(id , title){  
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    projectDiv.dataset.id = id;

    const projectImg = document.createElement("div");
    projectImg.classList.add("project-img","icon");

    const projectTitle = document.createElement("div");
    projectTitle.classList.add("project-title");
    projectTitle.textContent = title;

    const projectDelete = document.createElement("div");
    projectDelete.classList.add("project-delete","icon");
    projectDelete.addEventListener("click" , ()=>{Storage.deleteProject(id);reRenderAllProject();});

    projectDiv.append(projectImg, projectTitle, projectDelete);
    const projectList = document.querySelector(".project-list");
    const projectAddBtn =  projectList.lastElementChild;
    projectList.insertBefore(projectDiv , projectAddBtn);
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

function showProjectDialog(){
    const projectDiaglog = document.querySelector(".project-dialog");
    const projectInput = document.querySelector("#project-title");
    projectInput.value = "";
    projectDiaglog.showModal();
}

function createAndShowProject(){
    const projectForm = document.querySelector("#project-form");
    const data = new FormData(projectForm);
    Storage.addNewProject(data.get("project-title"));
    reRenderAllProject();
}


function cancelProject(){
    const projectDiaglog = document.querySelector(".project-dialog");
    projectDiaglog.close();
}

export function initDom(){
    const addProjectDiv = document.querySelector(".add-project");
    const cancelProjectBtn = document.querySelector("#cancel-project");
    const projectForm = document.querySelector("#project-form");

    addProjectDiv.addEventListener("click", showProjectDialog);
    projectForm.addEventListener("submit", createAndShowProject);
    cancelProjectBtn.addEventListener("click", cancelProject);

    reRenderAllProject();
}
