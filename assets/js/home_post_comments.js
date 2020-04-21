class PostComments{

	constructor(postId){
		this.postId = postId;
		this.postContainer = $(`#post-${postId}`);
		this.newCommentForm = $(`#post-${postId}-comments-form`);

		this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', self.postContainer).each(function(){
            self.deleteComment($(this));
        });
	}

	createComment(postId){
        let pSelf = this;//class object 
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;//form element object
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    $(`#post-${postId}-comments-form input[type='text']`).val('');
                    pSelf.deleteComment($(' .delete-comment-button', newComment));
                    
                    //call class togglelike
                    new ToggleLike($(' .toggle-like-button', newComment));
                    
                    new Noty({
                        theme: 'relax',
                        text: "Comment added successfully !",
                        type: 'success',
                        layout: 'topCenter',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        return $(`
        <li id='comment-${comment._id }'>
            <p>
                <small>
                    <a class='delete-comment-button' href='/comments/destroy/${ comment._id }'>X</a>
                </small>
                <small>${ comment.content } : </small>
                <small>${ comment.user.name }</small>
                <small class='cmnt-date'>Just Now</small>

                <div class='like-pallet'>
                        
                        <a style='color:white;' class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                            0 Likes
                        </a>
       
                </div>  
            </p>
        </li>
        `)
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted successfully !",
                        type: 'success',
                        layout: 'topCenter',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}