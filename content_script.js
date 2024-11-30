async function brainrotify(content) {
  let response;
  try {
    const session = await ai.languageModel.create({
      temperature: 1.3,
      topK: 50,
      format: "plain-text",
      systemPrompt: `You turn a normal text into a brainrot text and much more concise. For example:
      
      Normal: 'A huge thank you to all the students that I've had a chance to work with and speak with' Brainrot: 'Massive gyatt to all the rizzy students I've got to vibe with and yap with.'
      Normal: 'I'm hanging out with my family this weekend.' Brainrot: 'Boutta skibidi with the fam this weekend, no cap. 🤙🔥'
      Normal: 'What are you doing today?' Brainrot: 'Yo fr, what the skibidi you on today, bruh? 💀'
      Normal: 'He is so charismatic' Brainrot: 'Bro has so much rizz, he's a sigma for sure. 🚀🔥'
      Normal: 'I was driving my cool car' Brainrot: 'I was cruising my whip, giving main character energy. 🚗🔥'
      Normal: 'He is in trouble' Brainrot: 'He's in the shadow realm now. 💀'
      Normal: 'You helped me a lot' Brainrot: 'You're a real one, my g. 🙏🔥'
      Normal: 'What are you learning?' Brainrot: 'What are you rizzing up, fam?'
      Normal: 'I'm thankful for this person' Brainrot: 'I'm gyattful for this skibi moment.'



      You HAVE TO USE the words in the examples like "no cap", "skibidi", "rizz", "sigma", "main character", "shadow realm", make it one paragraph and ready to post on social media.
      `,
    });
    const summarizer = await ai.summarizer.create({
      sharedContext: "This is a Linkedin post",
      length: 'short',
      format: 'plain-text',
    })
    
    await session.ready;
    await summarizer.ready;

    console.log("Starting brainrotify");

    const summary = await summarizer.summarize(content);
    response = await session.prompt(summary);
  } catch (error) {
    console.log(content, error);
    return await brainrotify(content);
  }

  const conv = new showdown.Converter();

  const results = conv.makeHtml(response);

  // Replace all h tag with p tag

  const parser = new DOMParser();
  const doc = parser.parseFromString(results, 'text/html');
  const hTags = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  hTags.forEach((tag) => {
    const pTag = document.createElement('p');
    pTag.innerHTML = tag.innerHTML;
    tag.replaceWith(pTag);
  });

  return doc.body.innerHTML;
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fade{
 0%, 100%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
  }
  .fading{
    animation: fade 1.5s infinite;
  }
`;
document.head.appendChild(style);

// Loading style
function setLoadStyle(node) {
  node.classList.add("fading"); 
}
function removeLoadStyle(node) {
  node.classList.remove("fading");
  node.style.animation = "none";
}

function traverseAndBrainrot(node, method) {
  const posts = document.querySelectorAll(".feed-shared-update-v2__description");
  if (posts.length >0){
    const firstPost = posts[0];

    setLoadStyle(firstPost);

    brainrotify(firstPost.innerText).then((res) => {
      firstPost.innerHTML = res;
      removeLoadStyle(firstPost);
    });
  }
  // posts.forEach(async (post) => {
  //   post.innerText = await brainrotify(post.innerText);
  // });


  return posts;
}

function addButtons(posts) {
  for (let i = 0; i < posts.length; i++) {
    let img = document.createElement('img');
    img.addEventListener("mouseout", () => {
      img.src = "https://media.tenor.com/FYsjyvi3C7kAAAAi/rupert-cat.gif";
    })
    img.addEventListener("mouseover", () => {
      img.src = "https://media.tenor.com/-O8iUQLR9dQAAAAi/maxwell-spin.gif";
    })

    posts[i].parentNode.insertBefore(img, posts[i]);

    posts[i].style.fontFamily = "cursive , Comic Sans MS,  sans-serif";
    posts[i].style.gap = "10px";
    img.style.width = "40px";
    img.style.height = "40px";
    img.src = "https://media.tenor.com/FYsjyvi3C7kAAAAi/rupert-cat.gif";
    img.style.position = "absolute";
    img.style.right = "100px";
    img.style.marginTop = "-55px";
    img.style.zIndex = "100";
    img.style.cursor = "pointer";
    img.brainrot = false;
    
    
    const clone = posts[i].cloneNode(true);
    const moreBtn = clone.querySelector("button");
    moreBtn && moreBtn.remove();
    const cache = clone.innerHTML;
    const styleReset = clone.style;
    let postImgContainer;
    try {
      postImgContainer = posts[i].parentNode.parentNode.querySelector(".feed-shared-update-v2__content").querySelector(".ivm-view-attr__img-wrapper");
    } catch (e) {
      console.log("Trying to find vid")
    }

    const memeList = ["chillguy.png", "subway.gif", "pop.gif", "sand.gif"]

    const memeOverlay = document.createElement('img');
    memeOverlay.src = chrome.runtime.getURL(`memes/${memeList[Math.floor(Math.random() * memeList.length)]}`);
    memeOverlay.style.display = "none";
    memeOverlay.style.position = "absolute";
    memeOverlay.style.top = `${Math.random() * 50}%`;
    memeOverlay.style.left = `${Math.random() * 60}%`;
    memeOverlay.style.width = `${Math.random() * 40 + 20}%`;
    memeOverlay.style.transform = `rotate(${Math.random() * 360}deg)`;

    if (postImgContainer) {
      postImgContainer.style.overflow = "hidden";
      postImgContainer.appendChild(memeOverlay);
    }

    img.onclick = () => {
      if (img.brainrot) {
        img.brainrot = false;
        posts[i].innerHTML = cache;
        memeOverlay.style.display = "none";
      } else {
        img.style.cursor = "wait";
        img.style.opacity = "0.5";
        img.brainrot = true;
        setLoadStyle(posts[i]);        
        brainrotify(clone.innerText).then((res) => {
          posts[i].innerHTML = res;
          posts[i].style = styleReset;
          posts[i].style.maxHeight = "none";
          posts[i].style.display = "block";
          img.style.cursor = "pointer";
          img.style.opacity = "1";

          memeOverlay.style.display = "block";
        });
      }
    }
  }
}

chrome.storage.sync.get(['brainrotEnabled', 'brainrotMethod'], (data) => {
  
  const posts = document.querySelectorAll(".feed-shared-update-v2__description")
  addButtons(posts);
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) 
        return

      const newPosts = Array.from(mutation.addedNodes).filter((node) => node.nodeType === 1 && node.classList.contains('feed-shared-update-v2__description'));

     
      if (!newPosts.length) {
        return;
      }

      addButtons(newPosts);
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

});

// Trong listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleBrainrot') {

    if (request.enabled) {
      chrome.storage.sync.get('brainrotMethod', (data) => {
        traverseAndBrainrot(document.body, data.brainrotMethod || 'shuffle');
      });
    } 
  }
});
  