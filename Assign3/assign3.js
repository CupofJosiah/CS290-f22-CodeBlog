/*
 * Write your client-side JS code in this file.  Don't forget to include your
 * name and @oregonstate.edu email address below.
 *
 * Name: Josiah Humber
 * Email: humberj@oregonstate.edu
 */

/* ======INIT====== */ {
var hiddenObj = document.getElementsByClassName("hidden")
var postsObj = document.getElementById("posts")
var permPostsObj = Array.from(postsObj.childNodes) // Deep stores posts in order from the DOM. Is not connected to DOM
var filterButton = document.getElementById("filter-update-button")
var cityObj = document.getElementById("filter-city")
}



/* ======FUNCTIONS USED IN EVENT HANDLING====== */ {
// Method for showing all objects with class 'hidden'
function showModal() {
    // document.getElementById("sell-something-modal").style.display = "block";
    // document.getElementById("modal-backdrop").style.display = "block";
    for (var i = 0; i < hiddenObj.length; i++)
    hiddenObj[i].style.display = "block";
}

// Method for hiding all objects with class 'hidden'
function hideModal() {
    //Finds all hidden objects then hides them
    for (var i = 0; i < hiddenObj.length; i++){
        hiddenObj[i].style.display = "none";
    }
    //Resets all input fields
    document.getElementById("post-price-input").value = ''
    document.getElementById("post-city-input").value = ''
    document.getElementById("post-text-input").value = ''
    document.getElementById("post-photo-input").value = ''
    document.getElementsByName("post-condition")[0].checked = true
}

// Adds all posts stored in separate array back into the DOM in the same order they were stored
function refreshPosts() {
    for(var i=0; i<permPostsObj.length; i++){
        postsObj.appendChild(permPostsObj[i])
    }
}
}


/* ======EVENT HANDLING====== */ {
/* Toggle Modal display */ {
document.getElementById("sell-something-button").addEventListener("click", showModal) // ON by clicking sell button
document.getElementById("modal-cancel").addEventListener("click", hideModal) // OFF by clicking cancel or...
document.getElementById("modal-close").addEventListener("click", hideModal)  // OFF by clicking 'x'
}

// Filters posts
filterButton.addEventListener("click", function() {

    refreshPosts() // Adds all posts back into DOM in case some were removed

    // Temporarily stores user input from the filter inputs
    var filterText = document.getElementById("filter-text").value
    var filterValueMin = parseFloat(document.getElementById("filter-min-price").value)
    var filterValueMax = parseFloat(document.getElementById("filter-max-price").value)
    var filterCity = document.getElementById("filter-city").value.toLowerCase()
    var filterCondition = []
    for(var i=1; i<=5; i++) {filterCondition[i-1] = document.getElementsByClassName("filter-fieldset")[0].children[i].children[0].checked}

    // Loops through the posts in the DOM (backwards because of quirks with the remove method) and tests each post against the filter values
    for (var i = postsObj.childElementCount-1; i >= 0; i--) {

        // Temporarily stores post data
        var postValue = parseFloat(postsObj.children[i].attributes[1].nodeValue)
        var postCity = postsObj.children[i].attributes[2].nodeValue.toLowerCase()
        var postCondition = postsObj.children[i].attributes[3].nodeValue
        var postTitle = postsObj.children[i].children[0].children[1].children[0].text

        // Stores the boolean data from each filter test. If no filter was entered in a field, the post automatically 'matches' filter in that field
        var isOverMin = filterValueMin ? postValue >= filterValueMin : true // <-this translates to: if(filterValue 1= null) then(return boolean value of doe filterValue match postValue) else(return true) 
        var isUnderMax = filterValueMax ? postValue <= filterValueMax : true
        var isCity = filterCity ? postCity == filterCity : true
        var isCondition = true
        var hasText = filterText ? postTitle.toLowerCase().search(filterText.toLowerCase()) != -1 : true
        if (filterCondition[0]||filterCondition[1]||filterCondition[2]||filterCondition[3]||filterCondition[4]) { // Checks if a Condition is checked on the filter. If not, defaults to true.
            //If a filter was checked, then the if operator below checks which condition the current post is, then sets the isCondition boolean to the value of the matching filter condition
            isCondition = postCondition=="new" ? filterCondition[0] : postCondition=="excellent" ? filterCondition[1] : postCondition=="good" ? filterCondition[2] : postCondition=="fair" ? filterCondition[3] : postCondition=="poor" ? filterCondition[4] : false
        }

        // If all filter boolean vars are true, then it skips the if. If NOT, it removes the post from the DOM
        if (!(isOverMin && isUnderMax && isCity && isCondition && hasText)) {
            postsObj.children[i].remove()
        }
    }
})

// Add new post
document.getElementById("modal-accept").addEventListener("click", function() {
    // Get user input
    var price = document.getElementById("post-price-input").value
    var city = document.getElementById("post-city-input").value.replace(/</g,"&lt;").replace(/>/g,"&gt;") // If the user includes characters '<' or '>', they are replaced to be the display text equivalent as to avoid script injection
    var condition = ''
    var conInput = document.getElementsByName("post-condition") // Gets whole input html object
    for (var i=0; i<conInput.length; i++){ // Searches through each radio button to find the selected one. Then sets the checked radio button to the post's condition value
        if (conInput[i].checked) {
            condition = conInput[i].value
        }
    }
    var photoURL = document.getElementById("post-photo-input").value.replace(/</g,"&lt;").replace(/>/g,"&gt;")
    var itemDescription = document.getElementById("post-text-input").value.replace(/</g,"&lt;").replace(/>/g,"&gt;")

    /* Checks if any fields were left blank. 
     * If not, injects new post at the end of the separate array, then refreshes posts. 
     * If so, it prompts the user to try again.
     */
    if(price&&city&&photoURL&&itemDescription) { 
        // Checks if city is in filter list already
        var cityBool = true
        for(var i=0; i<cityObj.length; i++){
            if(cityObj.children[i].value.toLowerCase()==city.toLowerCase()){
                cityBool = false
            }
        } 
        // If not, it adds the new post's city to the filter list  
        if (cityBool) {
        var newCity = document.createElement("option")
        newCity.text = city
        cityObj.appendChild(newCity)
        }
    var newPost = document.createElement("div")
    newPost.innerHTML = '<div class="post" data-price="' + price + '" data-city="' + city + '" data-condition="' + condition+'"> <div class="post-contents"> <div class="post-image-container">    <img src="'+photoURL+'" alt="'+itemDescription+'"> </div>  <div class="post-info-container">    <a href="#" class="post-title">'+itemDescription+'</a> <span class="post-price">$'+price+'</span> <span class="post-city">('+city+')</span>  </div> </div> </div>'
    permPostsObj.push(newPost.children[0])
    hideModal()
    refreshPosts()
    } else {
        alert("All fields must be filled")
    }
})
}
 