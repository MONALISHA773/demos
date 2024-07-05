import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder as getDijkstraNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { aStar, getNodesInShortestPathOrder as getAStarNodesInShortestPathOrder } from '../algorithms/aStar';
import './Pathfinding.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: { row: 10, col: 15 },
      finishNode: { row: 10, col: 35 },
      movingStartNode: false,
      movingFinishNode: false,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { grid, startNode, finishNode } = this.state;
    if (row === startNode.row && col === startNode.col) {
      this.setState({ movingStartNode: true });
    } else if (row === finishNode.row && col === finishNode.col) {
      this.setState({ movingFinishNode: true });
    } else {
      const newGrid = this.getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    const { mouseIsPressed, movingStartNode, movingFinishNode, grid } = this.state;
    if (!mouseIsPressed && !movingStartNode && !movingFinishNode) return;

    if (movingStartNode) {
      this.setState({ startNode: { row, col } }, () => {
        const newGrid = this.getUpdatedGrid();
        this.setState({ grid: newGrid });
      });
    } else if (movingFinishNode) {
      this.setState({ finishNode: { row, col } }, () => {
        const newGrid = this.getUpdatedGrid();
        this.setState({ grid: newGrid });
      });
    } else {
      const newGrid = this.getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false, movingStartNode: false, movingFinishNode: false });
  }

  getInitialGrid() {
    const { startNode, finishNode } = this.state;
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row, startNode, finishNode));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row, startNode, finishNode) {
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      heuristic: Infinity,
    };
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  getUpdatedGrid() {
    const { grid, startNode, finishNode } = this.state;
    const newGrid = grid.map(row => row.map(node => ({
      ...node,
      isStart: node.row === startNode.row && node.col === startNode.col,
      isFinish: node.row === finishNode.row && node.col === finishNode.col,
    })));
    return newGrid;
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid, startNode, finishNode } = this.state;
    const startNodeObj = grid[startNode.row][startNode.col];
    const finishNodeObj = grid[finishNode.row][finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNodeObj, finishNodeObj);
    const nodesInShortestPathOrder = getDijkstraNodesInShortestPathOrder(finishNodeObj);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    const { grid, startNode, finishNode } = this.state;
    const startNodeObj = grid[startNode.row][startNode.col];
    const finishNodeObj = grid[finishNode.row][finishNode.col];
    const visitedNodesInOrder = aStar(grid, startNodeObj, finishNodeObj);
    const nodesInShortestPathOrder = getAStarNodesInShortestPathOrder(finishNodeObj);
    this.animateAStar(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateAStar(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeAStar()}>
          Visualize A* Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
