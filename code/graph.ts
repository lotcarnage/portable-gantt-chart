namespace GraphView {
	export class DAGView {
		private canvas_: HTMLCanvasElement;
		private static box_width_ = 80;
		private static box_height_ = 20;
		private static v_span_ = 4;
		private static h_span_ = 20;
		constructor() {
			this.canvas_ = document.createElement('canvas');
			this.canvas_.width = 400;
			this.canvas_.height = 400;
		}
		public get node(): HTMLCanvasElement {
			return this.canvas_;
		}

		private static DrawVertex(
			context: CanvasRenderingContext2D,
			step: number, vertex: number, name: string) {
			const x = step * (DAGView.box_width_ + DAGView.h_span_);
			const y = vertex * (DAGView.box_height_ + DAGView.v_span_);
			context.fillStyle = "white";
			context.fillRect(x, y, DAGView.box_width_, DAGView.box_height_);
			context.fillStyle = "black";
			context.fillText(name, x + 2, y + DAGView.box_height_ - 2);
			return;
		}
		private static DrawEdge(
			context: CanvasRenderingContext2D,
			from_vertex: number, to_vertex: number, step_table: number[]) {
			const from_step = step_table[from_vertex];
			const to_step = step_table[to_vertex];
			context.beginPath();
			context.moveTo(from_step * (DAGView.box_width_ + DAGView.h_span_) + DAGView.box_width_, from_vertex * (DAGView.box_height_ + DAGView.v_span_) + Math.floor(DAGView.box_height_ / 2));
			context.lineTo(to_step * (DAGView.box_width_ + DAGView.h_span_), to_vertex * (DAGView.box_height_ + DAGView.v_span_) + Math.floor(DAGView.box_height_ / 2));
			context.stroke();
			return;
		}

		public Update(
			dag_vertices_array: number[][],
			name_array: string[],
			dag_matrix: boolean[][], dag_order: number) {

			const canvas_width = dag_vertices_array.length * (DAGView.box_width_ + DAGView.h_span_) + DAGView.h_span_;
			const canvas_height = dag_order * (DAGView.box_height_ + DAGView.v_span_) + DAGView.v_span_;
			this.canvas_.width = canvas_width;
			this.canvas_.height = canvas_height;
			const context = this.canvas_.getContext('2d');
			if (context === null) {
				return;
			}
			context.clearRect(0, 0, canvas_width, canvas_height);
			context.fillStyle = "white";

			let step = 0;
			const step_table = new Array<number>(dag_order);
			dag_vertices_array.forEach(vertices => {
				vertices.forEach(i => {
					step_table[i] = step;
					DAGView.DrawVertex(context, step, i, name_array[i]);
				});
				step++;
			});
			for (let j = 0; j < dag_order; j++) {
				for (let i = 0; i < dag_order; i++) {
					if (dag_matrix[j][i]) {
						DAGView.DrawEdge(context, j, i, step_table);
					}
				}
			}
			return;
		}
	}
}