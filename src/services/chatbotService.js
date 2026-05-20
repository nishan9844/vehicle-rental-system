import { blockedChatbotKeywords, chatbotTraining } from "../data/chatbotTraining";

function normalize(text) {
  return String(text || "").toLowerCase().trim();
}

function scoreTopic(message, topic) {
  return topic.keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalize(keyword);
    if (!normalizedKeyword) return score;
    return message.includes(normalizedKeyword) ? score + normalizedKeyword.length : score;
  }, 0);
}

export function getChatbotReply(message) {
  const cleanMessage = normalize(message);

  if (!cleanMessage) {
    return chatbotTraining.fallback;
  }

  if (blockedChatbotKeywords.some((keyword) => cleanMessage.includes(normalize(keyword)))) {
    return chatbotTraining.safetyFallback;
  }

  const rankedTopic = chatbotTraining.topics
    .map((topic) => ({
      topic,
      score: scoreTopic(cleanMessage, topic),
    }))
    .sort((a, b) => b.score - a.score)[0];

  if (rankedTopic?.score > 0) {
    return rankedTopic.topic.answer;
  }

  return chatbotTraining.fallback;
}

export function getInitialChatbotMessage() {
  return `Hi! I am ${chatbotTraining.assistantName}, your ${chatbotTraining.businessName} rental assistant. How can I help?`;
}
