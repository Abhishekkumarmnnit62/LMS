import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import aiService from "../../services/aiServices";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";

const AIActions = () => {
  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
      toast.error("Please enter a concept to explain.");
      return;
    }

    setLoadingAction("explain");
    try {
      const { explanation } = await aiService.explainConcept(documentId, concept);
      setModalTitle(`Explanation of "${concept}"`);
      setModalContent(explanation);
      setIsModalOpen(true);
      setConcept("");
    } catch (error) {
      toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="w-full bg-white font-sans p-2">
      {/* Top Header Section */}
      <div className="flex items-center gap-3 mb-8 pl-1">
        <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#00b074] to-[#059669] text-white rounded-xl shadow-sm">
          <Sparkles size={20} className="fill-white/20" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-950 leading-tight">AI Assistant</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Powered by advanced AI</p>
        </div>
      </div>

      {/* Main Containers Layout */}
      <div className="space-y-6">
        
        {/* 1. Generate Summary Action Box */}
        <div className="border border-neutral-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 flex items-center justify-center bg-[#e6f4fe] text-[#2563eb] rounded-lg">
                <BookOpen size={15} />
              </div>
              <h4 className="text-[15px] font-bold text-neutral-900">Generate Summary</h4>
            </div>
            <p className="text-[13px] text-neutral-500 font-normal pl-0.5">
              Get a concise summary of the entire document.
            </p>
          </div>
          
          <button
            onClick={handleGenerateSummary}
            disabled={loadingAction === "summary"}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm shrink-0 min-w-[110px] flex items-center justify-center gap-2 ${
              loadingAction === "summary"
                ? "bg-[#6cbfa2] text-white/90 cursor-not-allowed"
                : "bg-[#42bda1] text-white hover:bg-[#39a68d]"
            }`}
          >
            {loadingAction === "summary" ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              "Summarize"
            )}
          </button>
        </div>

        {/* 2. Explain a Concept Action Box */}
        <div className="border border-neutral-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white">
          <form onSubmit={handleExplainConcept} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center bg-[#fef3c7] text-[#d97706] rounded-lg">
                  <Lightbulb size={15} />
                </div>
                <h4 className="text-[15px] font-bold text-neutral-900">Explain a Concept</h4>
              </div>
              <p className="text-[13px] text-neutral-500 font-normal pl-0.5">
                Enter a topic or concept from the document to get a detailed explanation.
              </p>
            </div>

            {/* Input and Button Inline Section */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., 'React Hooks'"
                disabled={loadingAction === "explain"}
                className="w-full text-sm border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-[#42bda1] transition-all bg-white text-neutral-800 placeholder-neutral-400"
              />
              <button
                type="submit"
                disabled={loadingAction === "explain" || !concept.trim()}
                className={`w-full sm:w-auto px-7 py-3 rounded-xl font-medium text-sm transition-all shadow-sm shrink-0 min-w-[100px] flex items-center justify-center gap-2 ${
                  loadingAction === "explain" || !concept.trim()
                    ? "bg-[#a3decb] text-white/90 cursor-not-allowed shadow-none"
                    : "bg-[#42bda1] text-white hover:bg-[#39a68d]"
                }`}
              >
                {loadingAction === "explain" ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  "Explain"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Interactive Floating Modal Dialog Layer */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-neutral-100 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-3">
              <h3 className="text-base font-bold text-neutral-900">{modalTitle}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors text-xl font-medium"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1">
              <MarkdownRenderer content={modalContent} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIActions;