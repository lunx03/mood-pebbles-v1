
import { MoodSignature, SurfaceFinish } from './types';

export const INITIAL_SIGNATURES: MoodSignature[] = [
  {
    id: 's1',
    name: 'Morning Meadow',
    category: 'Clarity',
    color: '#a3ad8b',
    shapeClass: 'organic-shape-1',
    description: 'A crisp start to the day.',
    finish: 'polished'
  },
  {
    id: 's2',
    name: 'Olive Grove',
    category: 'Depth',
    color: '#847E1F',
    shapeClass: 'organic-shape-2',
    description: 'Quiet thoughts in the twilight.',
    finish: 'matte'
  },
  {
    id: 's3',
    name: 'Sunlight Ripple',
    category: 'Energy',
    color: '#EED24B',
    shapeClass: 'organic-shape-3',
    description: 'Warm, vibrant, and alive.',
    finish: 'polished'
  },
  {
    id: 's4',
    name: 'Mist River',
    category: 'Calm',
    color: '#D2DAE2',
    shapeClass: 'organic-shape-4',
    description: 'Serenity in the haze.',
    finish: 'matte'
  },
  {
    id: 's5',
    name: 'Canyon Stone',
    category: 'Warmth',
    color: '#EA7B30',
    shapeClass: 'organic-shape-5',
    description: 'Peaceful and still.',
    finish: 'none'
  },
  {
    id: 's6',
    name: 'Lilac Dusk',
    category: 'Serenity',
    color: '#B5A3D3',
    shapeClass: 'organic-shape-6',
    description: 'Reflecting on the day\'s gifts.',
    finish: 'textured'
  }
];

export const COLORS = [
  '#a3ad8b', // Image Green
  '#847E1F', // Image Olive
  '#EED24B', // Image Yellow
  '#D2DAE2', // Image Grey/Beige
  '#EA7B30', // Image Orange
  '#B5A3D3', // Image Purple
  '#8D9994', // Mossy Grey
  '#D2C3B5', // Beige Sand
  '#FAD2E1', // Soft Pink
  '#BEE1E6', // Arctic Blue
  '#E2ECE9', // Mint Frost
  '#DFE7FD', // Lavender Mist
];

export const SHAPES = [
  'organic-shape-1', 'organic-shape-2', 'organic-shape-3', 
  'organic-shape-4', 'organic-shape-5', 'organic-shape-6'
];

export const FINISHES: SurfaceFinish[] = ['none', 'polished', 'matte', 'textured'];