import "./style.css"
import { Storage } from "./storage";
import { initDom } from "./dom";


initDom();
//used to test code in the dev tool console
window.Storage = Storage;
