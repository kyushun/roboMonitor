import { observable, computed, action } from 'mobx';
import store from 'store';

const defaultSettings = {
    isDarkTheme: false,
    autoFetch: true,
    authorized: false
};

const STORE_KEY = 'settings';

export default class SettingsStore {
    @observable isDarkTheme = false;
    @observable autoFetch = true;
    @observable authorized = false;

    constructor() {
        const _store = store.get(STORE_KEY);
        if (_store) {
            Object.keys(_store).forEach(function (key) {
                eval(`this.${key} = ${_store[key]}`);
            }, this);
        }
    }

    @action
    reset() {
        store.remove(STORE_KEY);
    }

    @action
    set(key, value) {
        const _s = store.get(STORE_KEY) ? store.get(STORE_KEY) : {};
        _s[key] = value;
        store.set(STORE_KEY, _s);
        eval(`this.${key} = ${value}`);
        location.reload();
    }
}