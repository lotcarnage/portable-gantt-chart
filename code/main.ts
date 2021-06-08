/// <reference path="./gui.ts" />
/// <reference path="./dag.ts" />

const Initialize = function () {
	const test_user_list = ["名無し１", "名無し２", "名無し３"];
	const task_list = [
		"Task A",
		"Task B",
		"Task C",
		"Task D"
	];


	const user_list = new GuiParts.ListBox();
	document.body.appendChild(user_list.root)

	const check_table = new GuiParts.CheckTable(task_list);
	document.body.appendChild(check_table.root)

	const text_input_table = new GuiParts.TextInputTable(test_user_list, task_list);
	document.body.appendChild(text_input_table.root)

	function solv() {
		const order = check_table.order;
		const check_matrix = check_table.CreateCheckMatrix();
		const adjacency = new DAG.AdjacencyMatrix(order);
		for (let j = 0; j < order; j++) {
			for (let i = 0; i < order; i++) {
				adjacency.matrix.matrix[j][i] = check_matrix[i][j];
			}
		}
		const [dag, cycle] = adjacency.CalculateSorted();
		console.log(dag);
		console.log(cycle);
	}
	const button = document.createElement('button');
	button.innerText = "solv";
	button.addEventListener('click', (event) => {
		solv();
	});
	document.body.appendChild(button)
	return;
};

Initialize();

