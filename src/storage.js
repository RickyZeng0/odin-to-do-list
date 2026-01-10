class ToDoItem {
    id = crypto.randomUUID();
    check = false;

    constructor(title,description,dueDate,priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

class Project {
    id = crypto.randomUUID();
    toDoList = [];
    
    constructor(title){
        this.title = title;
    }
}

export class Storage {
    static getProject(projectID){
        let projectString = localStorage.getItem(projectID);
        if(projectString === null) {console.log("Can't find that project"); return;}
        return JSON.parse(projectString);
    }

    static getAllProjectID(){
        let array = [];
        for(let key in localStorage){
            if(key.length == 36) {
                let title = this.getProject(key).title;
                array.push({ id:key,title});
            }
        }
        array.sort( (a,b) => a.title.localeCompare(b.title) );
        return array;
    }

    static getProjectAndItem(projectID, itemID){
        let project = this.getProject(projectID);
        if(project === undefined) return;
        let itemIndex = project.toDoList.findIndex( (item) => item.id === itemID );
        if(itemIndex === -1) {console.log("Can't find that item"); return;}
        let item = project.toDoList[itemIndex];
        return {project , item , itemIndex};
    }

    static setProject(project){
        localStorage.setItem(project.id,JSON.stringify(project));
    }

    static addNewProject(title){
        let project = new Project(title);
        this.setProject(project);
        return project.id;
    }

    static addNewItemToProject(projectID,title,description,dueDate,priority){
        let project =  this.getProject(projectID);
        let newItem = new ToDoItem(title,description,dueDate,priority);
        if(project === undefined) return;
        project.toDoList.push(newItem);
        this.setProject(project);
    }

    static updateItem(projectID,itemID,title,description,dueDate,priority){
        let obj = this.getProjectAndItem(projectID,itemID);
        if(obj === undefined) return;
        let {project , item , itemIndex} = obj;
        item.title = title; item.description = description; item.dueDate = dueDate; item.priority = priority;
        this.setProject(project);
    }

    static toggleItem(projectID,itemID){
        let obj = this.getProjectAndItem(projectID,itemID);
        if(obj === undefined) return;
        let {project , item , itemIndex} = obj;
        item.check = !item.check;
        this.setProject(project);       
    }

    static updateProject(projectID, title){
        let project = this.getProject(projectID);
        if(project === undefined) return;  
        project.title = title;
        this.setProject(project);     
    }

    static deleteItem(projectID,itemID){
        let obj = this.getProjectAndItem(projectID,itemID);
        if(obj === undefined) return;
        let {project , item , itemIndex} = obj;  
        project.toDoList.splice(itemIndex,1);
        this.setProject(project);
    }

    static deleteProject(projectID){
        let project = this.getProject(projectID);
        if(project === undefined) return;
        localStorage.removeItem(projectID);
    }

    static setDefaultProjectAndItem(){
        let defaultSetted = localStorage.getItem("default");
        if(defaultSetted !==  null) return;
        let projectID = this.addNewProject("Programming");
        let projectTitle = "Programming";
        this.addNewItemToProject(projectID,"C++","OOP C++","2026-01-10","Middle");
        localStorage.setItem("default","the default project and item is setted when the page is first loaded");
        return {projectID , projectTitle};
    }

}
