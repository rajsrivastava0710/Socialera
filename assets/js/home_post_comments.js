class PostComments{

	constructor(postId){
		this.postId = postId;
		this.postContainer = $(`#post-${postId}`);
		this.newCommentForm = $(`#post-${postId}-comments-form`);

		this.createComment(postId);
        console.log(this.postId);
        console.log('***');
        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
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
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id='comment-${ comment._id }'>
					<p>
							<small>
								<a class='delete-comment-button' href='/comments/destroy/${ comment._id }'>X</a>
							</small>
						<small>
							${ comment.content } : 
						</small>
						<small>
							${ comment.user.name }
						</small>
					</p>
				</li>`);
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