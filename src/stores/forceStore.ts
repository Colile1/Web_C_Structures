import { makeAutoObservable, reaction } from 'mobx';

class ForceStore {
  maxAbsForce = 1000;
  minForce = -1000;
  maxForce = 1000;
  forces: number[] = [];

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.forces,
      () => this.updateScale()
    );
  }

  updateScale() {
    const absForces = this.forces.map(Math.abs);
    this.maxAbsForce = Math.max(1000, ...absForces);
    this.minForce = Math.min(...this.forces);
    this.maxForce = Math.max(...this.forces);

  }

  addForce(force: number) {
    this.forces.push(force);
  }
}

export const forceStore = new ForceStore();
