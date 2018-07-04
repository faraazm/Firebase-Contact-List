$(document).ready(function() {
    $(".modal").modal();
    
    var materialize = {
        initModal: function(buttonId, modalId){
            console.log(modalId);
            $(buttonId).click(function(){
                $(modalId).modal('open');
            })
        }
    }

    materialize.initModal('#addContactBtn', '#addContact');
});