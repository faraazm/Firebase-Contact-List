function Main() {
    //DOM
    this.signInBtn = document.getElementById('signIn');

    //Event Listeners
    this.signInBtn.addEventListener('click', this.signIn.bind(this));
}

Main.prototype.signIn = function(){
    window.auth.signIn();
}

window.addEventListener('load', function(){
    window.main = new Main();
    window.auth = new Auth();
    auth.checkAuth();
})