// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleFriend{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleFriend();
    }

    toggleFriend(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'GET',
                url: $(self).attr('href')
            })
            .done(function(data) {
                if (data.data.addedFriend == true){
                   $(self).html('Unfriend -');  
                    // $('ul#friend-list').prepend($('<li>New Friend</li>'));                  
                }else{
                   $(self).html('Add Friend +');
                }

            })
            .fail(function(errData) {
                console.log(errData,'error in completing the request');
            });
            

        });
    }
}
