/**
 * Utility functions for coordinate system conversion and debugging
 */

const CoordinateUtils = {
    /**
     * Get world position of a node
     */
    getWorldPosition(node) {
        return node.convertToWorldSpaceAR(cc.v2(0, 0));
    },

    /**
     * Calculate distance between two nodes using world coordinates
     */
    getWorldDistance(nodeA, nodeB) {
        let posA = this.getWorldPosition(nodeA);
        let posB = this.getWorldPosition(nodeB);
        return Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.y - posB.y, 2));
    },

    /**
     * Calculate horizontal distance between two nodes
     */
    getHorizontalDistance(nodeA, nodeB) {
        let posA = this.getWorldPosition(nodeA);
        let posB = this.getWorldPosition(nodeB);
        return Math.abs(posA.x - posB.x);
    },

    /**
     * Calculate vertical distance between two nodes
     */
    getVerticalDistance(nodeA, nodeB) {
        let posA = this.getWorldPosition(nodeA);
        let posB = this.getWorldPosition(nodeB);
        return Math.abs(posA.y - posB.y);
    },

    /**
     * Check if two nodes are in the same lane (within tolerance)
     */
    areInSameLane(nodeA, nodeB, tolerance = 50) {
        return this.getVerticalDistance(nodeA, nodeB) <= tolerance;
    },

    /**
     * Convert world position to local position for a specific parent
     */
    worldToLocal(worldPos, parentNode) {
        return parentNode.convertToNodeSpaceAR(worldPos);
    },

    /**
     * Convert local position to world position for a specific node
     */
    localToWorld(localPos, node) {
        return node.convertToWorldSpaceAR(localPos);
    },

    /**
     * Debug log positions of multiple nodes
     */
    debugPositions(nodes, label = "Nodes") {
        console.log(`=== ${label} Positions ===`);
        nodes.forEach((node, index) => {
            if (node && node.isValid) {
                let worldPos = this.getWorldPosition(node);
                let localPos = node.position;
                console.log(`${label}[${index}]: Local(${localPos.x.toFixed(1)}, ${localPos.y.toFixed(1)}) World(${worldPos.x.toFixed(1)}, ${worldPos.y.toFixed(1)})`);
            }
        });
        console.log("========================");
    },

    /**
     * Find nodes within range of a target node
     */
    findNodesInRange(targetNode, candidateNodes, range, sameLaneOnly = true, tolerance = 50) {
        let targetWorldPos = this.getWorldPosition(targetNode);
        //console.log(`Finding nodes within range ${range} of target at (${targetWorldPos.x.toFixed(1)}, ${targetWorldPos.y.toFixed(1)})`);
        
        return candidateNodes.filter(node => {
            if (!node || !node.isValid || !node.active) return false;
            
            let nodeWorldPos = this.getWorldPosition(node);
            let distance = Math.abs(nodeWorldPos.x - targetWorldPos.x);
            //console.log(`Checking node at (${nodeWorldPos.x.toFixed(1)}, ${nodeWorldPos.y.toFixed(1)}) - Distance: ${distance.toFixed(1)}`);
            
            if (sameLaneOnly) {
                let verticalDistance = Math.abs(nodeWorldPos.y - targetWorldPos.y);
                return distance <= range && verticalDistance <= tolerance;
            }
            
            return distance <= range;
        });
    },

    /**
     * Get the closest node from a list of candidates
     */
    getClosestNode(targetNode, candidateNodes) {
        if (!candidateNodes || candidateNodes.length === 0) return null;
        
        let targetWorldPos = this.getWorldPosition(targetNode);
        let closest = null;
        let minDistance = Infinity;
        
        candidateNodes.forEach(node => {
            if (!node || !node.isValid) return;
            
            let nodeWorldPos = this.getWorldPosition(node);
            let distance = Math.sqrt(
                Math.pow(nodeWorldPos.x - targetWorldPos.x, 2) + 
                Math.pow(nodeWorldPos.y - targetWorldPos.y, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closest = node;
            }
        });
        
        return closest;
    },

    /**
     * Sort nodes by distance from target (closest first)
     */
    sortByDistance(targetNode, nodes) {
        let targetWorldPos = this.getWorldPosition(targetNode);
        
        return nodes.sort((a, b) => {
            let aWorldPos = this.getWorldPosition(a);
            let bWorldPos = this.getWorldPosition(b);
            
            let aDist = Math.sqrt(
                Math.pow(aWorldPos.x - targetWorldPos.x, 2) + 
                Math.pow(aWorldPos.y - targetWorldPos.y, 2)
            );
            let bDist = Math.sqrt(
                Math.pow(bWorldPos.x - targetWorldPos.x, 2) + 
                Math.pow(bWorldPos.y - targetWorldPos.y, 2)
            );
            
            return aDist - bDist;
        });
    }
};

module.exports = CoordinateUtils;
