import { observable, computed, action } from 'mobx';
import store from 'store';

const defaultSettings = {
    isDarkTheme: false,
    autoFetch: true,
    authorized: false
};

export default class MonitorStore {
    @observable runningProcess = [];
    @observable programList = [];

    @computed get isRunning() {
        return (this.runningProcess != null && this.runningProcess.length > 0);
    }

    @action
    setRoboStatus(runningName) {
        this.runningProcess = runningName;
    }
}