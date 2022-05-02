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
<li id='comment-${ comment._id }' style = "margin: 10px;">
	<div style="display: flex;align-items: center;">
			<div>
				<a class = 'delete-comment-button' href='/comments/destroy/${  comment._id }'><i style = "color: #ea3a3a; margin-right: 10px;" class="fa fa-trash"></i></a>
			</div>
		<div style=
            "display: flex;
            flex-direction: column;
            width: 100%;">
			
            <div style="display: flex;
			    flex-direction: row;
			    font-size: 1.3rem;
			    justify-content: space-between;">
				
                <div style="font-family: system-ui;
				    font-weight: 600;
                    display: flex;">
				    <div style = "text-decoration: underline;">${  comment.user.name }</div>
				    <div style="margin-left: 10px;">
				        <a class="toggle-like-button" data-parentid = "${ comment._id }"  data-likes="${ comment.likes.length }" href="/likes/toggle/?id=${ comment._id }&type=Comment">
							<i style="font-size:24px;color: white;" class="fa fa-thumbs-up" ></i>
						</a>
						<span id = 'like-comment-${  comment._id }' style = "color: #5050bf">${ comment.likes.length } Likes</span>
			        </div>
				</div>		
				<div class='cmnt-date'>Just Now</div> 
			</div>
			<div style="font-size:1.2rem;font-family: system-ui;">${ comment.content }</div>
		</div>
	</div>
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