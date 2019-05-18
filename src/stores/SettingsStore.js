import { observable, computed, action } from 'mobx';
import axios from 'axios';
import store from 'store';

const STORE_KEY = 'settings';

export default class SettingsStore {
    @observable isDarkTheme = false;
    @observable autoFetch = true;
    @observable onTaskDetailView = false;
    @observable ssFetchInterval = 5000;
    @observable statusFetchInterval = 2000;
    @observable authKey = null;
    @observable authorized = false;
    @observable openedTabs = [];

    constructor() {
        const _store = store.get(STORE_KEY);
        if (_store) {
            Object.keys(_store).forEach(function (key) {
                const v = this.getValueForEval(_store[key]);
                eval(`this.${key} = ${v}`);
            }, this);
        } else {
            this.openedTabs[0] = true;
        }

        if (this.authKey) {
            axios.post('/api/auth', { key: this.authKey })
                .then(result => { this.authorized = true; })
                .catch(err => { this.authorized = false; });
        }
    }

    @action
    reset() {
        store.remove(STORE_KEY);
        location.reload();
    }

    @action
    setAll(obj) {
        Object.keys(obj).forEach((key) => {
            this.set(key, obj[key]);
        });
        location.reload();
    }

    @action
    set(key, value) {
        const _s = store.get(STORE_KEY) ? store.get(STORE_KEY) : {};
        _s[key] = value;
        store.set(STORE_KEY, _s);
        const _v = this.getValueForEval(value);
        eval(`this.${key} = ${_v}`);
    }

    getValueForEval(value) {
        if (typeof (value) == 'string') {
            return `"${value}"`;
        } else if (value != null && typeof (value) == 'object') {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }
}