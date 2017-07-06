import { SET_SIMULATOR_LIST } from '../../../config/actionTypes';
import { groupBy, map, thread, through } from 'fun-util';
import transduce from './transduce';

const mapSimDetails = sim => ({
  ...sim,
  name: sim.name || '(No Name)',
  group: sim.group || '(No Group)',
  description: sim.description || '(No Description)',
});

const groupSimulators = thread(
  sims => sims.map(mapSimDetails),
  sims => groupBy(sims, ({ socket }) => socket ? 'socket' : 'http'),
  sims => map(sims, sim => groupBy(sim, ({ group }) => group))
);

const transformAction = action => ({
  ...action,
  groupedSimulators: groupSimulators(action.simulators)
});

export default transduce(SET_SIMULATOR_LIST, transformAction);
