// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement){
        console.log('toggleCalled')
        this.toggler = toggleElement;
        this.toggleLike();
    }


    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;
            // this is a new way of writing ajax which you might've studied, it looks like the same as promises
            $.ajax({
                type: 'GET',
                url: $(self).attr('href')
            })
            .done(function(data) {
                let likesCount = parseInt($(self).attr('data-likes'));
                let parentItem = data.data.parentItem.toLowerCase()
                let parentId = $(self).attr('data-parentid')
                let setColor;
                if (data.data.deleted == true){
                    likesCount -= 1;
                    // $(self).css({
                    //     color:'white'
                    // })
                    setColor = 'white'
                    
                }else{
                    likesCount += 1;
                    // $(self).css({
                    //     color:'blue'
                    // })
                    setColor = 'blue'
                }
                $(self).attr('data-likes', likesCount);
                $(self).html(`
                <i style="font-size:24px;color: ${setColor}" class="fa fa-thumbs-up" ></i>
                `);
                $(`#like-${parentItem}-${ parentId }`).html(`
                ${likesCount} Likes
                `)
            })
            .fail(function(errData) {
                console.log(errData,'error in completing the request');
            });
            
        });
    }
}
