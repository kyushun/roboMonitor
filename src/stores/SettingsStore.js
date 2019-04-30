import { observable, computed, action } from 'mobx';
import axios from 'axios';
import store from 'store';

const STORE_KEY = 'settings';

export default class SettingsStore {
    @observable isDarkTheme = false;
    @observable autoFetch = true;
    @observable authKey = null;
    @observable authorized = false;

    constructor() {
        const _store = store.get(STORE_KEY);
        if (_store) {
            Object.keys(_store).forEach(function (key) {
                const v = typeof (_store[key]) == 'string' ? `"${_store[key]}"` : _store[key];
                eval(`this.${key} = ${v}`);
            }, this);
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
        const _v = typeof (value) == 'string' ? `"${value}"` : value;
        eval(`this.${key} = ${_v}`);
    }
}