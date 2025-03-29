import { makeAutoObservable } from "mobx";
import { StructureSnapshot } from "../types/structure"; // Importing StructureSnapshot

class HistoryStore {
  stack: StructureSnapshot[] = [];
  currentIndex = -1;

  constructor() {
    makeAutoObservable(this);
  }

  get canUndo() { return this.currentIndex > 0; }
  get canRedo() { return this.currentIndex < this.stack.length - 1; }

  pushSnapshot(snapshot: StructureSnapshot) {
    this.stack = this.stack.slice(0, this.currentIndex + 1);
    this.stack.push(snapshot);
    this.currentIndex++;
  }

  undo() {
    if (this.canUndo) {
      this.currentIndex--;
      return this.stack[this.currentIndex];
    }
  }

  redo() {
    if (this.canRedo) {
      this.currentIndex++;
      return this.stack[this.currentIndex];
    }
  }
}

export const historyStore = new HistoryStore();
