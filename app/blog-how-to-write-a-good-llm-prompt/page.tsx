import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to write a good LLM prompt - Arbor",
  description: "A good prompt makes all the difference when interacting with an LLM. In today’s blog, we’ve broken down how prompts work, what ‘good’ really looks like and some prompt templates to get you started. - How do LLMs and prompts work? To understand how to get the best output, it’s useful to know how LLMs…",
};

export default function Page() {
  return (
    <div
      className={"wp-block-group alignfull is-layout-flow wp-block-group-is-layout-flow"}
      dangerouslySetInnerHTML={{ __html: `
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="margin-bottom:var(--wp--preset--spacing--40);padding-top:var(--wp--preset--spacing--50)"><figure style="margin-bottom:var(--wp--preset--spacing--40)" class="wp-block-post-featured-image"><img width="1120" height="850" src="/wp-content/uploads/2025/08/How-to-write-a-good-LLM-prompt.png" class="attachment-post-thumbnail size-post-thumbnail wp-post-image" alt="How to write a good LLM prompt" style="border-radius:0px;object-fit:cover;" srcset="/wp-content/uploads/2025/08/How-to-write-a-good-LLM-prompt.png 1120w, /wp-content/uploads/2025/08/How-to-write-a-good-LLM-prompt-300x228.png 300w, /wp-content/uploads/2025/08/How-to-write-a-good-LLM-prompt-1024x777.png 1024w, /wp-content/uploads/2025/08/How-to-write-a-good-LLM-prompt-768x583.png 768w" sizes="auto, (max-width: 1120px) 100vw, 1120px" /></figure>


<div class="wp-block-group is-vertical is-content-justification-stretch is-layout-flex wp-container-core-group-is-layout-985a34fc wp-block-group-is-layout-flex" style="padding-top:0;padding-bottom:0"><h1 class="wp-block-post-title has-x-large-font-size">How to write a good LLM prompt</h1>

<div class="wp-block-template-part">
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<div class="wp-block-group is-content-justification-left is-layout-flex wp-container-core-group-is-layout-3923442b wp-block-group-is-layout-flex"><div class="wp-block-post-date"><a href="/blog-how-to-write-a-good-llm-prompt/"><time datetime="2025-08-28T10:43:56+00:00">Aug 28, 2025</time></a></div>


<p class="has-contrast-2-color has-text-color wp-block-paragraph">—</p>


<div class="taxonomy-post_tag wp-block-post-terms"><span class="wp-block-post-terms__prefix">in </span><a href="/tag/ai/" rel="tag">AI</a></div></div>
</div>
</div></div>
</div>


<div class="entry-content alignfull wp-block-post-content has-global-padding is-layout-constrained wp-block-post-content-is-layout-constrained">
<p class="wp-block-paragraph">A good prompt makes all the difference when interacting with an LLM. In today’s blog, we’ve broken down how prompts work, what ‘good’ really looks like and some prompt templates to get you started.</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h2 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-210ee2c1861394c4399f06e523fbe9ce">How do LLMs and prompts work?</h2>



<p class="wp-block-paragraph">To understand how to get the best output, it’s useful to know how LLMs work. An LLM (Large Language Model) is a type of AI trained on massive amounts of text to understand and generate human-like language.</p>



<p class="wp-block-paragraph">It breaks text into tokens (small chunks like words or parts of words) and learns patterns between them from billions of examples.&nbsp;</p>



<p class="wp-block-paragraph">When you give an LLM a prompt, it predicts the next token again and again until a full answer is formed. So, the more data and parameters it has, the more nuanced, fluent, and context-aware its responses can be.</p>



<p class="wp-block-paragraph">In short, AI is not a search engine; it’s a pattern matcher trained on huge data. As Arbor’s AI Engineer describes it: “AI is like a super-powerful autocomplete.” It generates <em>likely</em> responses based on how your prompt is framed, based on patterns, not facts or opinions. That means if your prompt is poor, the LLM’s response will also be poor.&nbsp;</p>



<p class="wp-block-paragraph">This also explains why hallucinations happen, as AI wants to answer your questions, so it will find the closest match to what it is you’re asking, even if that isn’t true.&nbsp;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h3 class="wp-block-heading">Three key points to remember</h3>



<ul class="wp-block-list">
<li>Clearer inputs = better outputs</li>



<li>The more specific you can be, the better &#8211; the more ways your prompt can be interpreted, the less likely you will get the answer that you have in your head</li>



<li>Treat prompts like giving a task to an intern. The more context and clarity you give, the better the result</li>
</ul>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h2 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-363d7b6a87ac4cc37107166f3b3d59a4">Anatomy of a good prompt checklist</h2>



<p class="wp-block-paragraph">We’ve put together a checklist of things that your prompt should include, or things you should consider when having a back and forth with an LLM.</p>



<ul class="wp-block-list">
<li>Goal: What do you want? (Summarise, write, explain, compare?)</li>



<li>Context: What background is relevant?</li>



<li>Format: List, paragraph, table, steps?</li>



<li>Constraints: audience, style</li>



<li>Timeframe: data timeframe</li>



<li>Tone (optional): Professional, friendly, concise etc,</li>



<li>Objectivity: Avoid adjectives like “wins/losses, best/worst, effective/ineffective, large/small, high/low, broad/narrow, significant/insignificant, Improved/deteriorated, reliable, simple, intuitive, efficient, robust, etc. The AI does not have context into your baseline. </li>



<li>Avoid leading questions: “Isn’t it better to…” </li>



<li>Always be specific </li>



<li>Speak in whole sentences and explain what you want</li>



<li>Give the instruction up front, then repeat it at the end of the prompt </li>



<li>Be firm. You don&#8217;t need to be polite!</li>
</ul>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h2 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-e01ef4cd774a12be62d75b9b2152f118">What does a good LLM prompt look like in practice?</h2>



<p class="wp-block-paragraph">So you’ve got your building blocks, here’s some ‘before’ and ‘afters’ to help you gauge what a good prompt looks like in reality.&nbsp;</p>



<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td><strong>Original Prompt</strong></td><td><strong>Improved Prompt</strong></td></tr><tr><td>“What’s our AI policy?”</td><td>“Summarise our AI policy in plain language for a new hire who just joined.”</td></tr><tr><td>“Help with interventions”</td><td>“Explain how to create and carry out an interventions strategy for a student who is persistently absent.”</td></tr><tr><td>“How do I do a seating plan?”</td><td>“Outline the key steps in creating a seating plan for a class of 30 children.”&nbsp;</td></tr></tbody></table></figure>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h2 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-ed766f00c756b748b86046832b82d793">LLM prompt templates</h2>



<p class="wp-block-paragraph">Here are some templates to get you started:</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-2095f20f414fbe805630a5d1cfa22597"><strong>1. General information retrieval</strong></h5>



<p class="wp-block-paragraph"><strong>Examples:</strong></p>



<ul class="wp-block-list">
<li>&#8220;Summarise the key points of the Ofsted inspection framework for secondary schools.&#8221;</li>



<li>&#8220;Explain the responsibilities of a school governor in simple terms for new board members.&#8221;</li>



<li>&#8220;What are the main safeguarding obligations for a Designated Safeguarding Lead in the UK?&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;Explain [policy/procedure] in simple terms for [role or audience], based on [official framework or guidance].&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-4c0af7411a57c4e6ceb95e7c576d07bc"><strong>2. Content creation</strong></h5>



<p class="wp-block-paragraph"><strong>Examples</strong>:</p>



<ul class="wp-block-list">
<li>&#8220;Write a parent newsletter summarising upcoming school events for the autumn term.&#8221;</li>



<li>&#8220;Draft a welcome letter for new Year 7 students and their families.&#8221;</li>



<li>&#8220;Create a sample lesson plan on climate change for KS3 geography following the national curriculum.&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;Write a [format] about [topic], using a [tone], for [audience], based on [curriculum/framework].&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-4fc96e000be053167b0a98d00865081b"><strong>3. Summarising &amp; finding trends in data</strong></h5>



<p class="wp-block-paragraph"><strong>Examples</strong>:</p>



<ul class="wp-block-list">
<li>&#8220;Summarise trends from the Year 10 attendance records over the last 3 terms.&#8221;</li>



<li> &#8220;Identify concerning behavioural patterns based on incident logs from this term.&#8221;</li>



<li>&#8220;Summarise the top concerns raised in the parent feedback survey from summer term.&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;Summarise trends in [data/report] from [timeframe], highlighting [insights or anomalies].&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-e9b164da0fa0d931aeec58da347d0f5e"><strong>4. Troubleshooting / guidance</strong></h5>



<p class="wp-block-paragraph"><strong>Examples</strong>:</p>



<ul class="wp-block-list">
<li>&#8220;How do I report a safeguarding concern using CPOMS?&#8221;</li>



<li>&#8220;What should I do if a parent refuses to pick up their child who is unwell?&#8221;</li>



<li>&#8220;How do I escalate a persistent lateness issue under the school&#8217;s attendance policy?&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;What steps should a [role] take to resolve [problem], following [policy/system/tool]?&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-8c21292140205c1805fce157aabc3775"><strong>5. Curriculum &amp; Lesson Support</strong></h5>



<p class="wp-block-paragraph"><strong>Examples</strong>:</p>



<ul class="wp-block-list">
<li>&#8220;Suggest differentiated reading activities for a mixed-ability Year 8 English class.&#8221;</li>



<li> &#8220;How can I adapt a science lesson on ecosystems for a student with ASD?&#8221;</li>



<li> &#8220;Provide three starter activities for a Year 5 maths lesson on fractions.&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;Suggest [number] [activity type] for [subject/topic], tailored for [year group or need].&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-27253dbeab7b5e422c45592fc4aa5caa"><strong>6. Communication and behaviour management</strong></h5>



<p class="wp-block-paragraph"><strong>Examples</strong>:</p>



<ul class="wp-block-list">
<li>&#8220;Write an email to parents about a student’s ongoing behavioural concerns in a respectful tone.&#8221;</li>



<li>&#8220;Draft a behaviour support plan for a pupil at risk of exclusion.&#8221;</li>



<li>&#8220;Provide strategies for de-escalating classroom conflict between two pupils.&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;Draft a [document type] addressing [issue] with a [tone/approach] for [audience].&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h5 class="wp-block-heading has-accent-color has-text-color has-link-color wp-elements-8969d315e0766b6f691f0e6e8b0a16d8"><strong>7. Events and logistics</strong></h5>



<p class="wp-block-paragraph"><strong>Examples</strong>:</p>



<ul class="wp-block-list">
<li>&#8220;Create a checklist for planning a Year 6 residential trip to Wales.&#8221;</li>



<li>&#8220;Outline the key roles and timeline for organising a school open evening.&#8221;</li>



<li>&#8220;Draft a risk assessment for a school trip to the Science Museum.&#8221;</li>
</ul>



<p class="wp-block-paragraph"><strong>Template</strong>: &#8220;Outline a [checklist/plan/timeline] for [event/task], including key responsibilities and deadlines.&#8221;</p>



<p class="has-base-color has-text-color has-link-color wp-elements-56f85f8750360a08e490208d2f70c0eb wp-block-paragraph">&#8211;</p>



<h3 class="wp-block-heading">More resources on AI best practice</h3>



<p class="wp-block-paragraph">Hear from experts in the Arbor community and beyond in our on-demand webinars, reports and on Arbor HQ</p>



<div class="wp-block-group alignfull has-base-2-color has-base-background-color has-text-color has-background has-link-color wp-elements-69370b2f387eb054da5f756e4784e18c has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="padding-top:0px;padding-bottom:54px">
<div class="wp-block-group alignwide is-layout-flow wp-block-group-is-layout-flow" style="border-radius:16px;margin-top:88px;margin-bottom:88px">
<div class="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-a3be6901 wp-block-columns-is-layout-flex" style="margin-top:48px">
<div class="wp-block-column has-base-2-background-color has-background has-global-padding is-layout-constrained wp-container-core-column-is-layout-26a738c0 wp-block-column-is-layout-constrained" style="border-radius:12px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px;box-shadow:var(--wp--preset--shadow--deep)">
<div class="wp-block-group is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-1af4f3bb wp-block-group-is-layout-flex" style="min-height:100%">
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<figure class="wp-block-image size-full"><img width="1398" height="992" src="/wp-content/uploads/2025/03/Ad-hoc-1.jpg" alt="" class="wp-image-16990" srcset="/wp-content/uploads/2025/03/Ad-hoc-1.jpg 1398w, /wp-content/uploads/2025/03/Ad-hoc-1-300x213.jpg 300w, /wp-content/uploads/2025/03/Ad-hoc-1-1024x727.jpg 1024w, /wp-content/uploads/2025/03/Ad-hoc-1-768x545.jpg 768w, /wp-content/uploads/2025/03/Ad-hoc-1-1200x852.jpg 1200w" sizes="auto, (max-width: 1398px) 100vw, 1398px" /></figure>



<div class="wp-block-group is-vertical is-content-justification-stretch is-layout-flex wp-container-core-group-is-layout-f2cd1e68 wp-block-group-is-layout-flex" style="padding-bottom:5px">
<h4 class="wp-block-heading has-text-align-center">Join the Big AI Summit, our free AI webinar series</h4>



<p class="has-text-align-center has-accent-color has-text-color has-link-color wp-elements-8de3014fd4a136201eb6a6c37c4aa770 wp-block-paragraph" style="font-size:14px"><a href="https://www.bigmarker.com/series/the-big-ai-summit/series_summit" target="_blank" rel="noreferrer noopener">Watch on demand here</a></p>
</div>
</div>
</div>
</div>



<div class="wp-block-column has-base-2-background-color has-background has-global-padding is-layout-constrained wp-container-core-column-is-layout-26a738c0 wp-block-column-is-layout-constrained" style="border-radius:12px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px;box-shadow:var(--wp--preset--shadow--deep)">
<div class="wp-block-group is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-1af4f3bb wp-block-group-is-layout-flex" style="min-height:100%">
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<figure class="wp-block-image size-full"><img width="2237" height="1587" src="/wp-content/uploads/2025/03/2.jpg" alt="" class="wp-image-16957" srcset="/wp-content/uploads/2025/03/2.jpg 2237w, /wp-content/uploads/2025/03/2-300x213.jpg 300w, /wp-content/uploads/2025/03/2-1024x726.jpg 1024w, /wp-content/uploads/2025/03/2-768x545.jpg 768w, /wp-content/uploads/2025/03/2-1536x1090.jpg 1536w, /wp-content/uploads/2025/03/2-2048x1453.jpg 2048w, /wp-content/uploads/2025/03/2-1200x851.jpg 1200w" sizes="auto, (max-width: 2237px) 100vw, 2237px" /></figure>



<div class="wp-block-group is-vertical is-content-justification-stretch is-layout-flex wp-container-core-group-is-layout-f2cd1e68 wp-block-group-is-layout-flex" style="padding-bottom:5px">
<h4 class="wp-block-heading has-text-align-center">Hear from school and trust leaders in our AI report</h4>



<p class="has-text-align-center has-accent-color has-text-color has-link-color wp-elements-e4598503eef98cef94ee4cdce9700dd8 wp-block-paragraph" style="font-size:14px"><a href="https://share.hsforms.com/23iYAEyTWTACuiokmhAo2Vg51nmh">Download your free copy</a></p>
</div>
</div>
</div>
</div>



<div class="wp-block-column has-base-2-background-color has-background has-global-padding is-layout-constrained wp-container-core-column-is-layout-26a738c0 wp-block-column-is-layout-constrained" style="border-radius:12px;padding-top:24px;padding-right:24px;padding-bottom:24px;padding-left:24px;box-shadow:var(--wp--preset--shadow--deep)">
<div class="wp-block-group is-vertical is-content-justification-center is-layout-flex wp-container-core-group-is-layout-1af4f3bb wp-block-group-is-layout-flex" style="min-height:100%">
<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<figure class="wp-block-image size-full"><img width="1398" height="992" src="/wp-content/uploads/2025/03/Ad-hoc.jpg" alt="" class="wp-image-16989" srcset="/wp-content/uploads/2025/03/Ad-hoc.jpg 1398w, /wp-content/uploads/2025/03/Ad-hoc-300x213.jpg 300w, /wp-content/uploads/2025/03/Ad-hoc-1024x727.jpg 1024w, /wp-content/uploads/2025/03/Ad-hoc-768x545.jpg 768w, /wp-content/uploads/2025/03/Ad-hoc-1200x852.jpg 1200w" sizes="auto, (max-width: 1398px) 100vw, 1398px" /></figure>



<div class="wp-block-group is-vertical is-content-justification-stretch is-layout-flex wp-container-core-group-is-layout-f2cd1e68 wp-block-group-is-layout-flex" style="padding-bottom:5px">
<h4 class="wp-block-heading has-text-align-center">Share ideas on Arbor HQ</h4>



<p class="has-text-align-center has-accent-color has-text-color has-link-color wp-elements-952b9f8bef7afcfc38931ba0024c0451 wp-block-paragraph" style="font-size:14px"><a href="https://arbor-hq.circle.so/home" target="_blank" rel="noreferrer noopener">Visit Arbor HQ</a></p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div class='rp4wp-related-posts'>
<h3>You might also like:</h3>
<ul>
<li><div class='rp4wp-related-post-image'>
<a href='/blog-the-year-of-ai-in-numbers/'><img width="300" height="300" src="/wp-content/uploads/2025/08/AI-in-schools-1-300x300.png" class="attachment-thumbnail size-thumbnail wp-post-image" alt="AI in schools" srcset="/wp-content/uploads/2025/08/AI-in-schools-1-300x300.png 300w, /wp-content/uploads/2025/08/AI-in-schools-1-800x800.png?crop=1 800w, /wp-content/uploads/2025/08/AI-in-schools-1-600x600.png?crop=1 600w, /wp-content/uploads/2025/08/AI-in-schools-1-400x400.png?crop=1 400w, /wp-content/uploads/2025/08/AI-in-schools-1-200x200.png?crop=1 200w" sizes="(max-width: 300px) 100vw, 300px" /></a></div>
<div class='rp4wp-related-post-content'>
<a href='/blog-the-year-of-ai-in-numbers/'>The year of AI in numbers</a></div>
</li>
<li><div class='rp4wp-related-post-image'>
<a href='/blog-whats-next-for-arbor-and-ai/'><img width="300" height="300" src="/wp-content/uploads/2025/03/Blog-image-1-1-300x300.png" class="attachment-thumbnail size-thumbnail wp-post-image" alt="Arbor AI blog" srcset="/wp-content/uploads/2025/03/Blog-image-1-1-300x300.png 300w, /wp-content/uploads/2025/03/Blog-image-1-1-400x400.png?crop=1 400w, /wp-content/uploads/2025/03/Blog-image-1-1-200x200.png?crop=1 200w" sizes="(max-width: 300px) 100vw, 300px" /></a></div>
<div class='rp4wp-related-post-content'>
<a href='/blog-whats-next-for-arbor-and-ai/'>What&#8217;s next for Arbor and AI?</a></div>
</li>
<li><div class='rp4wp-related-post-image'>
<a href='/blog-effective-school-improvement-plan/'><img width="300" height="244" src="/wp-content/uploads/2020/06/school-improvement-2.jpg" class="attachment-thumbnail size-thumbnail wp-post-image" alt="school-improvement" /></a></div>
<div class='rp4wp-related-post-content'>
<a href='/blog-effective-school-improvement-plan/'>How to write an effective school development plan</a></div>
</li>
</ul>
</div></div>


<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained" style="margin-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--50)"><div class="taxonomy-post_tag is-style-pill wp-block-post-terms"><a href="/tag/ai/" rel="tag">AI</a></div>


<div class="wp-block-group has-global-padding is-layout-constrained wp-block-group-is-layout-constrained">
<div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>



<hr class="wp-block-separator has-text-color has-contrast-3-color has-alpha-channel-opacity has-contrast-3-background-color has-background is-style-wide is-style-wide--3" style="margin-bottom:var(--wp--preset--spacing--40)"/>





<nav aria-label="Posts" class="wp-block-group is-content-justification-space-between is-nowrap is-layout-flex wp-container-core-group-is-layout-ff41d29d wp-block-group-is-layout-flex" style="padding-top:var(--wp--preset--spacing--40);padding-bottom:var(--wp--preset--spacing--40)"><div class="post-navigation-link-previous wp-block-post-navigation-link"><span class="wp-block-post-navigation-link__arrow-previous is-arrow-arrow" aria-hidden="true">←</span><a href="/blog-the-data-drop-five-key-insights-from-gcse-results-day-2025/" rel="prev"><span class="post-navigation-link__label">Previous: </span> <span class="post-navigation-link__title">The Data Drop: Five key insights from GCSE Results Day 2025</span></a></div>

<div class="post-navigation-link-next wp-block-post-navigation-link"><a href="/blog-four-education-school-leaders-drive-operational-excellence-with-ai/" rel="next"><span class="post-navigation-link__label">Next: </span> <span class="post-navigation-link__title">How four education leaders are building operational excellence with AI</span></a><span class="wp-block-post-navigation-link__arrow-next is-arrow-arrow" aria-hidden="true">→</span></div></nav>
</div>
</div>
` }}
    />
  );
}
