import {observable, computed, action} from 'mobx';

export default class MonitorStore {
    @observable isRoboRunning = false;
    @observable programList = [];    
}