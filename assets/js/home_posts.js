{   
    // method to submit the form data for new post using AJAX
    let createPost = function(){
    	let newPostForm = $('#new-post-form');
        // let formData = new FormData($('#new-post-form'));
        let plain_form = document.querySelector('#new-post-form');
	    newPostForm.submit(function(e){
            e.preventDefault();

            formData = new FormData(plain_form);

            $.ajax({
                type: 'post',
                url: '/posts/create',
                dataType:'json',
                processData: false,
                contentType: false,
                data: formData,
                // data: newPostForm.serialize(),//convert form data into json
                success: function(data){
                    console.log(data.data.post);
                	$('#new-post-form textarea').val('');
                    $('#new-post-form input#post-pic').val('');   
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
            return $(`<li id='post-${  post._id }' style = "border-radius: 12px;
            box-shadow: 0 0 11px 3px #b0cad8;">
        
        <div>
            <div style="display: flex;justify-content: space-between;">
                <div style = "
                font-family: 'Circular-Loom';
                font-size: 2rem;
                border-bottom: 2px solid black;
                margin-bottom: 8px;">
                    <a href='/users/profile/${ post.user._id }'>${ post.user.name }</a> posted on Socialera
                </div>
                <div>
                    <a class = 'delete-post-button' href='/posts/destroy/${ post._id }'><i style = "color: #ea3a3a; margin-right: 10px;" class="fa fa-trash"></i></a>
                </div>
            </div>

            ${post.pic ? `<div><img src="${ post.pic }" width=200 height=200></div> ` : ``}

            <div 
            style="font-family: system-ui;
                font-size: 1.5rem;">
                ${ post.content }
            </div>       
        
            <div class='like-pallet'>
				<div>
                <a class="toggle-like-button" data-parentid = ${ post._id } data-likes=${ post.likes.length }" href="/likes/toggle/?id=${post._id}&type=Post">
					<i style="font-size:24px;color:white;" class="fa fa-thumbs-up" ></i>
				</a>
				<span style="color: #5050bf;
                font-size: 1.4rem;" id = "like-post-${post._id}">${ post.likes.length } Likes</span>
				</div>
	            <span class='post-date'>
					Just Now
				</span>
			</div>
                  
        </div>

        <div class='post-comment'>

			<form
			style = "display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin-top: 20px;" 
			id="post-${ post._id }-comments-form" action="/comments/create" method="post">
			
				<input 
				style = "font-size: 1.2rem;
				width: 85%;
				border: 2px solid;
				border-radius: 7px;"
				type="text" name="content" placeholder="Enter your comment here.." title='Type your comment here !' required>
				<input type='hidden' name='post' value='${ post._id }'>
				<input style = "background: #1e90ff;
				width: 80px;
				font-family: cursive;
				font-weight: 600;
				border-radius: 10px;
				border: 2px solid black;" 
				type='submit' value="Comment">
			
			</form>

		</div>

		<div class='post-comment-list'>
			<ul id='post-comments-${ post._id }'>
			
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
            // new ToggleLike($(' .toggle-like-button', self));
            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}