// UTILES 
Storage.prototype.set = (key, obj) => localStorage.setItem(key, JSON.stringify(obj))
Storage.prototype.get = (key) => JSON.parse(localStorage.getItem(key))
// UTILES end
let inputForm = document.querySelector('form');
let buttons = document.querySelectorAll('.button-group .sort');
let removeButton = document.querySelector('.remove-all');

document.onload = render(localStorage.get('dos'))

inputForm.addEventListener('submit', e => {
	e.preventDefault();

	let timeStamp = String(new Date().getTime());
	const todo = document.getElementById('todo');
	const todos = localStorage.get('dos') || [];

	todos.push({completed: false, value: todo.value, id: timeStamp});
	todos.sort((a,b) => b.id-a.id);
	localStorage.set('dos', todos);

	todo.value = ''
	render();
})
function render() {
	const todoGroup = document.querySelector('.todo-group');
	const data = localStorage.get('dos') || [];
	const status = sessionStorage.getItem('state') || 'all';
	let filtered = (() => {
		if(status == 'active') return data.filter(item => !item.completed);
		if(status == 'completed') return data.filter(item => item.completed);
		return data
	})();

	todoGroup.innerHTML = `<ul>${
		filtered?.map(todo => 
			`<label for="${todo.value  + todo.id}">
				<li class="${todo.completed ? 'completed' : ''}">
					<input type="checkbox"  
						id="${todo.value  + todo.id}" 
						${todo.completed ? 'checked' : ""} 
						onchange="handleChange('${todo.id}', ${todo.completed})"
					/>

					<span>${todo.value}</span>
					<button onclick="handleRemove('${todo.id}')" class="remove btn">Remove</button>
				</li>
			</label>`)
				 .join('') || '<span>No Elements </span>'}
	</ul>`
}
function handleChange(id, state){
	let result = localStorage.get('dos');
  let changedIndex = getIndex(result, id);

  result[changedIndex].completed = !state;
  localStorage.set('dos', result);
  render();
}
function handleRemove(id) {
	let result = localStorage.get('dos');
	let deletedIndex = getIndex(result, id);

	result.splice(deletedIndex, 1);
	localStorage.set('dos', result);
	render();
}
function getIndex(src, id) {
	let changedIndex;
	src.forEach((item, index) => {
  	if(Object.values(item).includes(id)) {
  		 changedIndex = index;
  	}
  })
  return changedIndex;
}
buttons.forEach(button => {
	button.addEventListener('click', () => {
		buttons.forEach(button => button.classList.remove('active'))
		button.classList.add('active')
		sessionStorage.setItem('state', button.getAttribute('data-name'))
		render();
	})
})
removeButton.addEventListener('click', () => {
	let confirmed = confirm('Are you sure to delete all ToDos?')
	if(confirmed) {
		localStorage.removeItem('dos');
		render();
	}
})