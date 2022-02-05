import {Model} from './Model';

class Url extends Model {

    constructor(data) {
        super(data, [
            {key: 'api'},
            {key: 'web'},
        ]);
    }
}

export default Url;
