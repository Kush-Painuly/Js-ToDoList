const searchTodoHandler = (element) => {
  const searchedTerm = element.value.toLowerCase();
  const LocalTodos = getTodoHandler();

  const searchedTodos = LocalTodos.filter((item) => {
    return item.text.toLowerCase().includes(searchedTerm);
  });

  updateTodoHandler(searchedTodos)
}


const getTodoHandler = () => {
  const todos = JSON.parse(localStorage.getItem('todos'));
  return todos || []
}

const setTodoHandler = (todo) => {
  localStorage.setItem("todos", JSON.stringify(todo));
  updateUIHandler(getTodoHandler());
}

const updateUIHandler = (Todo) => {
  const ul = document.querySelector('ul');
  //for handling the fallback text in case of no todos
  if (Todo.length === 0) {
    ul.innerHTML = `<h3 style="text-align:center">No Todos Available</h3>`;
    return;

  }

  ul.innerHTML = "";

  for (let todos of Todo) {

    const li = document.createElement('li');
    const span = document.createElement('span');
    const div = document.createElement('div');
    const deleteSVG = `
      <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              viewBox="0 0 256 256"
              onclick="deleteElement('${todos.id}')"
            >
              <path
                d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"
              ></path>
    </svg>`

    const updateSVG = `
    <svg xmlns="http://www.w3.org/2000/svg"
     fill="#000000"
      viewBox="0 0 256 256"
      onclick="editElementHandler(this, '${todos.id}')"
      >
      <path
        d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"
      ></path>
    </svg>`


    span.innerText = todos.text;

    div.innerHTML += updateSVG;
    div.innerHTML += deleteSVG;
    li.append(span);
    li.append(div);

    ul.append(li);
    //with append only html are added and not strings.

    // ul.prepend(li);
  }
}


const SubmitTodoHandler = (e) => {
  e.preventDefault();
  const todos = e.target.add.value;
  console.log(todos);


  //for handling the empty values
  if (!todos) {
    return;
  }

  //new way 
  //Adding the list in localstorage
  const existingTodos = getTodoHandler();
  const todoList = existingTodos || [];
  //logical rendering
  todoList.push({ text: todos, id: generateRandomId() });

  setTodoHandler(todoList);

  updateUIHandler();

  //for resetting the form
  e.target.reset();
}

const updateTodoHandler = (element, todoId) => {
  const updatedTodo = element.parentElement.previousElementSibling.value;
  const todos = getTodoHandler();
  const updatedTodos = todos.map((item) => {
    if (item.id === todoId) {
      return { ...item, text: updatedTodo };
    }
    return item;
  })
  setTodoHandler(updatedTodos);

}

const generateRandomId = () => {
  const randomNum = Math.floor(Math.random() * 1000);
  let randomId = "TODO" + randomNum;
  return randomId;
}

const editElementHandler = (element, todoId) => {
  console.log("Update element clicked");
  const li = element.closest('li');
  const spanText = li.children[0].innerText;
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', spanText);
  input.classList.add('todo-input');
  li.children[0].remove();
  li.prepend(input);
  //replacing icons
  const closestdiv = element.closest('div');
  const enabledButtonsDiv = document.createElement('div');
  const check = `
  <svg xmlns="http://www.w3.org/2000/svg"
   width="32" 
   height="32"
    fill="#000000" viewBox="0 0 256 256"
    onclick="updateTodoHandler(this, '${todoId}')"
    >
    <path 
    d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"
    >
    </path>
  </svg>`

  const crossIcon =
    `
  <svg xmlns="http://www.w3.org/2000/svg"
   width="32"
   height="32"
   fill="#000000"
   viewBox="0 0 256 256"
   onclick="updateUIHandler()"
   >
   <path
    d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"
    >
    </path>
  </svg>
  `
  enabledButtonsDiv.innerHTML += check;
  enabledButtonsDiv.innerHTML += crossIcon;
  closestdiv.replaceWith(enabledButtonsDiv);
}

//function to delete the li element
const deleteElement = (todoId) => {
  const todos = getTodoHandler();
  const filteredTodoList = todos.filter((item) => item.id !== todoId);
  setTodoHandler(filteredTodoList)
  updateUIHandler();
};

window.onload = () => {
  updateUIHandler(getTodoHandler());
}