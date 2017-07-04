import { render } from 'react-dom';
import app from './app';

document.addEventListener('DOMContentLoaded', () => {
  render(app, document.getElementById('app'));
});