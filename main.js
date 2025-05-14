const apiUrl = "https://6823b82b65ba05803397b364.mockapi.io";
const imageUrl = document.getElementById("imageUrl");
const postText = document.getElementById("postText");
const button = document.getElementById("submit");
let userNav = document.getElementById("user-nav");

localStorage.getItem("username") == null
  ? button.classList.add("disabled")
  : "";

localStorage.getItem("username") != null
  ? (userNav.innerText = `Welcome ${localStorage.getItem("username")}`)
  : (userNav.innerText = "Please log in to be able to comment.");

button.addEventListener("click", async (e) => {
  // post create post
  const response = await fetch(`${apiUrl}/images`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      imageUrl: imageUrl.value,
      text: postText.value,
      comment: [],
      username: localStorage.getItem("username"),
    }),
  });

  getPosts();
});

async function getPosts() {
  const res = await fetch(`${apiUrl}/images`);
  const posts = await res.json();
  displayPosts(posts);
}

function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  container.innerHTML = "";
  const row = document.createElement("div");
  row.className = "row";
  posts.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-3";
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.className = "card-img-top";
    img.style.height = "18rem";
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    const title = document.createElement("h5");
    title.className = "card-title";
    title.innerText = item.text;
    const commentsUl = document.createElement("ul");
    commentsUl.className = "list-group list-group-flush";
    item.comment.forEach((comment) => {
      const commentLi = document.createElement("li");
      commentLi.className = "list-group-item d-flex justify-content-between";
      commentLi.innerText = `${comment.username}:  ${comment.comment}`;
      if (comment.id == localStorage.getItem("id")) {
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm ms-2";
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () =>
          deleteComment(item.id, comment.id, comment.comment)
        );
        commentLi.appendChild(deleteButton);
      }

      commentsUl.appendChild(commentLi);
    });
    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer";
    const commentForm = document.createElement("form");
    commentForm.className = "d-flex";
    const commentInput = document.createElement("input");
    commentInput.type = "text";
    commentInput.className = "form-control me-2";
    localStorage.getItem("username") == null
      ? commentInput.disabled = true
      : "";
    commentInput.placeholder = "Add a comment";
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn btn-primary";
    submitButton.innerText = "Post";
    localStorage.getItem("username") == null
      ? submitButton.classList.add("disabled")
      : "";
    commentForm.appendChild(commentInput);
    commentForm.appendChild(submitButton);
    commentForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const commentText = commentInput.value.trim();
      if (commentText) {
        submitComment(item.id, commentText);
        commentInput.value = "";
      }
    });
    cardFooter.appendChild(commentForm);
    cardBody.appendChild(title);
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(commentsUl);
    card.appendChild(cardFooter);
    col.appendChild(card);
    row.appendChild(col);
  });
  container.appendChild(row);
}

async function submitComment(postId, commentText) {
  try {
    const response = await fetch(`${apiUrl}/images/${postId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    const post = await response.json();
    post.comment.push({
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username"),
      comment: commentText,
    });

    const updateResponse = await fetch(`${apiUrl}/images/${postId}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (!updateResponse.ok) {
      throw new Error("Failed to update post");
    }
    getPosts();
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
}
async function deleteComment(postId, commentId, text) {
  try {
    const resp = await fetch(`${apiUrl}/images/${postId}`);
    if (!resp.ok) {
      throw new Error(`Failed to fetch post ${postId}`);
    }
    const post = await resp.json();

    const updatedPost = {
      ...post,
      comment: post.comment.filter((comment) => {
        return comment.id != commentId || comment.comment != text;
      }),
    };

    const updateResp = await fetch(`${apiUrl}/images/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });
    if (!updateResp.ok) {
      throw new Error(`Failed to update post ${postId}`);
    }
    getPosts();
  } catch (err) {
    console.error("Error deleting comment:", err);
  }
}

getPosts();
