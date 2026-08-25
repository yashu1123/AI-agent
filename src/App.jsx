import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Sparkles,
  Search,
  Archive,
  Brain,
  Check,
  Cake,
  MapPin,
  ScrollText,
  Flag,
  ArrowUpRight,
  Upload,
  FileText,
  X,
  Globe,
  Trophy,
  Film,
} from "lucide-react";

import "./App.css";

const categories = [
  "India",
  "Karnataka",
  "International",
  "Birthdays",
  "History",
  "Festivals",
  "Sports",
  "Entertainment",
];

const researchSteps = [
  {
    name: "Planning",
    icon: Brain,
    message: "Creating a research strategy...",
  },
  {
    name: "Researching",
    icon: Search,
    message: "Searching historical sources...",
  },
  {
    name: "Analyzing",
    icon: Sparkles,
    message: "Analyzing discovered information...",
  },
  {
    name: "Done",
    icon: Check,
    message: "Intelligence report ready.",
  },
];

const intelligenceCards = [
  {
    category: "BIRTHDAYS",
    key: "birthdays",
    icon: Cake,
    title: "Famous personalities",
    description:
      "Discover notable people born on the selected date.",
    accent: "purple",
    items: [
      "Scientists & innovators",
      "Artists & creators",
      "Leaders & personalities",
    ],
  },
  {
    category: "INDIA",
    key: "india",
    icon: Flag,
    title: "National intelligence",
    description:
      "Important Indian events discovered by the AI agent.",
    accent: "orange",
    items: [
      "Historical events",
      "Political milestones",
      "National developments",
    ],
  },
  {
    category: "ON THIS DAY",
    key: "history",
    icon: ScrollText,
    title: "Historical timeline",
    description:
      "Significant events that happened around the world.",
    accent: "blue",
    items: [
      "World history",
      "Scientific discoveries",
      "Major milestones",
    ],
  },
  {
    category: "KARNATAKA",
    key: "karnataka",
    icon: MapPin,
    title: "Regional intelligence",
    description:
      "Important events and stories from Karnataka.",
    accent: "green",
    items: [
      "Regional events",
      "Important personalities",
      "Local milestones",
    ],
  },
  {
    category: "INTERNATIONAL",
    key: "international",
    icon: Globe,
    title: "Global intelligence",
    description:
      "Important international events and developments.",
    accent: "blue",
    items: [
      "World events",
      "International developments",
      "Global milestones",
    ],
  },
  {
    category: "FESTIVALS",
    key: "festivals",
    icon: Sparkles,
    title: "Festivals & observances",
    description:
      "Festivals, holidays and important observances.",
    accent: "purple",
    items: [
      "Religious festivals",
      "Cultural observances",
      "Public holidays",
    ],
  },
  {
    category: "SPORTS",
    key: "sports",
    icon: Trophy,
    title: "Sports intelligence",
    description:
      "Important sports events connected to the date.",
    accent: "green",
    items: [
      "Major tournaments",
      "Important matches",
      "Sports milestones",
    ],
  },
  {
    category: "ENTERTAINMENT",
    key: "entertainment",
    icon: Film,
    title: "Entertainment",
    description:
      "Important entertainment events and releases.",
    accent: "orange",
    items: [
      "Movies & television",
      "Music",
      "Entertainment milestones",
    ],
  },
];

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

