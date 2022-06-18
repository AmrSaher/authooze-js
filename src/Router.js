export default class Router {
    constructor(router, redirects) {
        if (this.#testRouter(router, redirects)) {
            this.router = router || {};
            this.redirects = redirects || {};
            return {
                router: this.router,
                redirects: this.redirects
            };
        }
    }
    
    #testRouter(router, redirects) {
        // error if not configured or not connected to router
        try {
            let r = [router.options, redirects.home, 
                     redirects.login, redirects.register];
        } catch (e) {
            console.error("Please, set router requirements.");
            return false;
        }
        return true;
    }
}