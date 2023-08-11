import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// localStorage.setItem('tweetsData', JSON.stringify(tweetsData))

const tweetsFromStorage = JSON.parse(localStorage.getItem('tweetsData'))


document.addEventListener('click', function(e){
    if(e.target.dataset.like){

        handleLikeClick(e.target.dataset.like)

    } else if(e.target.dataset.retweet){

        handleRetweet(e.target.dataset.retweet)

    } else if(e.target.dataset.reply){

        handleReplyClick(e.target.dataset.reply)
       
    } else if(e.target.id === 'tweet-btn') {
        // handleTweetBtn()
        clear()
        

    } else if(e.target.dataset.replyBtn){

        handleReplyTweetBtn(e.target.dataset.replyBtn)

    }
    
    
})

function clear(){
    localStorage.clear()
}

function handleLikeClick(tweetId){
    if (tweetsFromStorage){

        const targetTweetObj = tweetsFromStorage.filter(function(tweet){
            return tweet.uuid === tweetId
        })[0]
    
        if (targetTweetObj.isLiked){
    
            targetTweetObj.likes--   
                 
         } else{
     
             targetTweetObj.likes++    
         }
    
         // FLIPPING BOOLEANS
         targetTweetObj.isLiked = !targetTweetObj.isLiked
         localStorage.setItem('tweetsData', JSON.stringify(tweetsFromStorage))
         render()  

    }
        
}
function handleRetweet(tweetId){
        if (tweetsFromStorage){
            const targetTweetObj = tweetsFromStorage.filter(function(tweet){

                return tweet.uuid === tweetId
    
            })[0]
        
            if (targetTweetObj.isRetweeted){
                targetTweetObj.retweets--
               
            } else{
                targetTweetObj.retweets++
                
            }
            // FLIPPING BOOLEANS
            targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
            localStorage.setItem('tweetsData', JSON.stringify(tweetsFromStorage))
            
            render()

        }
 
}
function handleTweetBtn(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsFromStorage.unshift({
            handle: `@KanyinjiAndrew`,
            profilePic: `images/-y7ig0d.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid:uuidv4()
        })
        
        tweetInput.value = ''
        localStorage.setItem('tweetsData', JSON.stringify(tweetsFromStorage))
        render()
    }
    
}

function handleReplyClick(replyId){
    
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
   
}

function handleReplyTweetBtn(tweetId){
    let replyInput = document.getElementById(`reply-input-${tweetId}`)
    
    const targetTweetObj = tweetsFromStorage.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if(replyInput.value){
        targetTweetObj.replies.unshift({
            handle: `@kanyinjiAndrew`,
            profilePic: `images/-y7ig0d.jpg`,
            tweetText: replyInput.value,
        })
   
    localStorage.setItem('tweetsData', JSON.stringify(tweetsFromStorage))
    replyInput.value = '' 
    render()
    }
}

function getFeedHtml(){
    if (tweetsFromStorage){
        let feedHtml = ''

    tweetsFromStorage.forEach(function(tweet){

    let likeIconClass = ''

    if (tweet.isLiked){

        likeIconClass = 'liked'

    }

    let retweetIconClass = ''
    if (tweet.isRetweeted){

        retweetIconClass = 'retweeted'
    }

    let repliesHtml = ''

    if(tweet.replies.length > 0){

       
        tweet.replies.forEach(function(reply){

            repliesHtml += `
            <div class = "tweet-reply">
                <div class="tweet-inner">
                    <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
            </div>`
        })
    }

    feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class= "handle">${tweet.handle}</p>
                    <p class= "tweet-text">${tweet.tweetText}</p>
                    <div class = "tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>${tweet.retweets}
                        </span>
                    </div>
                </div>
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
                <div class="tweet-reply">
                    <textarea name="replyInput" id="reply-input-${tweet.uuid}" placeholder="Post your reply"></textarea>
                    <button data-reply-btn="${tweet.uuid}">reply</button>
                </div>
            </div>
        </div>`
    
   }) 
        
    return feedHtml

    }  
}
getFeedHtml()

// rendering tweets

function render(){
    
    document.getElementById('feed').innerHTML = getFeedHtml()

}
render()