function App() {
  // --------------------------------------------------
  // RESEARCH STATE
  // --------------------------------------------------

  const [activeStep, setActiveStep] = useState(-1);
  const [isResearching, setIsResearching] = useState(false);

  const [selectedDate, setSelectedDate] = useState("2026-08-15");

  const [researchResult, setResearchResult] = useState(null);

  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");
  
  const [openedCard, setOpenedCard] = useState(null);

  // --------------------------------------------------
  // FILE UPLOAD STATE
  // --------------------------------------------------

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // --------------------------------------------------
  // RESEARCH
  // --------------------------------------------------

  const startResearch = async () => {
    if (isResearching) return;

    setIsResearching(true);
    setActiveStep(0);
    setResearchResult(null);
    setError("");

    try {
      // Planning
      setActiveStep(0);

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      // Researching
      setActiveStep(1);

      const response = await fetch(
        "http://localhost:8000/agent/research",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: selectedDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      // Analyzing
      setActiveStep(2);

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      // Save result
      setResearchResult(data);

      // Done
      setActiveStep(3);
    } catch (err) {
      console.error("Research error:", err);

      setError(
        "Unable to connect to the AI agent. Make sure FastAPI is running on port 8000."
      );

      setActiveStep(-1);
    } finally {
      setIsResearching(false);
    }
  };

  // --------------------------------------------------
  // FILE HANDLING
  // --------------------------------------------------

  const handleFiles = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(
      (file) => allowedTypes.includes(file.type)
    );

    setFiles((current) => {
      const existingNames = new Set(
        current.map((file) => file.name)
      );

      const newFiles = validFiles.filter(
        (file) => !existingNames.has(file.name)
      );

      return [...current, ...newFiles];
    });
  };

  const handleFileChange = (event) => {
    handleFiles(event.target.files);

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setIsDragging(false);

    handleFiles(event.dataTransfer.files);
  };

  const removeFile = (fileName) => {
    setFiles((current) =>
      current.filter((file) => file.name !== fileName)
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --------------------------------------------------
  // CATEGORY RESULT
  // --------------------------------------------------

  const getCategoryText = (categoryKey) => {
    if (!researchResult) {
      return null;
    }

    const response =
      researchResult.response || "";

    return response;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="app">
      {/* Ambient background */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={17} />
          </div>

          <div>
            <div className="brand-name">
              NEWSDATE <span>AI</span>
            </div>

            <div className="brand-subtitle">
              AI-powered newsroom intelligence
            </div>
          </div>
        </div>

        <nav className="nav">
          <a href="#research">
            <Search size={15} />
            Research
          </a>

          <a href="#knowledge">
            <Sparkles size={15} />
            Knowledge
          </a>

          <a href="#archive">
            <Archive size={15} />
            Archive
          </a>
        </nav>
      </header>

      <main>
        {/* ================= HERO ================= */}

        <section className="hero" id="research">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            AI NEWSROOM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            WHAT HAPPENED
            <br />
            <span>ON THIS DATE?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Discover the stories behind any date.
          </motion.p>

          {/* Date + research button */}

          <motion.div
            className="research-box"
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ delay: 0.3 }}
          >
            <div className="date-box">
              <CalendarDays size={20} />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
              />
            </div>

            <button
              className="generate-button"
              onClick={startResearch}
              disabled={isResearching}
            >
              <Sparkles size={18} />

              {isResearching
                ? "Researching..."
                : "Generate Intelligence"}
            </button>
          </motion.div>

          {/* Categories */}

          <div className="categories">
            <motion.button
              className={`category ${
                selectedCategory === "All"
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCategory("All")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              All
            </motion.button>

            {categories.map((category) => (
              <motion.button
                key={category}
                className={`category ${
                  selectedCategory === category
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(category)
                }
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <motion.div
            className="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="placeholder-title">
              CONNECTION ERROR
            </div>

            <div className="placeholder-line">
              {error}
            </div>
          </motion.div>
        )}

        {/* ================= RESEARCH STATUS ================= */}

        <section className="research-status">
          <div className="status-header">
            <span>AI RESEARCH STATUS</span>

            {isResearching && (
              <motion.div
                className="live-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span />
                LIVE
              </motion.div>
            )}
          </div>

          <div className="status-track">
            {researchSteps.map((step, index) => {
              const Icon = step.icon;

              const completed =
                activeStep > index;

              const active =
                activeStep === index;

              return (
                <div
                  className="status-step-wrapper"
                  key={step.name}
                >
                  <motion.div
                    className={`status-step ${
                      active ? "active" : ""
                    } ${
                      completed ? "completed" : ""
                    }`}
                    animate={
                      active
                        ? {
                            scale: [1, 1.04, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.2,
                      repeat: active
                        ? Infinity
                        : 0,
                    }}
                  >
                    <div className="status-icon">
                      {completed ? (
                        <Check size={15} />
                      ) : (
                        <Icon size={15} />
                      )}
                    </div>

                    <span>{step.name}</span>
                  </motion.div>

                  {index <
                    researchSteps.length - 1 && (
                    <div
                      className={`status-line ${
                        completed
                          ? "filled"
                          : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {activeStep >= 0 && (
            <motion.div
              className="activity"
              key={activeStep}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <span className="activity-dot" />

              {
                researchSteps[activeStep]
                  .message
              }
            </motion.div>
          )}
        </section>

        {/* ================= INTELLIGENCE ================= */}

        <section className="intelligence-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                INTELLIGENCE REPORT
              </span>

              <h2>
                Stories discovered by the agent
              </h2>
            </div>

            <div className="result-date">
              {selectedDate}
            </div>
          </div>

          {/* Actual backend response */}

          {researchResult && (
            <motion.div
              className="placeholder"
              style={{
                marginBottom: "35px",
              }}
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="placeholder-title">
                AI RESEARCH RESULT
              </div>

              <div
                className="placeholder-line"
                style={{
                  whiteSpace: "pre-wrap",
                  textAlign: "left",
                  display: "block",
                }}
              >
                {researchResult.response}
              </div>
            </motion.div>
          )}

          <div className="intelligence-grid">
            {intelligenceCards
              .filter(
                (card) =>
                  selectedCategory === "All" ||
                  card.category
                    .toLowerCase()
                    .includes(
                      selectedCategory.toLowerCase()
                    )
              )
              .map((card, index) => (
                <IntelligenceCard
                  key={card.category}
                  card={card}
                  index={index}
                  researchResult={researchResult}
                  onOpen={() => setOpenedCard(card)}
                />
              ))}
          </div>
        </section>

        {/* ================= KNOWLEDGE BASE ================= */}

        <section
          className="knowledge-section"
          id="knowledge"
        >
          <div className="knowledge-header">
            <div>
              <span className="section-label">
                KNOWLEDGE BASE
              </span>

              <h2>
                Give the AI more context.
              </h2>

              <p>
                Upload documents to enhance
                research with your own knowledge
                sources.
              </p>
            </div>
          </div>

          {/* Upload zone */}

          <motion.div
            className={`upload-zone ${
              isDragging ? "dragging" : ""
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() =>
              setIsDragging(false)
            }
            onDrop={handleDrop}
            whileHover={{
              scale: 1.005,
            }}
          >
            <div className="upload-icon">
              <Upload size={22} />
            </div>

            <h3>
              {isDragging
                ? "Drop your documents"
                : "Drop documents here"}
            </h3>

            <p>
              Enhance your AI research with
              your own knowledge base.
            </p>

            <label className="upload-button">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />

              <Upload size={14} />

              <span>
                Upload documents
              </span>
            </label>

            <div className="file-types">
              PDF • DOCX • TXT
            </div>
          </motion.div>

          {/* Selected files */}

          {files.length > 0 && (
            <motion.div
              className="file-list"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <div className="file-list-header">
                <span>
                  SELECTED DOCUMENTS
                </span>

                <span>
                  {files.length}{" "}
                  {files.length === 1
                    ? "file"
                    : "files"}
                </span>
              </div>

              {files.map((file) => (
                <motion.div
                  className="file-card"
                  key={file.name}
                  layout
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >
                  <div className="file-info">
                    <div className="file-icon">
                      <FileText size={17} />
                    </div>

                    <div>
                      <div className="file-name">
                        {file.name}
                      </div>

                      <div className="file-size">
                        {formatFileSize(
                          file.size
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    className="remove-file"
                    onClick={() =>
                      removeFile(file.name)
                    }
                  >
                    <X size={15} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {openedCard && (
  <motion.div
    className="result-modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    onClick={() => setOpenedCard(null)}
  >
    <motion.div
      className="result-modal"
      initial={{
        opacity: 0,
        scale: 0.92,
        y: 20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="result-modal-close"
        onClick={() => setOpenedCard(null)}
      >
        <X size={18} />
      </button>

      <div className="result-modal-icon">
        <openedCard.icon size={22} />
      </div>

      <div className="section-label">
        {openedCard.category}
      </div>

      <h2>{openedCard.title}</h2>

      <p className="result-modal-description">
        {openedCard.description}
      </p>

      <div className="result-modal-content">
        <div className="result-modal-label">
          AI RESEARCH RESULT
        </div>

        <div className="result-modal-text">
          {researchResult?.response ||
            "No research result available."}
        </div>
      </div>
    </motion.div>
  </motion.div>
)}
      </main>
    </div>
  );
}

function IntelligenceCard({
  card,
  index,
  researchResult,
  onOpen,
}) {
  const Icon = card.icon;

  const hasResult = Boolean(researchResult);

  return (
    <motion.article
      className={`intelligence-card ${card.accent}`}
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      whileHover={{
        y: -5,
      }}
    >
      <div className="intelligence-top">
        <div className="intelligence-icon">
          <Icon size={19} />
        </div>

        <button
          className="card-arrow-button"
          onClick={onOpen}
          disabled={!hasResult}
        >
          <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="intelligence-category">
        {card.category}
      </div>

      <h3>{card.title}</h3>

      <p>{card.description}</p>

      <div className="card-items">
        {card.items.map((item) => (
          <div
            className="card-item"
            key={item}
          >
            <span />
            {item}
          </div>
        ))}
      </div>

      <button
        className="view-report"
        onClick={onOpen}
        disabled={!hasResult}
      >
        {hasResult
          ? "Research available"
          : "Waiting for research"}

        <ArrowUpRight size={14} />
      </button>
    </motion.article>
  );
}

export default App;