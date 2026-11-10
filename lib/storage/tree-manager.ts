import { ConversationTree, MessageNode } from '../types';

export function createId(): string {
  return 'msg_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function createConversationId(): string {
  return 'conv_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

/**
 * Creates a brand new conversation tree with the first user prompt and placeholder assistant response
 */
export function createNewConversationTree(
  userText: string,
  model: string
): { tree: ConversationTree; userNodeId: string; assistantNodeId: string } {
  const convId = createConversationId();
  const userNodeId = createId();
  const assistantNodeId = createId();
  const now = Date.now();

  const userNode: MessageNode = {
    id: userNodeId,
    parentId: null,
    childIds: [assistantNodeId],
    role: 'user',
    content: userText,
    createdAt: now,
  };

  const assistantNode: MessageNode = {
    id: assistantNodeId,
    parentId: userNodeId,
    childIds: [],
    role: 'assistant',
    content: '',
    model,
    createdAt: now,
  };

  const title = userText.slice(0, 36).trim() + (userText.length > 36 ? '...' : '');

  const tree: ConversationTree = {
    id: convId,
    title: title || 'Untitled Reflection',
    createdAt: now,
    updatedAt: now,
    isPinned: false,
    isFavorite: false,
    activeLeafId: assistantNodeId,
    nodes: {
      [userNodeId]: userNode,
      [assistantNodeId]: assistantNode,
    },
  };

  return { tree, userNodeId, assistantNodeId };
}

/**
 * Traverses from activeLeafId backwards to root to get the current linear message path
 */
export function getLinearPath(tree: ConversationTree, leafId?: string): MessageNode[] {
  const targetId = leafId || tree.activeLeafId;
  const path: MessageNode[] = [];
  let curr = tree.nodes[targetId];

  while (curr) {
    path.unshift(curr);
    if (!curr.parentId) break;
    curr = tree.nodes[curr.parentId];
  }

  return path;
}

/**
 * Appends a regular turn to the active leaf of the conversation
 */
export function appendTurnToActiveLeaf(
  tree: ConversationTree,
  userText: string,
  model: string
): { updatedTree: ConversationTree; userNodeId: string; assistantNodeId: string } {
  const parentId = tree.activeLeafId;
  const userNodeId = createId();
  const assistantNodeId = createId();
  const now = Date.now();

  const userNode: MessageNode = {
    id: userNodeId,
    parentId,
    childIds: [assistantNodeId],
    role: 'user',
    content: userText,
    createdAt: now,
  };

  const assistantNode: MessageNode = {
    id: assistantNodeId,
    parentId: userNodeId,
    childIds: [],
    role: 'assistant',
    content: '',
    model,
    createdAt: now,
  };

  const parentNode = tree.nodes[parentId];
  const updatedNodes = {
    ...tree.nodes,
    ...(parentNode ? { [parentId]: { ...parentNode, childIds: [...parentNode.childIds, userNodeId] } } : {}),
    [userNodeId]: userNode,
    [assistantNodeId]: assistantNode,
  };

  return {
    updatedTree: {
      ...tree,
      updatedAt: now,
      activeLeafId: assistantNodeId,
      nodes: updatedNodes,
    },
    userNodeId,
    assistantNodeId,
  };
}

/**
 * Creates a branch directly from a specific parent node (or root if null)
 */
export function branchFromNode(
  tree: ConversationTree,
  targetParentNodeId: string | null,
  userText: string,
  model: string
): { updatedTree: ConversationTree; userNodeId: string; assistantNodeId: string } {
  const userNodeId = createId();
  const assistantNodeId = createId();
  const now = Date.now();

  const userNode: MessageNode = {
    id: userNodeId,
    parentId: targetParentNodeId,
    childIds: [assistantNodeId],
    role: 'user',
    content: userText,
    createdAt: now,
  };

  const assistantNode: MessageNode = {
    id: assistantNodeId,
    parentId: userNodeId,
    childIds: [],
    role: 'assistant',
    content: '',
    model,
    createdAt: now,
  };

  const targetParent = targetParentNodeId ? tree.nodes[targetParentNodeId] : null;
  const updatedParent = targetParent
    ? { ...targetParent, childIds: [...targetParent.childIds, userNodeId] }
    : undefined;

  return {
    updatedTree: {
      ...tree,
      updatedAt: now,
      activeLeafId: assistantNodeId,
      nodes: {
        ...tree.nodes,
        ...(updatedParent && targetParentNodeId ? { [targetParentNodeId]: updatedParent } : {}),
        [userNodeId]: userNode,
        [assistantNodeId]: assistantNode,
      },
    },
    userNodeId,
    assistantNodeId,
  };
}

/**
 * Returns siblings information for a given node:
 * which index among siblings is this node, and total siblings count
 */
export function getBranchSiblingInfo(tree: ConversationTree, nodeId: string): {
  siblings: string[];
  currentIndex: number;
  total: number;
} {
  const node = tree.nodes[nodeId];
  if (!node) return { siblings: [nodeId], currentIndex: 0, total: 1 };

  if (!node.parentId) {
    // Root level nodes
    const rootNodes = Object.values(tree.nodes).filter((n) => n.parentId === null).map((n) => n.id);
    const currentIndex = rootNodes.indexOf(nodeId);
    return {
      siblings: rootNodes,
      currentIndex: currentIndex >= 0 ? currentIndex : 0,
      total: rootNodes.length,
    };
  }

  const parent = tree.nodes[node.parentId];
  if (!parent) return { siblings: [nodeId], currentIndex: 0, total: 1 };

  const siblings = parent.childIds;
  const currentIndex = siblings.indexOf(nodeId);

  return {
    siblings,
    currentIndex: currentIndex >= 0 ? currentIndex : 0,
    total: siblings.length,
  };
}

/**
 * Finds the deepest descendant leaf starting from a given node
 */
export function findDeepestLeaf(tree: ConversationTree, startNodeId: string): string {
  let curr = tree.nodes[startNodeId];
  if (!curr) return startNodeId;

  while (curr.childIds.length > 0) {
    // pick last child as standard
    const lastChildId = curr.childIds[curr.childIds.length - 1];
    const next = tree.nodes[lastChildId];
    if (!next) break;
    curr = next;
  }

  return curr.id;
}

/**
 * Switches the active branch by pointing activeLeafId to the leaf of the target sibling
 */
export function switchBranchToSibling(tree: ConversationTree, targetSiblingId: string): ConversationTree {
  const leafId = findDeepestLeaf(tree, targetSiblingId);
  return {
    ...tree,
    activeLeafId: leafId,
    updatedAt: Date.now(),
  };
}

