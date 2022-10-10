import {getters as storeDataGetters, state as storeDateState} from "../store/abrisham";

import CRUD from '@/utils/CRUD'

class Collection {

    constructor(data, paginateData) {
        try {
            this.list = [];
            this.crud = new CRUD();
            this.loading = false;
            this.url_key = null;
            this.paginate = paginateData;
            this.setUrlKey();
            this.actionUrl = storeDataGetters.url_crud_collection(storeDateState)(this);

        } catch (e) {
            console.log('constructor e', e);
        }

        if(
            typeof data !== 'undefined' &&
            data !== null &&
            typeof data.list !== 'undefined' &&
            data.list !== null
        ) {
            data = data.list;
        }

        if (this.isIterable(data)){
            try {
                this.add(...data);
            } catch(error) {
                console.log('error', error);
                console.log('error constructor.name: ', this.constructor.name);
                console.log('error data: ', data);
            }
        } else {
            if (typeof data === 'undefined') {
                // console.error('undefined data passed to collection!');
            }
            // console.error('non-iterable data passed to collection! ', data);
        }
    }

    isIterable(obj) {
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    setUrlKey() {
        try {
            let model = this.model(),
                object = new model();

            if (typeof object !== 'undefined' && typeof object.url_key !== 'undefined') {
                this.url_key = object.url_key;
            }
        } catch (e) {
            console.log('e', e);
        }
    }

    model() {
        return null;
    }

    add(...data) {
        let that = this;
        this.addItem(...data.map(t => that.addItem(t)));
    }

    addItem(data) {
        if (typeof data === 'undefined') {
            return;
        }
        let model = this.model();
        let object = new model(data);
       // console.log('in model ------------------>')
        this.list.push(object);
    }

    getItem(key, val) {
        return this.list.find(function (item) {
            return (item[key] === val)
        })
    }

    getIndex(key, val) {
        return this.list.findIndex(function (item) {
            return (item[key] === val)
        })
    }

    fetch(data, url) {
        if (typeof url === 'undefined') {
            url = this.actionUrl;
        }
        return this.crud.read(url, data);
    }

    remove(itemId) {
        for (let i = 0; typeof this.list[i] !== 'undefined'; i++) {
            if (this.list[i].id === itemId) {
                this.list.splice(i, 1);
            }
        }
    }

    clear() {
        this.list = [];
    }

    sort(sortFunction) {
        let sortList = Array.prototype.sort.bind(this.list);
        sortList(sortFunction);
    }

    sortByKey(key, sortType) {

        if (typeof sortType === 'undefined') {
            sortType = 'asc'; // asc - des
        }
        this.sort(function ( a, b ) {
            let sorta = a[key],
                sortb = b[key];
            if (sorta < sortb) {
                return (sortType === 'asc') ? -1 : 1;
            }
            if (sorta > sortb) {
                return (sortType === 'asc') ? 1 : -1;
            }
            return 0;
        });
    }

    setEditMode(mode) {
        this.list.forEach(element => element.editMode = mode);
    }
}
export default Collection;
