export function aStar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.heuristic = heuristic(startNode, finishNode);
    const unvisitedNodes = getAllNodes(grid);
    while (!!unvisitedNodes.length) {
        sortNodesByTotalCost(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall) continue;

        if (closestNode.distance + closestNode.heuristic === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighborsAStar(closestNode, grid, finishNode);
    }
}

function sortNodesByTotalCost(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => 
        (nodeA.distance + nodeA.heuristic) - (nodeB.distance + nodeB.heuristic)
    );
}

function updateUnvisitedNeighborsAStar(node, grid, finishNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        const tentativeGScore = node.distance + 1;
        if (tentativeGScore < neighbor.distance) {
            neighbor.distance = tentativeGScore;
            neighbor.heuristic = heuristic(neighbor, finishNode);
            neighbor.previousNode = node;
        }
    }
}

function heuristic(node, finishNode) {
    // Manhattan distance heuristic
    const dx = Math.abs(node.col - finishNode.col);
    const dy = Math.abs(node.row - finishNode.row);
    return dx + dy;
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}
