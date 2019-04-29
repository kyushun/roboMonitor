import { observable, computed, action } from 'mobx';
import store from 'store';

const defaultSettings = {
    isDarkTheme: false,
    autoFetch: true,
    authorized: false
};

export default class MonitorStore {
    @observable settings = null;
    @observable runningProcess = [];
    @observable programList = [];

    constructor() {
        if (store.get('settings')) {
            this.settings = store.get('settings');
        } else {
            store.set('settings', defaultSettings);
        }
    }

    @computed get isRunning() {
        return (this.runningProcess != null && this.runningProcess.length > 0);
    }

    @action
    setRoboStatus(runningName) {
        this.runningProcess = runningName;
    }

    
    @action
    resetSettings() {
        store.clearAll();
        store.set('settings', defaultSettings);
        this.settings = store.get('settings');
    }

    @action
    setSettings(settings) {
        this.settings = settings;
        store.set('settings', settings);
    }
}