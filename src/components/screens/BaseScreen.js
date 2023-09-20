export class BaseScreen {
    changeTitle(routeName) {
        document.querySelector('title').innerHTML = 'RED Bank | ' + routeName
    }
}