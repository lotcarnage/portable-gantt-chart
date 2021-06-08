namespace GuiParts {
	function IsNaturalNumberString(target_string: string): boolean {
		const matched_string = target_string.match(/[1-9][0-9]*/);
		return ((matched_string !== null) && (matched_string[0] == target_string));
	}

	function CreateButton(caption: string, click_callbak: (event: MouseEvent) => any): HTMLButtonElement {
		const button = document.createElement("button");
		button.innerText = caption;
		button.addEventListener('click', click_callbak);
		return button;
	}
	function CreateTextInput(width: number): HTMLInputElement {
		const input = document.createElement("input");
		input.type = "text";
		input.style.minWidth = width.toString();
		input.style.maxWidth = width.toString();
		return input;
	}
	function CreateNumberInput(width: number): HTMLInputElement {
		const input = document.createElement("input");
		input.type = "text";
		input.style.textAlign = "right";
		input.style.minWidth = width.toString();
		input.style.maxWidth = width.toString();
		input.value = "1";
		let backup_value = input.value;
		input.addEventListener('focus', (event) => {
			if (event.target === null) {
				return;
			}
			backup_value = (event.target as HTMLInputElement).value;
		});
		input.addEventListener('change', (event) => {
			if (event.target === null) {
				return;
			}
			const input_value = (event.target as HTMLInputElement).value;
			if (!IsNaturalNumberString(input_value)) {
				if (input_value != "-") {
					(event.target as HTMLInputElement).value = backup_value;
				}
			}
		});
		return input;
	}

	function CreateDiv(elements: HTMLElement[]): HTMLDivElement {
		const div = document.createElement("div");
		elements.forEach(element => {
			div.appendChild(element);
		});
		return div;
	}
	function Make2dArray<T>(width: number, height: number, initial_value: T | null): T[][] {
		return JSON.parse(JSON.stringify((new Array<Array<T | null>>(height)).fill((new Array<T | null>(width)).fill(initial_value))));
	}

	function CreateLeagueStanding(names: string[]): [HTMLTableElement, HTMLInputElement[][], number] {
		const table = document.createElement("table");
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		tr.appendChild(th);
		names.forEach(element => {
			const th = document.createElement("th");
			th.innerText = element;
			th.style.textOrientation = "mixed";
			th.style.writingMode = "vertical-rl"
			tr.appendChild(th);
		});
		table.appendChild(tr);

		let row_index = 0;
		const check_box_table = Make2dArray<HTMLInputElement>(names.length, names.length, null);
		names.forEach(element => {
			const tr = document.createElement("tr");
			const th = document.createElement("th");
			th.innerHTML = element;
			tr.appendChild(th);
			for (let i = 0; i < names.length; i++) {
				const td = document.createElement("td");
				const checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.dataset.x = i.toString();
				checkbox.dataset.y = row_index.toString();
				checkbox.addEventListener('change', (event) => {
					if (event.target === null) {
						return;
					}
					const x = Number((event.target as HTMLInputElement).dataset.x);
					const y = Number((event.target as HTMLInputElement).dataset.y);
					check_box_table[x][y].disabled = (event.target as HTMLInputElement).checked;
				});
				if (row_index === i) {
					checkbox.disabled = true;
				}
				td.appendChild(checkbox)
				tr.appendChild(td);
				check_box_table[row_index][i] = checkbox;
			}
			table.appendChild(tr);
			row_index++;
		});

		return [table, check_box_table, names.length];
	}

	function CreateTextInputTable(columns: string[], rows: string[]): HTMLTableElement {
		const table = document.createElement("table");
		const tr = document.createElement("tr");
		const th = document.createElement("th");
		tr.appendChild(th);
		columns.forEach(element => {
			const th = document.createElement("th");
			th.innerText = element;
			th.style.textOrientation = "mixed";
			th.style.writingMode = "vertical-rl"
			tr.appendChild(th);
		});
		table.appendChild(tr);

		rows.forEach(element => {
			const tr = document.createElement("tr");
			const th = document.createElement("th");
			th.innerHTML = element;
			tr.appendChild(th);
			for (let i = 0; i < columns.length; i++) {
				const td = document.createElement("td");
				td.appendChild(CreateNumberInput(32))
				tr.appendChild(td);
			}
			table.appendChild(tr);
		});

		return table;
	}


	export class ListBox {
		private text_box_: HTMLInputElement;
		private add_button_: HTMLButtonElement;
		private add_div_: HTMLDivElement;
		private selecter_: HTMLSelectElement;
		private selecter_div_: HTMLDivElement;
		private delete_button_: HTMLButtonElement;
		private delete_div_: HTMLDivElement;
		private container_: HTMLDivElement;
		constructor() {
			this.text_box_ = CreateTextInput(200);
			this.add_button_ = CreateButton("追加", (event) => {
				this.AddItem(this.text_box_.value);
				this.text_box_.value = "";
			});
			this.add_div_ = CreateDiv([this.text_box_, this.add_button_]);

			this.selecter_ = document.createElement("select");
			this.selecter_div_ = CreateDiv([this.selecter_]);

			this.delete_button_ = CreateButton("削除", (event) => {
				this.DeleteItem(this.selecter_.selectedIndex);
			});
			this.delete_div_ = CreateDiv([this.delete_button_]);

			this.container_ = document.createElement("div");
			this.container_ = CreateDiv([this.add_div_, this.selecter_div_, this.delete_div_])
		}

		private AddItem(item_name: string) {
			if (item_name == "") {
				return;
			}
			const new_item = document.createElement("option");
			new_item.innerText = item_name;
			this.selecter_.append(new_item);
			this.selecter_.size = this.selecter_.length;
		}
		private DeleteItem(item_index: number) {
			this.selecter_.remove(item_index);
			this.selecter_.size = this.selecter_.length;
			this.selecter_.selectedIndex = 0;
		}

		public get root(): HTMLElement {
			return this.container_;
		}
	}

	export class CheckTable {
		private table_: HTMLTableElement;
		private container_: HTMLDivElement;
		private check_box_table_: HTMLInputElement[][];
		private order_: number;
		constructor(th_list: string[]) {
			[this.table_, this.check_box_table_, this.order_] = CreateLeagueStanding(th_list)
			this.container_ = CreateDiv([this.table_])
		}

		public get root(): HTMLElement {
			return this.container_;
		}
		public get order(): number {
			return this.order_;
		}

		public CreateCheckMatrix(): boolean[][] {
			const matrix = new Array<boolean[]>(this.order_);
			for (let i = 0; i < this.order_; i++) {
				matrix[i] = new Array<boolean>(this.order_);
			}
			for (let j = 0; j < this.order_; j++) {
				for (let i = 0; i < this.order_; i++) {
					matrix[j][i] = this.check_box_table_[j][i].checked;
				}
			}
			return matrix;
		}
	}

	export class TextInputTable {
		private table_: HTMLTableElement;
		private container_: HTMLDivElement;
		constructor(columns: string[], rows: string[]) {
			this.table_ = CreateTextInputTable(columns, rows)
			this.container_ = CreateDiv([this.table_])
		}

		public get root(): HTMLElement {
			return this.container_;
		}
	}

}