export const renderTweet =  function(tweet){
  let like = tweet.likeCount == 1 ? `Like` : `Likes`;
  let replies = tweet.replyCount == 1 ? `Reply` : `Replies`;
  let retweets = tweet.retweetCount == 1 ? `Retweet` : `Retweets`;

  let isliked = tweet.isLiked == true ? `is-primary` : `is-primary is-outlined`
  
  
  if(tweet.isMine == false){
    return `<div id="tweet${tweet.id}" class="box">
    <h2 id="name"><strong>${tweet.author}</strong></h2>
    <br>
    <p id="body${tweet.id}">${tweet.body}</p>
    <br>
    
    <div class="columns">
      <div class="column">
        <button id="${tweet.id}" class="like button ${isliked}" value="${tweet.isLiked}"><span><i class="fa fa-heart-o"></i></span></button>
        <br>
        <span>${tweet.likeCount} <strong>${like}</strong></span>
      </div>
      <div class="column">
        <button class="rp button is-primary is-outlined" id="${tweet.id}"><i class="fa fa-reply"></i></button>
        <br>
        <span id="numLikes">${tweet.replyCount} <strong>${replies}</strong></span>
      </div>
      <div class="column">
        <button class="rt button is-primary is-outlined" id="${tweet.id}" name="${tweet.author}"><i class="fa fa-retweet"></i></button>
        <br>
        <span id="numLikes">${tweet.retweetCount} <strong>${retweets}</strong></span>
      </div>
    
    </div>
    
  </div>`
  }else{
    return `<div id="tweet${tweet.id}" class="box">
    <h2 id="name"><strong>${tweet.author}</strong></h2>
    <br>
    <div id="content${tweet.id}">
      <p id="body${tweet.id}">${tweet.body}</p>
      <br>
      <button class="edit button is-dark" id="${tweet.id}"><i class="fa fa-pencil"></i></button>
    </div>
    <br>
    <span>${tweet.likeCount} <strong>${like}</strong></span>
    <br>
    <br>
    <div class="columns">
      
      <div class="column">
        <button class="rp button is-primary is-outlined" id="${tweet.id}"><i class="fa fa-reply"></i></button>
        <br>
        <span id="numLikes">${tweet.replyCount} <strong>${replies}</strong></span>
      </div>
      <div class="column">
        <button class="rt button is-primary is-outlined" id="${tweet.id}" name="${tweet.author}"><i class="fa fa-retweet"></i></button>
        <br>
        <span id="numLikes">${tweet.retweetCount} <strong>${retweets}</strong></span>
      </div>
      
      
    
    </div>
    
    <button class="deletetweet button is-primary" id="${tweet.id}"><i class="fa fa-trash"></i></button>
    
    
    
    
  </div>`
  }

}

export async function generate() {
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
      });

    let tweets = `<div id="tweets">`;
    for(let i = 0; i < 50; i++){
      tweets += renderTweet(result.data[i]);
    }
    tweets += `</div>`;
    $('#root').append(tweets);
}

export async function likeAndUnlike(event) {
  if(event.target.value == "false"){
    const result = await axios({
      method: 'put',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + event.target.id + '/like',
      withCredentials: true,
    });
  }else{
    const result = await axios({
      method: 'put',
      url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/' + event.target.id + '/unlike',
      withCredentials: true,
    });

  }

  const t = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
  });
  

  $(`#tweet${event.target.id}`).replaceWith(renderTweet(t.data));
}

export async function renderForm() {
  let form = `<div class="field">
  <div class="control">
    <textarea class="textarea is-primary" placeholder="What's on your mind?"></textarea>
  </div>
  <button class="tweeting button is-warning" type="submit">Submit</button>
  <button class="cancelTweet button is-danger" type="submit">Cancel</button>
  </div>`
  $('#create').replaceWith(form);
}

export async function cancel(event){
  
  $('.field').replaceWith(`<button class="button is-primary is-large" id="create">Create&nbsp;<i class="fa fa-pencil-square-o"></i></button>`);
  
}

export async function create(event){
  event.preventDefault();
  
  const result = await axios({
    method: 'post',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
    withCredentials: true,
    data: {
      body: $(".textarea").val()
    },
  });
  $('.field').replaceWith(`<button class="button is-primary is-large" id="create">Create&nbsp;<i class="fa fa-pencil-square-o"></i></button>`);
  $('#tweets').replaceWith(generate());
  
}

