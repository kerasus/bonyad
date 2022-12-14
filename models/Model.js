import {getters as storeDataGetters, state as storeDataState} from "../store/abrisham";
import moment from 'moment';

import * as PersianDate from "persian-date";
import CRUD from '@/utils/CRUD'

class Model {

    constructor(data, props) {
        this.crud = new CRUD();
        this.apiResource = null;
        this.inputData = this.optional(data, {});
        this.warn = {
            mode: false,
            keys: []
        };
        this.editMode = false;
        this.loading = false;
        this.props = props;
        this.initProps();
        this.actionUrl = storeDataGetters.url_crud_model(storeDataState)(this);
    }

    initProps() {
        for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
            let prop = this.props[i],
                key = prop.key;
            if (prop.init) {
                this[key] = prop.init(this.inputData);
            } else if (prop.relatedModel) {
                this[key] = new prop.relatedModel(this.inputData[key]);
                this.relatedModelId(key);
            } else if (prop.value) {
                if (typeof prop.value === 'function') {
                    this[key] = prop.value(this.inputData[key], this.inputData);
                } else {
                    this[key] = prop.value;
                }
            } else {
                let defaultVal = null;
                if (prop.default) {
                    defaultVal = prop.default;
                }
                this[key] = this.optional(this.inputData[key], defaultVal);
            }
        }
    }

    isValidData(data) {
        return (typeof data !== 'undefined' && data !== null && data !== '');
    }

    optional(data, optionalData, refinementData) {
        if (this.isValidData(data)) {
            if (typeof refinementData === 'function') {
                return refinementData(data);
            } else {
                return data;
            }
        } else {
            if (typeof optionalData !== 'undefined') {
                return optionalData;
            } else {
                return null;
            }
        }
    }

    shamsiDate(key) {
        return {
            dateTime: new PersianDate(new Date(this[key])).format('HH:mm:ss YYYY/MM/DD'),
            date: new PersianDate(new Date(this[key])).format('YYYY/MM/DD'),
            time: new PersianDate(new Date(this[key])).format('HH:mm:ss'),
        }
    }

    relatedModelId(relatedModelName) {
        this[relatedModelName+'_id'] = this[relatedModelName].id;
    }

    findProp(key) {
        return this.props.find(function (prop) {
            return (prop.key === key);
        });
    }

    set(newData) {
        for (let i = 0; typeof newData[i] !== 'undefined'; i++) {
            let prop = this.findProp(newData[i].key);
            if (prop) {
                if (prop.relatedModel) {
                    this[prop.key] = new prop.relatedModel(newData[i].value);
                    this[prop.key + '_id'] = this[prop.key].id;
                } else {
                    this[prop.key] = newData[i].value;
                }
            }
        }
    }

    bufferNewData(data, clear) {
        let prop = this.findProp(data.key);
        if (typeof prop === 'undefined') {
            return;
        }

        if (typeof clear !== 'undefined') {
            delete this[prop.key + '_buffer'];
            delete this[prop.key + '_id_buffer'];
            return;
        }

        if (prop.relatedModel) {
            data.value = new prop.relatedModel(data.value);
            this[prop.key + '_id_buffer'] = data.value.id;
        }
        this[prop.key + '_buffer'] = data.value;
    }

    buffer(newData) {
        if (typeof newData === 'undefined') {
            for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
                this.bufferNewData({
                    key: this.props[i].key,
                    value: this[this.props[i].key]
                });
            }
        } else {
            for (let i = 0; typeof newData[i] !== 'undefined'; i++) {
                this.bufferNewData(newData[i]);
            }
        }
    }

    apply() {
        for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
            this[this.props[i].key + '_old'] = this[this.props[i].key];
            if (typeof this[this.props[i].key + '_buffer'] !== 'undefined') {
                this[this.props[i].key] = this[this.props[i].key + '_buffer'];
            }
            if (this[this.props[i].key + '_id']) {
                this[this.props[i].key + '_id_old'] = this[this.props[i].key + '_id'];
                if (typeof this[this.props[i].key + '_id' + '_buffer'] !== 'undefined') {
                    this[this.props[i].key + '_id'] = this[this.props[i].key + '_id' + '_buffer'];
                }
            }
            this.bufferNewData({
                key: this.props[i].key,
                value: null
            }, true);
        }
    }

    revertToOldData() {
        for (let i = 0; typeof this.props[i] !== 'undefined'; i++) {
            this[this.props[i].key] = this[this.props[i].key + '_old'];
            this[this.props[i].key + '_buffer'] = null;
            if (this[this.props[i].key + '_id']) {
                this[this.props[i].key + '_id_buffer'] = null;
                this[this.props[i].key + '_id'] = this[this.props[i].key + '_id_old'];
            }
        }
    }

    list(data, url) {
        if (typeof url === 'undefined') {
            url = this.actionUrl;
            if (this.actionUrl === null) {
                console.error('url_key is null.');
            }
        }
        return this.crud.read(url, data);
    }

    create(data, url) {
        if (typeof url === 'undefined') {
            url = this.actionUrl;
            if (this.actionUrl === null) {
                console.error('url_key is null.');
            }
        }
        if (!data) {
            data = this.loadApiResource();
        }
        return this.crud.create(url, data);
    }

    show(id, url) {
        if (typeof url === 'undefined') {
            if (!id) {
                id = this.id;
            }
            url = this.actionUrl + '/' + id;
            if (this.actionUrl === null) {
                console.error('url_key is null.');
            }
        }
        return this.crud.read(url);
    }

    update(url, headers) {
        if (typeof url === 'undefined') {
            url = this.actionUrl + '/' + this.id;
            if (this.actionUrl === null) {
                console.error('url_key is null.');
            }
        }
        let data = this;
        if (this.apiResource) {
            data = this.loadApiResource();
        }
        return this.crud.update(url, data, headers);
    }

    delete(url) {
        if (typeof url === 'undefined') {
            url = this.actionUrl + '/' + this.id;
            if (this.actionUrl === null) {
                console.error('url_key is null.');
            }
        }
        return this.crud.delete(url);
    }

    loadApiResource() {
        if (this.apiResource.sendType === 'form-data') {
            let formData = new FormData();
            for (let i = 0; typeof this.apiResource.fields[i] !== 'undefined'; i++) {
                let field = this.apiResource.fields[i];
                if (field.value) {
                    if (typeof field.value === 'function') {
                        let fieldValue = field.value();
                        // if (fieldValue) {
                            formData.append(field.key, fieldValue);
                        // }
                    } else {
                        // if (field.value) {
                            formData.append(field.key, field.value);
                        // }
                    }
                } else {
                    // if (this[field.key]) {
                        formData.append(field.key, this[field.key]);
                    // }
                }
            }

            return formData;
        } else {
            let data = {};
            for (let i = 0; typeof this.apiResource.fields[i] !== 'undefined'; i++) {
                let field = this.apiResource.fields[i];
                if (field.value) {
                    if (typeof field.value === 'function') {
                        data[field.key] = field.value();
                    } else {
                        data[field.key] = field.value;
                    }
                } else {
                    data[field.key] = this[field.key];
                }
            }
            return data;
        }
    }

    diffToNow(key) {
        let now = new moment(new Date()),
            target = new moment(new Date(this[key])),
            duration = moment.duration(target.diff(now));

        return {
            diff: duration,
            humanize: duration.humanize(true)
        };
    }

    // moment.locale('fa');
    //moment.duration(1, "minutes").humanize();

    // var x = new moment()
    // var y = new moment()
    // var duration = moment.duration(x.diff(y))

    //moment.duration(x.diff(y)).humanize();
}
export {Model};
