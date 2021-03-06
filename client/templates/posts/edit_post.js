Template.postEdit.events({
	'submit form': function(event){
		console.log("editing");
		event.preventDefault();

		var currentPostId=this._id;

		var postProperties={
			url: $(event.target).find('[name=url]').val(),
			title: $(event.target).find('[name=title]').val(),
			description: $(event.target).find('[name=description]').val()
		}
		console.log("id is "+this._id);
		console.log("url is "+postProperties.url);
		console.log("title is"+postProperties.title);
		console.log("description is "+postProperties.description);

		var errors=validatePost(postProperties);
		if(errors.title||errors.url||errors.description)
			return Session.set('postEditErrors',errors);

		Posts.update(currentPostId,{$set:postProperties},function(error){
			if(error){
				throwError(error.reason);
			} else {
				Router.go('postPage',{_id:currentPostId});
			}
		});
	},

	'click .delete': function(event){
		event.preventDefault();

		if(confirm("Are you sure you want to delete this post?")){
			var currentPostId=this._id;
			Posts.remove(currentPostId);
			Router.go('postsList');
		}
	}
});

Template.postEdit.created=function(){
	Session.set('postEditErrors',{});
}

Template.postEdit.helpers({
	errorMessage:function(field){
		return Session.get('postEditErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
	}
});