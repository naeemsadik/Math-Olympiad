import type {
  AbilityLevel,
  Difficulty,
  Question,
  QuestionFormat,
  QuestionMedia,
  QuestionOption,
  Test,
} from "@/types";

export const abilityLevels: AbilityLevel[] = ["Beginner", "Advanced", "Expert"];
export const questionFormats: QuestionFormat[] = ["text-to-text", "text-to-image", "image-to-text", "image-to-image"];
export const ALL_CLASS_YEARS = "All Classes";

export const formatLabels: Record<QuestionFormat, string> = {
  "text-to-text": "Text to Text",
  "text-to-image": "Text to Image",
  "image-to-text": "Image to Text",
  "image-to-image": "Image to Image",
};

export const abilityColors: Record<AbilityLevel, string> = {
  Beginner: "#10b981",
  Advanced: "#d97706",
  Expert: "#ef4444",
};

export const classYearOptions = [
  ALL_CLASS_YEARS,
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Masters",
  "PhD",
  "Post-Doc",
];

export function difficultyToAbility(difficulty: Difficulty): AbilityLevel {
  if (difficulty === "Elite") return "Expert";
  if (difficulty === "Advanced") return "Advanced";
  return "Beginner";
}

export function abilityToDifficulty(ability: AbilityLevel): Difficulty {
  if (ability === "Expert") return "Elite";
  if (ability === "Advanced") return "Advanced";
  return "Beginner";
}

export function abilityAllows(studentAbility: AbilityLevel, contentAbility: AbilityLevel) {
  return abilityLevels.indexOf(contentAbility) >= abilityLevels.indexOf(studentAbility);
}

export function determineAbility(score: number, advancedThreshold = 50, expertThreshold = 80): AbilityLevel {
  if (score >= expertThreshold) return "Expert";
  if (score >= advancedThreshold) return "Advanced";
  return "Beginner";
}

export function mediaKindForPrompt(format: QuestionFormat): QuestionMedia["kind"] {
  return format.startsWith("image") ? "image" : "text";
}

export function mediaKindForOptions(format: QuestionFormat): QuestionMedia["kind"] {
  return format.endsWith("image") ? "image" : "text";
}

export function makeTextMedia(value = ""): QuestionMedia {
  return { kind: "text", value };
}

export function makeImageMedia(value = "", alt = "Question image"): QuestionMedia {
  return { kind: "image", value, alt };
}

export function makeOption(index: number, kind: QuestionMedia["kind"] = "text", value = ""): QuestionOption {
  return {
    id: `opt-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    media: kind === "image" ? makeImageMedia(value, `Option ${index + 1}`) : makeTextMedia(value),
    isCorrect: index === 0,
  };
}

export function stripMathSyntax(value: string) {
  return value.replace(/\$/g, "").replace(/\\/g, "");
}

export function normalizeQuestion(question: Question): Question {
  const format = question.format ?? "text-to-text";
  const promptKind = mediaKindForPrompt(format);
  const optionKind = mediaKindForOptions(format);
  const answerOptions =
    question.answerOptions && question.answerOptions.length > 0
      ? question.answerOptions
      : question.options.map((option, index) => ({
          id: `${question.id}-option-${index}`,
          media: optionKind === "image" ? makeImageMedia(option, `Option ${index + 1}`) : makeTextMedia(option),
          isCorrect: index === question.correctOption,
        }));

  const abilityLevel = question.abilityLevel ?? difficultyToAbility(question.difficulty);

  return {
    ...question,
    format,
    prompt: question.prompt ?? (promptKind === "image" ? makeImageMedia(question.content, "Question prompt") : makeTextMedia(question.content)),
    answerOptions,
    options: answerOptions.map((option) => option.media.value),
    correctOption: Math.max(0, answerOptions.findIndex((option) => option.isCorrect)),
    timeLimitSeconds: question.timeLimitSeconds ?? 90,
    targetClassYear: question.targetClassYear ?? ALL_CLASS_YEARS,
    abilityLevel,
    marks: question.marks ?? 1,
    subtopicTags: question.subtopicTags ?? [],
    status: question.status ?? "published",
    isDiagnosticEligible: question.isDiagnosticEligible ?? true,
  };
}

export function normalizeTest(test: Test): Test {
  const abilityLevel = test.abilityLevel ?? difficultyToAbility(test.difficulty);
  return {
    ...test,
    testType: test.testType ?? "practice",
    targetClassYear: test.targetClassYear ?? ALL_CLASS_YEARS,
    abilityLevel,
    questionIds: test.questionIds ?? [],
    randomQuestionCount: test.randomQuestionCount ?? test.questionCount,
    advancedThreshold: test.advancedThreshold ?? 50,
    expertThreshold: test.expertThreshold ?? 80,
  };
}

export function questionMatchesClass(question: Question, classYear?: string) {
  const target = question.targetClassYear ?? ALL_CLASS_YEARS;
  return target === ALL_CLASS_YEARS || !classYear || target === classYear;
}

export function testMatchesClass(test: Test, classYear?: string) {
  const target = test.targetClassYear ?? ALL_CLASS_YEARS;
  return target === ALL_CLASS_YEARS || !classYear || target === classYear;
}

export function pickRandomIds(ids: string[], count: number) {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export function shuffleOnce(ids: string[]) {
  return pickRandomIds(ids, ids.length);
}

export function sumQuestionTimeSeconds(questions: Question[]) {
  return questions.reduce((total, question) => total + (question.timeLimitSeconds ?? 90), 0);
}

export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  const parts: string[] = [];
  if (hours) parts.push(`${hours} hr${hours === 1 ? "" : "s"}`);
  if (minutes) parts.push(`${minutes} min`);
  if (remainder || parts.length === 0) parts.push(`${remainder} sec`);
  return parts.join(" ");
}
