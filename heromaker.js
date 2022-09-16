export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

import { Hero } from './classes.js';


export const heroin = new Hero('Jozsi');
heroin.maxhealth += heroin.health;
