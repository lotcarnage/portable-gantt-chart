/// <reference path="./gui.ts" />
/// <reference path="./dag.ts" />
/// <reference path="./graph.ts" />

const Initialize = function () {
	const test_user_list = ["名無し１", "名無し２", "名無し３"];
	const task_list = [
		"Task A",
		"Task B",
		"Task C",
		"Task D",
		"Task E",
		"Task F",
		"Task G"
	];


	const user_list = new GuiParts.ListBox();
	document.body.appendChild(user_list.root)

	const check_table = new GuiParts.CheckTable(task_list);
	document.body.appendChild(check_table.root)


	const dag_area = document.createElement('div');
	const cycle_area = document.createElement('div');
	const dag_view = new GraphView.DAGView();

	const solv = function () {
		const order = check_table.order;
		const check_matrix = check_table.CreateCheckMatrix();
		const adjacency = new DAG.AdjacencyMatrix(order);
		for (let j = 0; j < order; j++) {
			for (let i = 0; i < order; i++) {
				adjacency.matrix.matrix[j][i] = check_matrix[i][j];
			}
		}
		const [dag, cycle] = adjacency.CalculateSorted();
		const pickup_tasks = function (task_indices: number[]): string[] {
			const task_set = new Array<string>(0);
			task_indices.forEach(i => {
				task_set.push(task_list[i]);
			});
			return task_set;
		}

		let task_set_text_array = Array<string>(0);
		dag.forEach(vertices => {
			const task_set = pickup_tasks(vertices);
			const task_set_text = "{" + task_set.join(", ") + "}";
			task_set_text_array.push(task_set_text);
		});
		dag_area.innerText = "DAG:" + task_set_text_array.join(" => ");
		cycle_area.innerText = "Cycle:" + pickup_tasks(cycle).join(", ");
		dag_view.Update(24, dag, task_list, adjacency.matrix.matrix, adjacency.matrix.order);
		return;
	}
	const button = document.createElement('button');
	button.innerText = "solv";
	button.addEventListener('click', (event) => {
		solv();
	});

	document.body.appendChild(button)
	document.body.appendChild(dag_area)
	document.body.appendChild(cycle_area)
	document.body.appendChild(dag_view.node);

	const text_input_table = new GuiParts.TextInputTable(test_user_list, task_list);
	document.body.appendChild(text_input_table.root)

	return;
};

Initialize();

