import { render } from "preact";
import { App } from "./main";
import "./reset.css";
import "./style.css";

render(<App />, document.getElementById("app")!);
