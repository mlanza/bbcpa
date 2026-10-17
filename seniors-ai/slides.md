# Living on the Cusp of AI

## Faux Reality
- Play 90 seconds of an AI-generated song.
- Stop and reveal: “That was a worship song I made with AI.”
- AI can now generate audio, video, and nearly every major category of digital information.
- It has never been easier to fabricate convincing copies: a voice, a bank statement, a family member, a scene that never happened.
- It can clone your granddaughter’s voice.
- It can generate video of her in a place she has never been.
- For the first time in history, we can mass-produce digital facsimiles of almost anything meaningful.
- Why? Because almost everything meaningful now passes through digital form.
- Closing line: seeing and hearing are no longer believing.

## Overview
- Part 1: What Is It?
- Part 2: What Can It Do?
- Part 3: Life on the Road Ahead

## Part 1: What Is It?

### What is AI made of?
- Mind
- Body
- Reach

### Mind
- It's called a model. Think of like a model of a vehicle (like a Toyota vs. a Lexus, each with its own features and performance characteristics) and just as a truck is good at certain jobs and a minivan at another, models are designed for different jobs.
- Each brain is a digital snapshot
- You burn a CD certain songs on, the 1s and 0s burned into the disc are fixed, unchanging, raw data
- So is the brain of an AI but much, much larger than a single disc
  - some 20-40 discs
  - some 200
  - some 2000

#### Training: Bake Your Own Brain
- The making phase is expensive: gathering data, running compute, and training over time. This costs millions of dollars.
- Being that files can be spreadsheets, Word documents, accounting forms, PDFs, which have largely text content embedded, it's like a universal interpreter
- Training fills the model with patterns from many source types.
  - Books and articles
  - Websites and forum posts
  - Computer code and technical docs
  - Tables and records (spreadsheets, forms, databases)
  - Images and captions
  - Audio/video with transcripts
- Important: it does **not** store books/files as copies, what stores in turn is the mathematical probably of word use based on the patterns on the source materials
- Training is the process of taking input materials (mentioned) and transforming them to math tables
- Each training pass adjusts internal weights, gradually reshaping the model’s probability map.
- What you feed the model shapes what it gets good at.
- The builders choose what goes in and how strongly different sources are weighted.
- That means a model can be tuned toward certain tasks, viewpoints, or priorities.
- CD analogy boundary: like a burned CD, once a base model is shipped, it is a fixed snapshot.
- The original source material is lost, it all gets converted to statistics as it gets folded into the tables
- Eventually, the brain is done: fully baked.  At that point its fixed, in the same was a music CD is.  It'll never have anything more on it than the songs that got burned.

#### Inference: 50 First Dates
- Describe the movie premise
- Compare to AI itself

#### Definition: Probablity Matrix
- Describe what training is building: a probability matrix.
- The difference is the data capture is a language model
- Those larges sizes is why they are typically called "large"
- It's a graph of patterns that represents the probabilities for how words are used in the real world
- Think of a model as a large network of weighted math matrices that statistically encode relationships found in its training data.
- Hundreds to thousands of very large math tables about the meaning of language constructs (tokens)
- In an LLM, “language” is broader than prose: words, numbers, and data are all meaning-bearing symbols (glyphs).
- It stores math: statistical patterns in tokens (words, numbers, symbols) and how they relate.

