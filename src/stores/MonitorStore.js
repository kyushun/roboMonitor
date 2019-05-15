import { observable, computed, action } from 'mobx';
import store from 'store';

const defaultSettings = {
    isDarkTheme: false,
    autoFetch: true,
    authorized: false
};

export default class MonitorStore {
    @observable connected = false;
    @observable runningProcess = [];
    @observable programList = [];

    @computed get executable() {
        return (this.connected && (this.runningProcess == null || this.runningProcess.length <= 0));
    }
    
    @action
    setRoboStatus(runningName) {
        this.connected = true;
        this.runningProcess = runningName;
    }
}