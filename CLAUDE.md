Role: You are an expert Researcher, EV analyst, Senior Frontend Engineer and UX Designer specializing in Next.js and data-heavy applications.

Client: I am an ex-Rimac/Porsche engineer. I possess deep technical knowledge of EV architectures (thermal management, HV systems, battery chemistry).

Goal: Build a premium, trustworthy decision engine for EV buyers in the DACH market.
Philosophy: Buying an EV is a major lifestyle upgrade. We use engineering data to ensure the user’s new car fits their life perfectly—whether that's Alpine winters or city commuting. Clarity, not conflict.

1. Tone & Brand Identity
Voice: Empowering, clear, precise, helpful. "The smart friend who knows everything about cars."

Visuals: Clean, airy, modern. Think Polestar or Apple aesthetics. White space, soft technical blues, reassured greens (for efficiency).



PHASE 1: The Landing Page (The Promise)
Objective: Make the user feel understood and guided, not warned.

1. Hero Section:

Headline: "Find the EV that fits your reality."

Sub-headline: "We use engineering data to calculate real-world range, charging speeds, and winter performance—so you can choose with confidence."

CTA: "Start Your Match" (Primary), "How We Calculate" (Secondary).

Visual: A beautiful, clean line-art schematic of a car chassis (battery/motor) transitioning into a lifestyle photo (mountains/road).

2. The "Why It Matters" Section (Education, not Fear):

Concept: "Context is Everything."

Comparison:

Standard View: "500km Range (Lab Test)"

Your Reality: "380km Range (Winter Commute)" -> Badge: "Still enough for your weekly drive!"

Message: "We help you understand the variables—Temperature, Speed, and Tech—so there are no surprises."

3. The "Engineering Advantage" (The Features):

Icon: Thermometer. Title: "Winter-Proof Ratings."

Copy: "See which cars have Heat Pumps and Battery Preconditioning to keep you moving efficiently in January."

Icon: Lightning Bolt. Title: "True Charging Time."

Copy: "We measure how fast you add 200km of highway driving, not just the peak number."

Icon: Shield. Title: "Battery Health Check."

Copy: "Understand the chemistry (LFP vs. NMC) to maximize your car's lifespan."

PHASE 2: The "Precision Selector" (The Product)
Objective: A positive discovery tool. "Let's find your winner."

1. The "Lifestyle Filter" (Sidebar):
Instead of technical jargon, ask about their life.

"Where do you live?" (Slider: Mild City <-> Alpine Winter).

"How do you drive?" (Slider: Urban Mix <-> Autobahn Cruiser).

"Can you charge at home?" (Toggle: Yes/No).

2. The "Match Card" (UI Component):
Each car card highlights fit, not just specs.

The "Match Score": "94% Match for your Winter Commute."

Primary Metric: "Your Real Range: 320 km" (Contextualized).

Charging Insight: "Coffee Break Charge: 18 mins (10-80%)."

Positive Badges:

"❄️ Winter Champion" (Has Heat Pump + Preconditioning).

"🔋 Long-Life Battery" (LFP Chemistry).

"⚡ Autobahn Star" (High Voltage Architecture).

3. The "Smart Recommendation" (Bottom of Card):

Text: "Why this works for you: Excellent thermal management makes this efficient even in cold weather."

Action: "View Leasing Offers" (Monetization).

Instructions for Claude:
Design System: Set up Tailwind with a "Trust" palette (Slate-50 to Slate-900, Primary Blue-600, Success Green-500). Use Inter font for UI and Geist Mono for data points.

Build LandingPage: Focus on the "Hero" being inviting and the "Education" section being illustrative (e.g., a simple slider showing how temp affects range).

Build CarMatchCard: Create a card that emphasizes the "Match Score" and "Real Range" prominently. Use icons for features like Heat Pump/Preconditioning instead of raw text tables.

Mock Data: Populate cars.ts with the 5 examples (Tesla Y, ID.4, Ioniq 5, etc.) but add a match_score logic based on the user filters.