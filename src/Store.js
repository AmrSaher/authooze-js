export default class Store {
    constructor(store) {
        if (this.#testStore(store)) {
            this.store = store || {};
            this.store.state.user = {
                created_at: "",
                email: "",
                name: "",
                updated_at: ""
            };
            return {
                store: store
            };
        }
    }

    #testStore(store) {
        // error if not configured or not connected to store
        try {
            let s = [store, store.state];
        } catch (e) {
            console.error("Please, set store requirements.");
            return false;
        }
        return true;
    }
}