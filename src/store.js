import * as THREE from "three";
import { create } from "zustand";

export const useStore = create(() => ({
    groundObjects: {},
    actions: {},
    mixer: new THREE.AnimationMixer()
}))