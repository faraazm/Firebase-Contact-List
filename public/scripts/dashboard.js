function Dashboard() {
    //Dashboard Data
    this.user = {};
    this.uid = '';
    this.token = '';
    this.currentEdit = '';

    //Database Ref
    this.database = firebase.database();

    //DOM Elements
    this.signOutBtn = $('#signOut');
    this.profilePic = $('#profilePic');
    this.submitBtn = $('#submitBtn');
    this.firstName = $('#first_name');
    this.lastName = $('#last_name');
    this.contactsList = $('#contactsList');
    this.editModal = $('#editModal');
    this.addModal = $('#addContact');
    this.firstNameEdit = $('#first_name_edit');
    this.lastNameEdit = $('#last_name_edit');
    this.submitEditBtn = $('#submitEdit');

    //Event Listeners
    this.signOutBtn.click(this.signOut.bind(this));
    this.submitBtn.click(this.addContact.bind(this));
    this.submitEditBtn.click(this.submitEdit.bind(this));

    //Refs
    this.contactsRef = this.database.ref('contacts/' + this.uid);
}

Dashboard.prototype.initialize = function () {
    var self = this;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //User Data
            self.uid = user.providerData[0]['uid'];
            self.user = user.providerData[0];
            self.profilePic.src = self.user.photoURL;

            //Refs
            self.contactsRef = self.database.ref('contacts/' + self.uid);
            self.contactsRef.on('child_added', function (data) { self.addContactElement(data) });
            self.contactsRef.on('child_removed', function (data) { self.deleteContactElement(data) });
            self.contactsRef.on('child_changed', function (data) { self.editContactElement(data) });
        }
    });
}

Dashboard.prototype.addContact = function () {
    var newContactRef = this.contactsRef.push();
    newContactRef.set({
        firstName: this.firstName.val(),
        lastName: this.lastName.val()
    })

    this.addModal.modal('close');
}

Dashboard.prototype.deleteContact = function (contactId) {
    this.contactsRef.child(contactId).remove();
}

Dashboard.prototype.editContact = function(contactId, data){
    this.editModal.modal('open');
    this.currentEdit = contactId;
    this.firstNameEdit.val(data.firstName);
    this.lastNameEdit.val(data.lastName);
}

Dashboard.prototype.submitEdit = function(){
    this.contactsRef.child(this.currentEdit).set({
        firstName: this.firstNameEdit.val(),
        lastName: this.lastNameEdit.val()
    });

    this.editModal.modal('close');
}

Dashboard.prototype.addContactElement = function (contact) {
    var self = this;
    var newContact = contact.val();
    var id = contact.key;

    this.contactsList.append(
        "<div id='" + id + "' class='card'>" +
        "<div class='card-content'>" +
        "<span data-id='fullname_" + id + "' class='card-title'>" + newContact.firstName + ' ' + newContact.lastName + "</span>" +
        "<p>Test</p>" +
        "</div>" +
        "<div class='card-action'>" +
        "<button data-id='edit_" + id + "' class='purple accent-4 btn-small m-10'>Edit</button>" +
        "<button data-id='delete_" + id + "' class='purple accent-4 btn-small m-10'>Delete</button>" +
        "</div>" +
        "</div>"
    );

    //CRUD BUTTONS
    $('[data-id="edit_' + id + '"]').on('click', function () { self.editContact(id, newContact) });
    $('[data-id="delete_' + id + '"]').on('click', function () { self.deleteContact(id) });
}

Dashboard.prototype.deleteContactElement = function (contact) {
    var el = $('#' + contact.key);
    el.fadeOut('slow', function() { el.remove() });
}

Dashboard.prototype.editContactElement = function(contact){
    var el = $('[data-id="fullname_' + contact.key + '"]');
    var data = contact.val();
    var fullName = data.firstName + ' ' + data.lastName;

    el.text(fullName);
}

Dashboard.prototype.signOut = function () {
    firebase.auth().signOut().then(function () {
        window.location.href = "/"
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}

window.addEventListener('load', function () {
    window.dashboard = new Dashboard();
    window.auth = new Auth();
    //Check if Authenticated, if not redirect
    auth.checkAuth();
    //Load all user data
    dashboard.initialize();
})