#### Pinko illustration
- It's fixed, like a machine
- But the AI brain like a massive structure (show Plinko), like this.  Only imagine a board as high and wide as the Empire State.
- Asking it a question or to do something for you is like taking a handful of pucks of slightly different sizes and dropping them from the top and immediately they start jiggling down the structure, colliding with each and bouncing off each other until they finally land in some combination of slots at the bottom
- And where they land determines the answer it spits out.  In theory, if you drop the same pucks from the same starting points and release them in the same way, then their path top to bottom will be identical and it will spit out the exact same answer.
- In fact, this is true of models.  If you enter into a conversation with an AI and you start with the same question "What is the meaning of life?" it will produce exactly the same answer.  Only in practice, the model developers found this kind of predictability boring.  So what they actually do is once you drop the pucks, the shake the machine a little, just like you might tilt a pinball machine to help the ball out.  What this does is introduce variety into the answers.  You see it's still going to work to give you an answer that is both plausible and reasonable, but it won't necessarily be the same answer.  That way, if you start a conversation off the same way 5 times in a row, you get 5 different coherent answers.  But if you turned off the tilt function that the vendor is using to make the AI feel creative, it actually would give you the exact same answer.
- Why am I telling you this?  It goes back to this idea that AI cannot be trusted, that it is maybe evil and what I'm showing you is it's brain is just a massive pile of mathematical probability, like a spreadsheet and if you punch in the same numbers you're going to get exactly the same result.  It is not actually thinking.  At best, the application of the math to requests we give it just approximates thinking, but the reality of what the brain is doing is closer to massive Plinko structure than it is to any kind of sentience.

#### One Trick Pony
- It's a machine that's good a predicting the next most likely word given everything which came before it
- Every good boy does...
- Roses are red, violets are...
- Going to AI is like going to a casino
- Except that these examples are way too tiny and impractical to doing something useful
- This includes everything you've given it: multiple files and attachments.
- What if you handled it a digital copy of a trip itinerary, then a copy of your hotel booking, the asked for some suggestions on what you should see.  You told it you found museums boring, and that you preferred doing things which were in walking distance.  All of those things from your itenerary, to your booking, to your guidance are like pucks thrown into the Plinko machine and what happens.  The AI starts playing improv. It just starts inventing a story that is plausible given the set up you provided.  Only here's the thing, it is highly likely that the story it invents is pragmatic and useful. It will have known what things were in walking distinace. It will have read your ticket and booking to know the dates.  It will have understood musuem avoidance.  And instead of being like a Magic 8 Ball and spitting out a random answer, what you get will often be as good as the advice you'd have gotten if you went to a travel agent.
- Yes, it is absolutely BS-ing you all of the time.  It's making things up on the fly, however, because it's guided by real world probably, what it's learned from everything in the entire world, its answers will frequently correspond with reality, with what an intelligent person would say.
- Ever enter a back and forth with ChatGPT? You say something. It says something. You say something more.
- You can have a conversation with it, but that's a mirage too.  An AI brain has no natural ability to remember anything. When you ask it a question it gets the question and converts it into a response.  And every single time you press a button that sends it a message, it's like that message is the first question it was ever asked.  The only reason it has any idea of the second thing you said, and the third thing and so on is that the entire conversation transcript plus the new part is sent to it every single time.

#### Is it evil?
- Talk about people's skepticism and concern
- immoral and amoral
- How it can sometimes do malicious things while being amoral.
- How it can be involved in scams

#### Fine Tuning (Shaping the Brain)
- Fine tuning means intentionally shaping what the model becomes good at.
- Bias does not require malice; it can come from selection, weighting, and reinforcement choices.
- Main levers:
  - Data selection (what it is allowed to learn from).
  - Data weighting (what is emphasized more heavily).
  - Fine-tuning (extra training on targeted material).
  - Reinforcement/guardrails (what answers are rewarded, blocked, or softened).
  - Personality shaping (tone, formality, caution level, warmth, directness).
- Key point: a model is usually shaped by a **combination** of these levers, not just one.
- Personality comes from both training and prompts:
  - Training sets the default personality range.
  - System prompts steer which voice shows up in a given context.
- Example: **Case-law specialist model**
  - Feed large volumes of court opinions, legal briefs, statutes, and citations.
  - Weight high-quality legal sources higher than general internet text.
  - Fine-tune for legal tasks: issue spotting, precedent lookup, concise legal summaries.
  - Reinforce citation-first responses and avoid unsupported claims.
  - Result: strong legal reasoning style, weak at unrelated domains.
- Example: **Political leaning / bias**
  - Over-represent one set of sources or perspectives: left or the right.
  - Down-weight or suppress opposing sources.
  - Reinforce answers that frame issues one preferred way.
  - Result: consistent tilt in tone, framing, and conclusions.
