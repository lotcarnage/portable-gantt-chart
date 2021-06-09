namespace GraphView {
	export class DAGView {
		private canvas_: HTMLCanvasElement;
		private box_width_ = 80;
		private box_height_ = 20;
		private static v_span_ = 4;
		private static h_span_ = 40;
		private static text_margin_ = 4;
		constructor() {
			this.canvas_ = document.createElement('canvas');
			this.canvas_.width = 400;
			this.canvas_.height = 400;
		}
		public get node(): HTMLCanvasElement {
			return this.canvas_;
		}

		private DrawVertex(
			context: CanvasRenderingContext2D,
			step: number, vertex: number, name: string) {
			const offset = context.lineWidth / 2;
			const x = step * (this.box_width_ + DAGView.h_span_) + offset;
			const y = vertex * (this.box_height_ + DAGView.v_span_) + offset;
			context.fillStyle = "white";
			context.fillRect(x, y, this.box_width_, this.box_height_);
			context.strokeRect(x, y, this.box_width_, this.box_height_);
			context.fillStyle = "black";
			context.fillText(name, x + DAGView.text_margin_, y + this.box_height_ - DAGView.text_margin_);
			return;
		}
		private DrawEdge(
			context: CanvasRenderingContext2D,
			from_vertex: number, to_vertex: number, step_table: number[]) {
			const from_step = step_table[from_vertex];
			const to_step = step_table[to_vertex];
			context.beginPath();
			context.moveTo(from_step * (this.box_width_ + DAGView.h_span_) + this.box_width_, from_vertex * (this.box_height_ + DAGView.v_span_) + Math.floor(this.box_height_ / 2));
			context.lineTo(to_step * (this.box_width_ + DAGView.h_span_), to_vertex * (this.box_height_ + DAGView.v_span_) + Math.floor(this.box_height_ / 2));
			context.stroke();
			return;
		}
		private UpdatePartsSize(font_size: number, name_array: string[]) {
			const context = this.canvas_.getContext('2d');
			if (context === null) {
				return;
			}
			context.font = `${font_size}px serif`;
			let max_width = 0;
			name_array.forEach(name => {
				const w = context.measureText(name_array[0]).width;
				if (max_width < w) {
					max_width = w;
				}
			});
			max_width = Math.ceil(max_width);
			this.box_width_ = max_width + DAGView.text_margin_ * 2;
			this.box_height_ = font_size + DAGView.text_margin_ * 2;
			return;
		}

		private static MakeStepTable(dag_vertices_array: number[][], dag_order: number): number[] {
			let step = 0;
			const step_table = new Array<number>(dag_order);
			dag_vertices_array.forEach(vertices => {
				vertices.forEach(i => {
					step_table[i] = step;
				});
				step++;
			});
			return step_table;
		}
		public Update(
			font_size: number,
			dag_vertices_array: number[][],
			name_array: string[],
			dag_matrix: boolean[][], dag_order: number) {

			this.UpdatePartsSize(font_size, name_array);
			const canvas_width = dag_vertices_array.length * (this.box_width_ + DAGView.h_span_) + DAGView.h_span_;
			const canvas_height = dag_order * (this.box_height_ + DAGView.v_span_) + DAGView.v_span_;
			this.canvas_.width = canvas_width;
			this.canvas_.height = canvas_height;
			const context = this.canvas_.getContext('2d');
			if (context === null) {
				return;
			}
			context.clearRect(0, 0, canvas_width, canvas_height);
			context.fillStyle = "white";
			context.font = `${font_size}px serif`;

			const step_table = DAGView.MakeStepTable(dag_vertices_array, dag_order);
			context.lineWidth = 2;
			for (let j = 0; j < dag_order; j++) {
				for (let i = 0; i < dag_order; i++) {
					if (dag_matrix[j][i]) {
						this.DrawEdge(context, j, i, step_table);
					}
				}
			}
			dag_vertices_array.forEach(vertices => {
				vertices.forEach(i => {
					this.DrawVertex(context, step_table[i], i, name_array[i]);
				});
			});
			return;
		}
	}
}