export async function deleteTweet(event){
  const result = await axios({
    method: 'delete',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
  });
  

  $(`#tweet${event.target.id}`).replaceWith('');
}


export async function renderEditForm(event) {
  let text = $(`#body${event.target.id}`).text();
  let editForm = `<div class="field" id="editForm">
  <div class="control">
    <textarea class="textarea is-primary" id="updateForm">${text}</textarea>
  </div>
  <button id="${event.target.id}" class="update button is-warning" type="submit">Update</button>
  <button id="${event.target.id}" class="cancelUpdate button is-danger" type="submit">Cancel</button>
  </div>`
  $(`#content${event.target.id}`).replaceWith(editForm);
}

export async function cancelUpdate(event){
  const t = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
  });
  let tweet = t.data;
  $('#editForm').replaceWith(`<div id="content${tweet.id}">
  <p id="body${tweet.id}">${tweet.body}</p>
  <br>
  <button class="edit button is-dark" id="${tweet.id}"><i class="fa fa-pencil"></i></button>
  </div>`);
  
}

export async function updateEditForm(event) {
  

  event.preventDefault();
  const result = await axios({
    method: 'put',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
    data: {
      body: $("#updateForm").val()
    },
  });

  const t = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
  });
  


  $(`#tweet${event.target.id}`).replaceWith(renderTweet(t.data));

}

export async function rtForm(event) {
  
  let editForm = `<div class="field" id="retweetForm">
  <div class="control">
    <textarea class="textarea is-primary" id="rtForm" rows="2"></textarea>
  </div>
  <button id="${event.target.id}" class="retweetSubmit button is-warning" type="submit" name="${event.target.name}">Retweet!</button>
  <button id="${event.target.id}" class="cancelRetweet button is-danger" type="submit" name="${event.target.name}">Cancel</button>
  </div>`
  $(`#tweet${event.target.id}`).append(editForm);
}

export async function cancelRetweet(event){
  
  $('#retweetForm').replaceWith("");
  
}

export async function retweet(event) {
  let text = $(`#body${event.target.id}`).text();
  const result = await axios({
    method: 'post',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
    withCredentials: true,
    data: {
      "type": "retweet",
      "parent": event.target.id,
      "body": $("#rtForm").val() + `<br>Retweeted from ${event.target.name}: ${text}`
    },
  });

  const t = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
  });

  $('#retweetForm').replaceWith("");
  $(`#tweet${event.target.id}`).replaceWith(renderTweet(t.data));

}



export async function replyForm(event) {
  
  let editForm = `<div class="field" id="replyForm">
  <div class="control">
    <textarea class="textarea is-primary" id="rpForm" rows="2"></textarea>
  </div>
  <button id="${event.target.id}" class="replySubmit button is-warning" type="submit" name="${event.target.name}">Reply</button>
  <button id="${event.target.id}" class="cancelReply button is-danger" type="submit" name="${event.target.name}">Cancel</button>
  </div>`
  $(`#tweet${event.target.id}`).append(editForm);
}

export async function cancelReply(event){
  
  $('#replyForm').replaceWith("");
  
}

export async function reply(event) {
  let text = $(`#body${event.target.id}`).text();
  const result = await axios({
    method: 'post',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
    withCredentials: true,
    data: {
      "type": "reply",
      "parent": event.target.id,
      "body": $("#rtForm").val() + `<br>Retweeted from ${event.target.name}: ${text}`
    },
  });

  const t = await axios({
    method: 'get',
    url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets/'+event.target.id,
    withCredentials: true,
  });

  $('#replyForm').replaceWith("");
  $(`#tweet${event.target.id}`).replaceWith(renderTweet(t.data));

}




$(document).ready(function () {
  generate();

  $(document).on("click", ".like", likeAndUnlike);
  $(document).on("click", "#create", renderForm);
  $(document).on("click", ".tweeting", create);
  $(document).on("click", ".deletetweet", deleteTweet);
  $(document).on("click", ".edit", renderEditForm);
  $(document).on("click", ".update", updateEditForm);
  $(document).on("click", ".rt", rtForm);
  $(document).on("click", ".retweetSubmit", retweet);
  $(document).on("click", ".cancelTweet", cancel);
  $(document).on("click", ".cancelUpdate", cancelUpdate);
  $(document).on("click", ".cancelRetweet", cancelRetweet);
  $(document).on("click", ".rp", replyForm);
  $(document).on("click", ".cancelReply", cancelReply);
  $(document).on("click", ".replySubmit", reply);
  });