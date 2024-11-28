async function brainrotify(content) {
  let response;
  try {
    const session = await ai.languageModel.create({
      temperature: 1.3,
      topK: 100,
      format: "markdown",
      systemPrompt: `Pretend you’re a chaotic Gen-Z influencer on TikTok, explaining something to your followers in a concise way. Rewrite the following text in exaggerated internet slang, using phrases like 'skibidi,' 'sigma,' 'no cap,' and chaotic energy. Include emojis for effect but don't include text styling like bold or italic or header text. Here are some examples:

      Normal: 'I'm hanging out with my family this weekend.' Brainrot: 'Boutta skibidi with the fam this weekend, no cap. 🤙🔥'
      Normal: 'What are you doing today?' Brainrot: 'Yo fr, what the skibidi you on today, bruh? 💀'`,
    });

    response = await session.prompt(content);
  } catch (error) {
   
    return brainrotify(content);
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

chrome.storage.sync.get(['brainrotEnabled', 'brainrotMethod'], (data) => {
  
  const posts = document.querySelectorAll(".feed-shared-update-v2__description")

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
    // <p>an vo day de brain rot</p>
    // <img src="link" />
  }
  if (data.brainrotEnabled) {
    traverseAndBrainrot(document.body, data.brainrotMethod || 'shuffle');
  }
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
  