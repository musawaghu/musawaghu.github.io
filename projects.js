// Case-study content for the dialog, keyed by each button's data-project.
// Every fact and number here comes from the project's own README / docs.
// A string renders as a paragraph; an array renders as a bullet list.
window.PROJECTS = {
  "firmflow": {
    number: "01",
    title: "FirmFlow",
    type: "AI web app · Hackathon team project · React, TypeScript, FastAPI, Supabase, Claude API",
    overview: "AI onboarding for architecture firms that never makes things up. FirmFlow takes the onboarding material a firm already has and turns it into clear, interactive onboarding. Built at an AEC hackathon by a team of one architect and four computer science students.",
    problem: "Onboarding at architecture firms is usually a long static manual, an intranet full of broken links, and a lot of questions to busy senior staff. Nothing separates what you need on Day 1 from what can wait, and firm-specific BIM practices, like safely copying a Revit central model, are rarely taught until something breaks.",
    solution: [
      "Manual Enhancer: splits an uploaded PDF or DOCX manual into modules and rewrites for clarity without adding facts. Every passage links back to its source section, and a second grounding check highlights anything the source doesn't support.",
      "Broken links, outdated references and contradictions are flagged for the admin, never silently fixed. Admins approve each module and tag it Day 1, Week 1 or Later.",
      "Final Onboarding Check: 5–7 mostly scenario-based questions drawn only from passages marked critical, with Claude grading free-text answers and linking misses back to the exact section.",
      "“Who do I ask?” assistant: finds people through tool calls against the firm's directory, so names and emails are never generated.",
      "Two content layers: a shared AEC baseline reviewed by a licensed architect plus each firm's own overlay. Where they conflict, the firm wins.",
      "Hardened for a public demo: rate limits, bounded model calls, upload content checks, a strict CSP, prompt-injection handling and tests that pin every route's access level."
    ],
    results: [
      "Shipped a working live demo (frontend on Vercel, backend on Google Cloud Run).",
      "The backend scales to zero, which costs about $0–2 a month at demo traffic.",
      "No user outcomes measured yet. The pilot metrics we'd track next: time for a new hire to finish onboarding, and questions to senior staff in the first month."
    ],
    media: [
      { type: "video", src: "assets/projects/firmflow/promo.mp4", poster: "assets/projects/firmflow/logo.webp", caption: "FirmFlow promo video" }
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/musawaghu/FirmFlow" },
      { label: "Live demo", href: "https://firmflow-iota.vercel.app" }
    ]
  },

  "sihha": {
    number: "02",
    title: "Sihha",
    type: "Clinical NLP + ML · MedGemma, Presidio, scikit-learn, SHAP, React",
    overview: "Clinical NLP middleware that converts discharge summaries and radiology reports into structured, coded records and produces explainable 30-day readmission risk scores, with every fact underlined at the words it came from.",
    problem: "Clinical notes hold facts that coded data misses, but they can't be sent to third-party AI APIs under the data-use terms (n2c2 DUA, HIPAA). The pipeline had to extract and code those facts without the text ever leaving infrastructure I control.",
    solution: [
      "Six-step pipeline: ingest → de-identify the 18 HIPAA identifiers (Presidio plus custom patterns) → extract entities with source spans → map to RxNorm / ICD-10 codes → predict readmission risk → explain it with SHAP.",
      "Two models, never overlapping: MedGemma 1.5 4B reads text, a scikit-learn model reads coded features.",
      "MedGemma runs self-hosted under Ollama on an NVIDIA L4 VM in GCP; a settings flag enforces the no-third-party-API rule in code.",
      "React + Vite dashboard on Vercel, with Supabase auth for a private review view."
    ],
    results: [
      "De-identification: 1.000 span recall across all 18 categories (synthetic data).",
      "Extraction F1 on 200 synthetic notes: medications 0.964 (passes its gate); conditions 0.770, below its 0.85 gate, reported as a known gap.",
      "Readmission AUC 0.671 on held-out patients (UCI Diabetes 130), against a best published baseline of 0.667.",
      "Median 27 s per note on synthetic data."
    ],
    lessons: [
      "The architecture follows from the data terms, not the other way round.",
      "Synthetic recall is partly self-fulfilling, so I rejected a fix that would have let the test data grade itself."
    ],
    media: [
      { type: "video", src: "assets/projects/sihha/launch.mp4", poster: "assets/projects/sihha/launch.webp", caption: "Sihha launch video, recorded from the public site (synthetic data only)" }
    ],
    links: [
      { label: "Live site", href: "https://sihha-sooty.vercel.app" }
    ],
    note: "The repository is private; the public site serves synthetic data only."
  },

  "jobsite-checkin": {
    number: "03",
    title: "Jobsite Check-In",
    type: "Computer vision web app · FastAPI, PyTorch (MTCNN, FaceNet), YOLO11, SQLite, Docker",
    overview: "Face recognition for construction site attendance: a browser kiosk at the gate and a dashboard for the foreman.",
    problem: [
      "Buddy punching: workers clock in for absent coworkers.",
      "Emergency headcount: a sign-in sheet doesn't tell you who forgot to sign out.",
      "Jobsite conditions: gloves, dirt, glare and patchy internet."
    ],
    solution: [
      "The kiosk sends a frame every 400 ms; MTCNN finds the face and FaceNet produces an embedding, matched against 5 stored angles per worker with vectorized cosine similarity.",
      "Match threshold set from LFW at a 0.1% false-accept rate.",
      "Liveness check: a random head-turn challenge using yaw from the face landmarks.",
      "PPE check with YOLO11n fine-tuned on Construction-PPE; it warns but never blocks check-in.",
      "Offline-first: each site runs its own server and syncs to a central one. Face data never leaves the site.",
      "Privacy by design: consent capture, embeddings only (no photos), auto-deletion, hashed PINs and an audit log. 96 pytest tests."
    ],
    results: [
      "LFW 10-fold accuracy 99.43% ± 0.37%; true-accept rate 98.9% at 0.1% false-accept rate.",
      "Scan latency 68 ms on CPU / 45 ms on GPU; full pipeline 14.6 FPS CPU / 22.8 FPS GPU.",
      "Batching made embedding 2.1× (CPU) / 3.4× (GPU) faster; vectorizing made matching ~19× faster.",
      "PPE detector: helmet recall 0.901, vest recall 0.876 on the test split."
    ],
    lessons: [
      "An early 110 ms GPU latency was a benchmark artifact (a fresh thread per request); against a real server it's 45 ms.",
      "A hard hat in both photos raised false accepts about 7×, so: enroll without the hat.",
      "Liveness stops photos, not determined attackers, and the system hasn't been tested with real crews yet."
    ],
    media: [
      { type: "image", src: "assets/projects/jobsite-checkin/kiosk-turn.webp", alt: "Kiosk asking the worker to turn their head for the liveness check" },
      { type: "image", src: "assets/projects/jobsite-checkin/kiosk-ppe.webp", alt: "Kiosk showing a PPE warning during check-in" },
      { type: "image", src: "assets/projects/jobsite-checkin/dashboard-onsite.webp", alt: "Foreman dashboard listing workers currently on site" },
      { type: "image", src: "assets/projects/jobsite-checkin/dashboard-muster.webp", alt: "Emergency muster headcount view" },
      { type: "image", src: "assets/projects/jobsite-checkin/dashboard-hours.webp", alt: "Worked-hours report" },
      { type: "image", src: "assets/projects/jobsite-checkin/dashboard-sites.webp", alt: "Multi-site overview with sync status" }
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/musawaghu/Realtime-Facial-Recognition" }
    ],
    note: "Screenshots use made-up workers with no real face data."
  },

  "brain-tumor": {
    number: "04",
    title: "Brain Tumor Detection",
    type: "Deep learning · PyTorch, ResNet50, Grad-CAM, Gradio, scikit-learn",
    overview: "A transfer-learning classifier (ResNet50, fine-tuned on the PMRAM brain MRI dataset) that tells glioma scans apart from normal scans. A Gradio app shows the prediction, a confidence score, and a Grad-CAM heatmap of the regions that drove the decision.",
    problem: "Screening MRI scans for tumors is slow, specialist work. A model can help, but only if its reported accuracy can be trusted. My first version reported 98% accuracy, measured on the same images used to pick the best model.",
    solution: [
      "No separate test set → added a stratified 70/15/15 split and bootstrap 95% confidence intervals.",
      "Model selection on a noisy metric → select by validation loss instead of validation accuracy, which kept tying on ~115 images.",
      "Duplicate images → the 769 images were only 681 unique scans. I grouped near-duplicates with a perceptual hash plus a pixel check so each scan stays in one split.",
      "Fine-tuned only the last ResNet block and a new head, with augmentation, a learning-rate scheduler and early stopping."
    ],
    results: [
      "Held-out test set (115 images): accuracy 95.7% (95% CI 91.3–99.1%).",
      "ROC-AUC 0.989.",
      "91% of tumors detected (5 of 56 missed), with no false alarms on normal scans."
    ],
    lessons: [
      "Question your own results: the first 98% was inflated by evaluating on the model-selection set and by duplicate scans across splits.",
      "Grad-CAM showed the model sometimes looks at artifacts outside the skull, and most tumor scans are a different MRI sequence from most normals, a possible shortcut. Both are documented as limitations.",
      "Research demo, not a medical device."
    ],
    media: [
      { type: "image", src: "assets/projects/brain-tumor/demo_screenshot.webp", alt: "Gradio app classifying a glioma scan with a Grad-CAM heatmap" },
      { type: "image", src: "assets/projects/brain-tumor/demo_screenshot_normal.webp", alt: "Gradio app classifying a normal scan" },
      { type: "image", src: "assets/projects/brain-tumor/gradcam_examples.webp", alt: "Grid of Grad-CAM heatmap examples" },
      { type: "image", src: "assets/projects/brain-tumor/confusion_matrix.webp", alt: "Confusion matrix on the held-out test set" },
      { type: "image", src: "assets/projects/brain-tumor/training_history.webp", alt: "Training and validation loss and accuracy curves" }
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/musawaghu/Brain-Tumor-Detection-DL" }
    ]
  },

  "parallel-sift": {
    number: "05",
    title: "Parallel SIFT",
    type: "Research / performance engineering · Python 3.14t (no-GIL), NumPy, multiprocessing",
    overview: "My senior undergraduate research project on parallel feature extraction for content-based image retrieval, rebuilt and re-run in 2026: why more threads didn't help, and what did.",
    problem: "The 2023 hypothesis was that splitting an image into 16 tiles with a thread each would extract SIFT features faster than 4 tiles. It came back null: 16 tiles were faster on only 24 of 36 images, by about 1.4%, and neither beat serial code.",
    solution: [
      "Diagnosed the cause: CPython's GIL. Threaded runs kept only 1.0 core busy on an 8-core CPU.",
      "Replaced threads with processes, and added a free-threaded Python 3.14t (no-GIL) arm. OpenCV has no free-threaded wheels, so I reimplemented the calls I needed in NumPy.",
      "Built a fair benchmark: 7 configurations interleaved per image, warmed-up pools, OpenCV threading off, and keypoint output hash-checked against serial.",
      "Dataset: Oxford 102 Flowers, images 1–50."
    ],
    results: [
      "Speedup (geometric mean): processes 3.42× (4 tiles) and 6.65× (16 tiles); no-GIL threads 5.82×; GIL threads only 1.13×.",
      "All 50 images: 59.6 min serial → 8.8 min with processes.",
      "Reproduced the 2023 result: 16-tile keypoint counts match the original slide on 36 of 36 images.",
      "Cost of tiling: 3.1% (4 tiles) to 7.9% (16 tiles) of keypoints lost at tile borders."
    ],
    // Copied from the README section "Processing time: how long keypoint extraction took".
    table: {
      heading: "Processing time",
      intro: "Wall-clock time to extract NMS-SIFT keypoints and descriptors, per image and for all 50 images:",
      columns: ["Version", "Mean per image", "Fastest / slowest image", "All 50 images"],
      rows: [
        ["Serial, whole image", "71.5 s", "42.3 s / 118.1 s", "59.6 min"],
        ["Serial, 4 tiles", "67.9 s", "39.6 s / 107.2 s", "56.6 min"],
        ["Serial, 16 tiles", "62.5 s", "36.1 s / 98.3 s", "52.1 min"],
        ["Threads (GIL), 4 tiles", "68.5 s", "40.2 s / 107.9 s", "57.1 min"],
        ["Threads (GIL), 16 tiles", "63.3 s", "36.7 s / 100.8 s", "52.7 min"],
        { cells: ["Processes, 4 tiles", "20.9 s", "13.1 s / 34.6 s", "17.5 min"], bold: true },
        { cells: ["Processes, 16 tiles", "10.6 s", "7.5 s / 16.2 s", "8.8 min"], bold: true },
        { label: "No-GIL Python 3.14t:", cells: ["serial, whole image", "79.5 s", "47.8 s / 127.9 s", "66.2 min"] },
        { label: "No-GIL Python 3.14t:", cells: ["threads, 4 tiles", "24.1 s", "15.0 s / 39.2 s", "20.1 min"] },
        { label: "No-GIL Python 3.14t:", cells: ["threads, 16 tiles", "13.5 s", "9.2 s / 22.0 s", "11.3 min"] }
      ],
      note: "The regular-Python rows ran on Python 3.14 with the GIL. Images vary in size and texture, which is why the times vary so much from image to image."
    },
    lessons: [
      "It was the GIL, not the idea, that sank the 2023 experiment.",
      "Parallelism multiplies single-core speed: OpenCV's C++ SIFT does the same image in 88 ms, about 600× faster than the pure-Python version.",
      "Rebuilding the original code surfaced real bugs: a result-ordering race, an unpicklable keypoint type, and a crash in the retrieval stage."
    ],
    media: [
      { type: "image", src: "assets/projects/parallel-sift/speedup.webp", alt: "Speedup by configuration: processes vs GIL threads vs no-GIL threads" },
      { type: "image", src: "assets/projects/parallel-sift/cores_used.webp", alt: "CPU cores actually used by each configuration" },
      { type: "image", src: "assets/projects/parallel-sift/time_per_image.webp", alt: "Processing time per image for each configuration" },
      { type: "image", src: "assets/projects/parallel-sift/vs_2023.webp", alt: "Comparison against the original 2023 results" }
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/musawaghu/parallel-sift" }
    ]
  },

  "airbnb": {
    number: "06",
    title: "Airbnb Data Analysis",
    type: "Data analysis · Python (pandas, Plotly), SQLite, Power BI",
    overview: "An analysis of 48,895 New York City Airbnb listings using Python, SQL and Plotly, with a Power BI dashboard on the same database.",
    problem: "What drives price in the 2019 NYC Airbnb market (room type, borough, neighbourhood, reviews), and who actually controls the supply?",
    solution: [
      "Cleaned the Kaggle dataset with pandas (removed 264 listings, 0.5%) and loaded it into SQLite.",
      "Answered the questions in SQL with CTEs and window functions, including medians built from ROW_NUMBER() because SQLite has no median function.",
      "Exported Plotly charts as images and interactive HTML, and built a Power BI dashboard on the same database."
    ],
    results: [
      "Median price by room type: entire home $160, private room $70, shared room $45.",
      "Manhattan and Brooklyn are 85% of the market (medians $149 and $90).",
      "86% of hosts have a single listing, but the other 14% control a third of all listings.",
      "Listings with no reviews have a higher median price ($120) than reviewed ones ($100–$108)."
    ],
    lessons: "Correcting my first conclusion: on the raw data, price vs room type looked weak (Pearson −0.25). After cleaning it was −0.46, and Spearman, the right test for a ranked category, gave −0.68. Extreme values had hidden the effect, and I'd picked the wrong test.",
    media: [
      { type: "image", src: "assets/projects/airbnb/final_dashboard_screenshot_v2.webp", alt: "Power BI dashboard of NYC Airbnb listings" },
      { type: "image", src: "assets/projects/airbnb/price_by_room_type.webp", alt: "Median price by room type" },
      { type: "image", src: "assets/projects/airbnb/price_by_borough.webp", alt: "Median price by borough" },
      { type: "image", src: "assets/projects/airbnb/neighborhood_supply_vs_price.webp", alt: "Neighbourhood listing supply vs median price" },
      { type: "image", src: "assets/projects/airbnb/neighborhood_map.webp", alt: "Map of median price by neighbourhood" },
      { type: "image", src: "assets/projects/airbnb/price_by_reviews.webp", alt: "Median price by review count" }
    ],
    links: [
      { label: "View on GitHub", href: "https://github.com/musawaghu/Airbnb_Data_Analysis" },
      { label: "Interactive chart", href: "https://musawaghu.github.io/Airbnb_Data_Analysis/charts/price_by_room_type.html" }
    ]
  }
};
