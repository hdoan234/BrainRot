async function brainrotify(content) {
  let response;
  try {
    const session = await ai.languageModel.create({
      temperature: 1.8,
      topK: 150,
      format: "plain-text",
      systemPrompt: `You turn a normal text into a brainrot text and much more concise. For example:

      Normal: 'I'm hanging out with my family this weekend.' Brainrot: 'Boutta skibidi with the fam this weekend, no cap. 🤙🔥'
      Normal: 'What are you doing today?' Brainrot: 'Yo fr, what the skibidi you on today, bruh? 💀'
      Normal: 'He is so charismatic' Brainrot: 'Bro has so much rizz, he's a sigma for sure. 🚀🔥'
      Normal: 'I was driving my cool car' Brainrot: 'I was cruising my whip, giving main character energy. 🚗🔥'
      Normal: 'He is in trouble' Brainrot: 'He's in the shadow realm now. 💀'
      Normal: 'You helped me a lot' Brainrot: 'You're a real one, my g. 🙏🔥'

      Make sure to use the words in the examples like "no cap", "skibidi", "rizz", "sigma", "main character", "shadow realm".
      `,
    });
    const summarizer = await ai.summarizer.create({
      sharedContext: "This is a Linkedin post",
      length: 'medium',
      format: 'plain-text',
    })
    
    await session.ready;
    await summarizer.ready;

    const summary = await summarizer.summarize(content);
    response = await session.prompt(summary);
  } catch (error) {
    return await brainrotify(content);
  }

  const conv = new showdown.Converter();

  return conv.makeHtml(response);
}

function traverseAndBrainrot(node, method) {
  const posts = document.querySelectorAll(".feed-shared-update-v2__description")
  brainrotify(posts[0].innerText).then((res) => {
    posts[0].innerHTML = res;
  });
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

    img.style.width = "40px";
    img.style.height = "40px";
    img.src = "https://media.tenor.com/FYsjyvi3C7kAAAAi/rupert-cat.gif";
    img.style.position = "absolute";
    img.style.right = "100px";
    img.style.marginTop = "-55px";
    img.style.zIndex = "100";
    img.style.cursor = "pointer";
    img.brainrot = false;
    const cache = posts[i].innerHTML;
    img.onclick = () => {
      if (img.brainrot) {
        img.brainrot = false;
        posts[i].innerHTML = cache;
      } else {
        img.brainrot = true;
        brainrotify(posts[i].innerText).then((res) => {
          posts[i].innerHTML = res;
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

      console.log(newPosts);
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
  