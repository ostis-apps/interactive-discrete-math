import { GraphNode, GraphEdge } from '@ennealand/enigraph'
import * as d3 from 'd3'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const simulate = <T extends { nodes: any; edges: any }>(data: T, options: { animate?: boolean, strength?: number } = {}): T => {
  // prettier-ignore
  const simulation = d3
		.forceSimulation(data.nodes)
		.force(
			'link',
			d3
				.forceLink<GraphNode, GraphEdge>(data.edges)
				.id(d => d.id)
				.distance(200)
				.strength(0.3)
			// .distance(edge => {
			// 	const p1 = edge.source.object.getConnectionPos(edge.target.object.position, edge.object.source_dot);
			// 	const p2 = edge.target.object.getConnectionPos(edge.source.object.position, edge.object.target_dot);
			// 	const cd = edge.source.object.position.clone().sub(edge.target.object.position).length();
			// 	const d = cd - p1.sub(p2).length();

			// if (edge.source.type == SCggLayoutObjectType.DotPoint || edge.target.type == SCggLayoutObjectType.DotPoint) {
			// 	return d + 50;
			// }

			// return 100 + d;
			// })
			// .strength(edge => {
			// 	if (edge.source.type == SCggLayoutObjectType.DotPoint ||
			// 		edge.target.type == SCggLayoutObjectType.DotPoint) {
			// 		return 1;
			// 	}

			// 	return 0.3;
			// })
		)
		.force(
			'charge',
			d3.forceManyBody().strength(() => {
				// if (node.type == SCggLayoutObjectType.DotPoint) {
				// 	return 0
				// } else if (node.type == SCggLayoutObjectType.Link) {
				// 	return -900
				// }

				return options.strength ?? -700
			})
		)
		.force(
			'r',
			d3.forceCollide(() => 25)
		)
		.force(
			'center',
			d3.forceCenter(0, 10)
		)

  if (options.animate) {
    simulation.on('tick', () => {
      data.nodes = [ ...data.nodes ]
      data.edges = [ ...data.edges ]
    })
  } else {
		console.log('stop')
    simulation.stop()
		console.log('tick')
    simulation.tick(1000)
		console.log('done')
		data.nodes = [ ...data.nodes ]
		data.edges = [ ...data.edges ]
  }

  return data
}
