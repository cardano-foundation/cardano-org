import type * as Paper from 'paper';

declare global {
  interface Window {
    paper: typeof Paper;
  }
}