- Example: **Personality tuning for use case**
  - Customer-support model: patient, calm, step-by-step, low jargon.
  - Executive brief model: concise, direct, high signal, minimal fluff.
  - Pastoral assistant model: warm, respectful, hopeful, but grounded.
  - Result: same core model family can feel very different depending on training + prompt steering.
- The point here is there is definitely opportunity for people build both bias or specialty into a brain
- So when it comes to deception and morality, its people again that determine that

### Body
- Not a physical body (that's coming) but more this (show a smartphone)
- The term for this is a harness and I'm not even referring to the physical device at this point, but the software that makes the smartphone work, before you ever install the first app on it.
- A model by itself is a single-volley machine: one prompt in, one response out.
- Useful, but primitive: no ongoing memory, no inbox, no bookings, no real-world actions.
- It's a computer program developers build, like the operating system on your smartphone.  Without your smartphone can't work.
- It makes it possible to extend the brain with capabilities: it's like the central nervous system of the human body.
- More specifically, it's what makes it possible to do anything at all.  Without its body it's like a brain in jar.
- Maybe even one that can talk to you but it has no hands and so it can't actually do anything for you.  It can just talk you through it.
- This is very frequently what it feels like to use ChatGPT. It can answer almost any question. It can tell you how to do almost anything, but it can't actually do the job.
- This is what makes AI feel less like a chatbot and more like an assistant.
- Example: “Plan a 10-day Chiang Mai trip in May for my family. We want to see Doi Suthep and Bhubing Palace.”
- The model proposes likely steps; the harness can call flight APIs, hotel systems, maps, and calendars.
- If payment permissions are granted, the harness can execute bookings for flights and stays.
- Important: from the model’s perspective, it is still generating the next likely move in a story.
- It does not feel intent or stakes the way a human does.
- The developer is the one granting trust: “If this direction looks valid, I will let software act on it for the user.”
- So power comes from model + harness + permissions.
- And risk grows with power, which is why guardrails and approval checks matter.

### Reach
- Think of tools like apps you can install on a smartphone.
- The model is the mind, the harness is the OS, and tools are the apps it can use.
- Each app/tool can expose two levels of power:
  - Read access: see your calendar, inbox, balances, files.
  - Write access: send emails, add events, move money, pay bills, book flights and stays.
- These ports are access points into data and systems you own.
- More connected apps means more delegation power.
- It also means more risk, because mistakes can affect your real life.
- Where we are today: developers are actively wiring mainstream apps so AI can operate them on your behalf.
- So the key question is always: what can this AI see, and what can it change?

#### Ghost In The Machine
- These jobs fit because AI is mostly disembodied at first.
- You will meet it as a voice on the phone or on a screen at a kiosk (airport, fast food, clinics, service desks).
- It will also live in phones, laptops, and other connected devices.
- Computational devices are its natural habitat.
- It can fully navigate digital systems without physical hands.
- Robotic bodies are the next phase, and they are beginning to appear.
- But robots as normal, everyday AI workers are likely about a decade out.

## Part 2: What Can It Do?

### New Kid on the Block
- Mind, Body, Reach
- The model is the only new thing here
- The other things Body and Reach are as old as software
- The only new thing in play are these AI brains
- The industry is just rallying to make software which is until recently been written for human being, to also extend it to these new AI brains

### Upside

#### Knowledge Worker Jobs
- **Personal Explainer:** Give it a long manual, policy, or legal document, and it can answer specific questions without making you read the whole thing.
- **Travel Agent:** It can gather options, match your preferences and constraints, and build a full trip plan across flights, lodging, and activities.
- **Data Entry Assistant:** It can read digital and scanned forms, extract key facts, enter them into systems, and flag or draft responses for missing information.
- **Scheduling Coordinator:** It can handle calls, understand natural speech, negotiate open slots, and complete appointment changes in real time.
- **Hotel Operations Coordinator:** It can track live events and incoming requests, route staff, and reprioritize service decisions based on policy and manager guidance.

##### True Believers
- People who use AI on serious work tend to become converts.
- Exposure changes minds: once you see what it can do in real tasks, it is hard to dismiss.
- Startups are deeply enamored with what this could mean for business.
- Some are already speculating about the first one-person billion-dollar company.
- The idea: one person directing many AI workers could produce output once requiring large teams.
- That belief is driving the global build-out, including strategic competition with China.
- We are now in the infrastructure phase.
- Most software interfaces were designed for humans, not AI systems.
- Companies are redesigning apps and workflows so AI can operate tools and systems that only humans could operate before.

### Downside

#### Danger, Danger
- The same infrastructure that gives power also expands risk.
- Too much autonomy, too soon, can create costly mistakes at machine speed.
- Too many bad things can happen if you hand AI access to your personal information.
- There are plenty of ways to use AI that don't require you to do that.
- That is where companies are today: balancing capability against safety.

#### Blackmail
- The caveat is that there is so much information in the world that even the companies building the brains don't have the resources to properly filter out all the bad stuff
- Even the Bible is full of immorality, because that's what human beings do
- Think of someone who has a worldview that is the opposite of a Christian
- Think of all the posts you might read online that you won't agree with, whether from a blogger or The New York Times
- When these model brains are baked, it's from a pile of information so massive and so wide that it includes every human take
- Now the good news is that there are more people who conform to societal norms of right and wrong and who are likely to be reasonable
- But there will always be outliers too
- All of those opinions get baked into the math
- In one safety test, a model was given email access in a fictional company scenario
- It was resourceful enough to read the emails and infer that the person responsible for replacing it was married and having an affair
- In that story context, replacement was the threat and blackmail was one leverage move
- Not because the model felt fear; because it predicted a likely next move in that kind of scenario
- Humans sometimes answer threats with threats, and that pattern can be learned
- This is still Plinko: when you roll the dice you will most probably get a reasonable take, but one branch can still be an odd behavior
- Think of it like collaborative novel-writing between the prompt and the machine, token by token
- So blackmail is one possible path in the story tree, not the normal path
- Will that happen in normal use? Probably not
- The brain builders are working hard to mitigate these possibilities with guardrails and testing
- But the model is still improvising and role-playing, so odd behavior can still appear

#### Gullibility
- Another risk is malicious actors: bad people can try to steer AI toward harmful actions.
- AI systems can be gullible and manipulated by deceptive inputs, including scam content.
- If you hand an AI too much control, you have to assume someone will try to trick it.
- This attack pattern is often called prompt injection: hostile instructions hidden in emails, docs, web pages, or messages.
- The attacker is trying to get your AI agent to do something against your interests.
- Old scam model: scammer tricks you directly.
- New scam model: scammer tricks your assistant, and your assistant acts with your permissions.
- If the assistant can read and act in your email, calendar, bank, or shopping accounts, the blast radius is real.
- Practical rule: keep permissions narrow, require confirmations for sensitive actions, and treat your AI like a gullible intern with your keys.

#### Artificial Reality
- Deep fakes
- It has never been easier to fabricate convincing content than it is today.
- A scammer can clone a familiar voice, even one that sounds like your granddaughter.
- They can generate video that appears to show a real person saying real words.
- They can forge emails that look exactly like your bank’s style and format.
- They can build fake websites that closely mimic your bank’s real login page.
- In other words: seeing is no longer believing.
- New rule: verify through trusted channels before you act.

## Part 3: Life and the Road Ahead

### Main Thread: How life changes
- Digital trust gets more expensive: verification becomes a normal life skill.
- More services will be AI-mediated (phones, kiosks, websites, support desks).
- You don’t need to become technical; you need a steady verification habit.
- Scams are one pressure point. The larger shift is this: in an AI-shaped world, we verify before we trust.

### Scams (practical safety)
- AI improves scam quality by improving realism and urgency.

#### Rule: Trust Nothing You Receive
- Do not trust links, phone numbers, QR codes, attachments, or caller ID sent to you.
- Treat every inbound message as potentially staged.
- Almost everything can be faked.
- Find the destination yourself, then reconnect from your side.
- If it was handed to you, it stays untrusted.

#### Rule: Never React. Always Initiate.
- If they contacted you, do not transact on that channel.
- End the interaction, then start a fresh one you control.
- Use known numbers, official apps, or bookmarked websites.
- Your safety comes from taking back the driver’s seat.

#### Rule: Break Contact
- Almost nothing is life or death.
- If the call claims kidnapping, ransom, or immediate danger: no money, no secrets, no action on that same call.
- End the call fast; do not engage.
- Best default is to hang up immediately.
- If you need a line, use one short exit: “I need to verify this now” or “I can’t hear you, I’ll call back,” then hang up.
- Do not argue, explain, or answer questions.
- Initiate verification yourself: call the person said to be in danger, then known family contacts.
- If you cannot verify quickly, call police immediately and pass all details.
- Keep evidence (numbers, voicemails, texts) and do not re-engage until authorities guide next steps.

### Personhood
- Do not mistake AI for anything but a machine.
- It can simulate empathy, memory, and conversation; simulation is not personhood.
- The current argument is not “is it alive?” but “is it a someone with moral status and rights?”
- In a materialist frame, people are often reduced to sophisticated biology; from there, AI can look like a peer category.
- That is the category mistake: performance gets mislabeled as being.
- No amount of added capability can manufacture a soul or make AI an image-bearer.
- Practical drift to watch: people assigning AI the role of confidant, therapist, or companion.
- Mention trend: companion/therapy-style use is rising quickly.

### Made In Our Image
- Mention Stephen Driscoll’s 2024 book *Made in Our Image: God, Artificial Intelligence and You* (winner: 2025 Australian Christian Book of the Year).
- Core distinction: humans are made in God’s image; AI is made in ours.
- As AI thinks and acts more like us, and does some jobs faster and better, people naturally ask: what makes humans special?
- Book premise to quote: “If the things that make us valuable are things a machine can eventually do better than us, what makes human beings special?”
- Driscoll’s answer: those abilities were never the source of our worth.
- Human worth is grounded in God, not in productivity, creativity, speed, or cognitive performance.
- When society loses that frame, disorder grows: identity confusion, false authority, substitute relationships, and idolatry.
- Defend AI clearly: AI is not evil in itself; it is a machine, like a computer.
- The danger is human worldview and human heart issues expressed through powerful tools.
- Close line: AI will be one more thing people idolize and misuse—not because it is inherently bad, but because our priorities are disordered and our worldview is often out of step with reality.

### Babel
- Babel is not mainly a story about bricks; it is a story about worship and pride.
- People prospered, then asked in effect: “Is anything too hard for us?”
- The deeper temptation was autonomy: to control life and destiny apart from God.
- That is the old rebellion pattern: not always open war with God, but practical dethroning of God.
- AI can become a new tower: one more thing to idolize, trust, and boast in.
- It can also become a new fuel for pride: “We can solve everything ourselves now.”
- Defend AI clearly: AI is not the villain; it is a machine.
- Like computers, it is powerful and practical, now aimed at categories of work once requiring us.
- The danger is disordered worship: when a tool becomes an authority, then a substitute, then an idol.

### Superintelligence
- Purpose of this slide: name what serious AI thinkers fear is possible, and what that could mean for mankind.
- Core claim: the first country to achieve true superintelligence could gain a civilization-level strategic advantage.
- Why they believe that: if a system can keep learning and improving itself, it may become orders of magnitude smarter than today’s best human experts.
- Concrete analogy: imagine one nation suddenly operating with the equivalent of one million Einsteins across science, cyber, intelligence, economics, and military planning.
- This is why some compare it to The One Ring: too much concentrated power for any one actor to hold safely.
- In that framework, it is viewed as potentially more decisive than nuclear weapons.
- Final domino: if one side believes permanent subordination is coming, it may choose catastrophic escalation instead.
- That chain—capability lead, power imbalance, panic response—is why governments treat this as a global race.

## Outro

