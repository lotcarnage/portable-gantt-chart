namespace DAG {
	class Matrix {
		private matrix_: boolean[][];
		private order_: number;
		constructor(order: number) {
			const matrix = new Array<Array<boolean>>(order);
			for (let i = 0; i < order; i++) {
				matrix[i] = new Array<boolean>(order);
			}
			this.matrix_ = matrix;
			this.order_ = order;
		}
		public get order(): number {
			return this.order_;
		}
		public get matrix(): boolean[][] {
			return this.matrix_;
		}
		public Duplicate(): Matrix {
			const duplicated = new Matrix(this.order_);
			for (let j = 0; j < this.order_; j++) {
				for (let i = 0; i < this.order_; i++) {
					duplicated.matrix[j][i] = this.matrix_[j][i];
				}
			}
			return duplicated;
		}
	}

	function SetIdentity(matrix: Matrix): Matrix {
		for (let j = 0; j < matrix.order; j++) {
			for (let i = 0; i < matrix.order; i++) {
				matrix.matrix[j][i] = (i == j);
			}
		}
		return matrix;
	}

	function MultiplyMatrix(lhv: Matrix, rhv: Matrix): Matrix {
		const order = lhv.order;
		const out = new Matrix(lhv.order);
		for (let j = 0; j < order; j++) {
			for (let i = 0; i < order; i++) {
				let inner_producted = false;
				for (let k = 0; k < order; k++) {
					inner_producted ||= lhv.matrix[j][k] && rhv.matrix[k][i];
				}
				out.matrix[j][i] = inner_producted;
			}
		}
		return out;
	}

	function InplaceAdd(lhv_and_out: Matrix, rhv: Matrix) {
		const order = lhv_and_out.order;
		for (let j = 0; j < order; j++) {
			for (let i = 0; i < order; i++) {
				lhv_and_out.matrix[j][i] = lhv_and_out.matrix[j][i] || rhv.matrix[j][i];
			}
		}
		return;
	}

	export class AdjacencyMatrix {
		private matrix_: Matrix;
		constructor(order: number) {
			this.matrix_ = new Matrix(order);
		}
		public get matrix(): Matrix {
			return this.matrix_;
		}
		private CalculateInDegrees(vertex_indices: number[]): number[] {
			const order = this.matrix_.order;
			const indegrees = new Array<number>(order);
			indegrees.fill(0);
			vertex_indices.forEach(i => {
				vertex_indices.forEach(j => {
					if (i != j) {
						indegrees[i] += this.matrix_.matrix[j][i] ? 1 : 0;
					}
				});
			});
			return indegrees;
		}

		public CalculateSorted(): [number[][], number[]] {
			const order = this.matrix_.order;
			const is_dag_flags = (new Array<boolean>(order)).fill(false);
			const extract_target_vertex_indices = function (is_dag_flags: boolean[]) {
				const target_vertex_indices = new Array<number>(0);
				for (let i = 0; i < order; i++) {
					if (!is_dag_flags[i]) {
						target_vertex_indices.push(i);
					}
				}
				return target_vertex_indices;
			};
			const entry_points_array = new Array<Array<number>>(0);
			let num_dag_vertices = 0;
			while (true) {
				const target_vertex_indices = extract_target_vertex_indices(is_dag_flags);
				const indegrees = this.CalculateInDegrees(target_vertex_indices);
				const entry_point_set = new Array<number>(0);
				target_vertex_indices.forEach(i => {
					if (indegrees[i] == 0) {
						entry_point_set.push(i);
					}
				});
				if (entry_point_set.length == 0) {
					break;
				}
				entry_point_set.forEach(i => {
					is_dag_flags[i] = true;
				});
				entry_points_array.push(entry_point_set);
				num_dag_vertices += entry_point_set.length;
				if (order == num_dag_vertices) {
					break;
				}
			}
			const cycle_vertices = extract_target_vertex_indices(is_dag_flags);
			return [entry_points_array, cycle_vertices];
		}

	}

	export class ConnectedMatrix {
		private step_array_: Matrix[];
		private connected_: Matrix;
		private order_: number;
		constructor(adjacency: AdjacencyMatrix) {
			this.order_ = adjacency.matrix.order;
			this.step_array_ = new Array<Matrix>(this.order_ + 1);
			this.step_array_[0] = SetIdentity(new Matrix(this.order_));
			this.step_array_[1] = adjacency.matrix.Duplicate();
			for (let i = 2; i < this.order_ + 1; i++) {
				this.step_array_[i] = MultiplyMatrix(this.step_array_[i - 1], this.step_array_[1]);
			}
			this.connected_ = SetIdentity(new Matrix(this.order_));
			for (let i = 1; i < this.order_; i++) {
				InplaceAdd(this.connected_, this.step_array_[i]);
			}
		}
	}

}
