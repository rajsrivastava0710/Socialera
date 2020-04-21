{   
    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),//convert form data into json
                success: function(data){
                    // console.log(data);
                	$('#new-post-form textarea').val('');
                    let newPost = newPostDom(data.data.post);
                    $('#post-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    	
                        //remember the space before class name
                    	//class inside the newPost - jquery method


                        //call class PostComments
                    new PostComments(data.data.post._id);
                        
                        //call class togglelike
                    new ToggleLike($(' .toggle-like-button', newPost));
                    
                   	new Noty({
						theme:'relax',
						text: "New Post Created !",
						type:'success',
						layout:'topCenter',
						timeout: 1500,
					}).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM

    let newPostDom = function(post){
            return $(`<li id='post-${  post._id }'>
        
        <p>
            <div>
                <a href='/users/profile/${ post.user._id  }'>${ post.user.name  }</a> posted on Socialera
                <span class='post-date'>
                    Just Now
                </span>
            </div>
                        
            <small>
                <a class = 'delete-post-button' href='/posts/destroy/${ post._id  }'>X</a>
            </small>
                
               <img src='${post.pic}'/ alt='Picture'>
            ${ post.content  }
                        
            <div class='like-pallet'>
                
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${ post._id }&type=Post" style='color:white'>
                        0 Likes
                </a>        
                
            </div>          
        </p>

        <div class='post-comment'>
                        
            <form id="post-${ post._id  }-comments-form" action="/comments/create" method="post">
            
                <input type="text" name="content" placeholder="Enter your comment here.." title='Type your comment here !' required>
                <input type='hidden' name='post' value='${ post._id  }'>
                <input type='submit' value="Add Comment">
            
            </form>
        
        </div>

        <div class='post-comment-list'>

            <ul id='post-comments-${ post._id  }'>
                        
            </ul>
        
        </div>

    </li>`)
    }

    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).attr('href'),
                success: function(data){
                    $(`#post-${ data.data.post_id}`).remove();
                    new Noty({
						theme:'relax',
						text: "Post and associated comments deleted !",
						type:'success',
						layout:'topCenter',
						timeout: 1500,
					}).show();
                    
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }


    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#post-container>ul>li').each(function(){
            let self = $(this);
            deletePost($(' .delete-post-button', self));

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}