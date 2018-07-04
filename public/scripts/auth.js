function Auth(){
    this.provider = new firebase.auth.GoogleAuthProvider();
}

Auth.prototype.signIn = function(){
    firebase.auth().signInWithRedirect(this.provider)
    .then(function(result){
        window.location.href = "/dashboard.html";
    })
    .catch(function(error){
        console.log(error);
    })
}

Auth.prototype.signOut = function(){
    firebase.auth().signOut()
    .then(function(){
        window.location.href = "/";
    })
    .catch(function(error){
        console.log(error);
    })
}

Auth.prototype.checkAuth = function(){
        firebase.auth().onAuthStateChanged(function(user){
            if(window.location.pathname === '/' && user){
                window.location.href = '/dashboard.html';
            } else if(window.location.pathname === '/dashboard.html' && !user){
                window.location.href = '/';
            }
        });
}